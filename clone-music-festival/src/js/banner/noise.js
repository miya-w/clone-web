class Noise extends WebGLSketch {
    constructor(el) {
        super(el)

        this.init()
    }
    async init() {
        await super.init()

        this.createShaderSketch()

        this.reqRenders.push(() => {
            this.renderer.render(this.scene, this.camera)
        })
    }
    createShaderSketch() {
        const { width: vpWidth, height: vpHeight } = this.viewport
        const { width, height } = this.viewSize
        const { noiseStrength, noiseSpeed } = this.el.dataset

        const texture = this.getResource('bg').resource

        const uniforms = {
            uResolution: new THREE.Uniform(new THREE.Vector2(vpWidth, vpHeight)),
            uTime: new THREE.Uniform(0),
            uTexture: new THREE.Uniform(texture),
            uTextureRatio: new THREE.Uniform(texture.image.width / texture.image.height),
            uStrength: new THREE.Uniform(Number(noiseStrength)),
            uSpeed: new THREE.Uniform(Number(noiseSpeed)),
        }

        const geometry = new THREE.PlaneBufferGeometry(1, 1, 64, 64)

        const material = new THREE.ShaderMaterial({
            vertexShader: `
                uniform float uTime;
                uniform float uStrength;
                uniform float uSpeed;

                varying vec2 vUv;

                //	Simplex 3D Noise 
                //	by Ian McEwan, Ashima Arts
                //
                vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
                vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

                float snoise(vec3 v){ 
                const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
                const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

                // First corner
                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 =   v - i + dot(i, C.xxx) ;

                // Other corners
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );

                //  x0 = x0 - 0. + 0.0 * C 
                vec3 x1 = x0 - i1 + 1.0 * C.xxx;
                vec3 x2 = x0 - i2 + 2.0 * C.xxx;
                vec3 x3 = x0 - 1. + 3.0 * C.xxx;

                // Permutations
                i = mod(i, 289.0 ); 
                vec4 p = permute( permute( permute( 
                            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                        + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

                // Gradients
                // ( N*N points uniformly over a square, mapped onto an octahedron.)
                float n_ = 1.0/7.0; // N=7
                vec3  ns = n_ * D.wyz - D.xzx;

                vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);

                vec4 b0 = vec4( x.xy, y.xy );
                vec4 b1 = vec4( x.zw, y.zw );

                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));

                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);

                //Normalise gradients
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;

                // Mix final noise value
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                                dot(p2,x2), dot(p3,x3) ) );
                }

                void main(){
                    vec3 pos = position.xyz;
                    float n = snoise(vec3(pos.xy * 3., uTime / 2. * uSpeed)) * 0.02 * uStrength;
                    pos +=n ;
                    vec4 modelPosition = modelMatrix * vec4(pos, 1.);
                    vec4 modelViewPosition = viewMatrix * modelPosition;
                    vec4 projectionPosition = projectionMatrix * modelViewPosition;

                    gl_Position = projectionPosition;

                    vUv = uv;
                }
            `,
            fragmentShader: `
                uniform float uTextureRatio;
                uniform vec2 uResolution;
                uniform sampler2D uTexture;
                
                varying vec2 vUv;

                vec2 containUv(vec2 uv, float aspectRatio, float ratio){
                    vec2 scale = vec2(1.);
                    
                    if(ratio > aspectRatio) {
                        scale = vec2(1., ratio / aspectRatio);
                    } else {
                        scale = vec2(aspectRatio / ratio, 1.);
                    }

                    if(aspectRatio < 0.75) {
                        scale *= aspectRatio;
                    }

                    return (uv - vec2(0.5)) * scale + vec2(0.5);
                }
                
                void main(){
                    vec2 uv = containUv(vUv, uResolution.x / uResolution.y, uTextureRatio);

                    vec4 final = texture2D(uTexture, uv);
                    
                    gl_FragColor = final;
                }
            `,
            uniforms,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
            depthTest: false,
        })
        const planeSketch = new THREE.Mesh(geometry, material)
        planeSketch.scale.set(width, height, 1)
        this.scene.add(planeSketch)

        this.reqRenders.push((d, t) => {
            uniforms.uTime.value = t
        })
        this.resizes.push(() => {
            const { width: vpWidth, height: vpHeight } = this.viewport
            const { width, height } = this.viewSize
            uniforms.uResolution.value = new THREE.Vector2(vpWidth, vpHeight)
            planeSketch.scale.set(width, height, 1)
        })
    }
}
