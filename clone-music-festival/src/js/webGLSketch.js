const defaultResources = [
    {
        type: 'texture',
        name: 'bg',
        src: 'https://i.imgur.com/r92HRnX.png',
        // src: 'https://i.imgur.com/ywjElmy.png',
        // src: 'https://i.imgur.com/vvj9Eos.png',
        // 尺寸 1440*768 , 去背PNG檔 , 將視覺重點在中間800*500的位子
    },
]

class WebGLSketch {
    constructor(el) {
        if (el instanceof Element) {
            this.el = el
            this.reqRenders = []
            this.resizes = []
            this.resources = []
            this.events = []
            this.clock = new THREE.Clock()
            this.render = this.render.bind(this)

            this.loadStatus = {
                total: 0,
                progress: 0,
                isDone: false,
            }
            this.loaderManager = new THREE.LoadingManager()
            this.loaderManager.onProgress = (url, itemsLoaded, itemsTotal) => {
                this.loadStatus.total = itemsTotal
                this.loadStatus.progress = itemsLoaded / this.loadStatus.total
            }
            this.loaderManager.onLoad = () => {
                this.loadStatus.isDone = true
            }
            this.textureLoader = new THREE.TextureLoader(this.loaderManager)
        }
    }

    async init() {
        await Promise.all([this.loadDefaultResources()])
        const { width, height, aspect, dpr } = this.viewport
        this.scene = new THREE.Scene()

        this.renderer = new THREE.WebGLRenderer({
            powerPreference: 'high-performance',
            antialias: dpr <= 1,
            alpha: true,
        })
        this.renderer.setSize(width, height)
        this.renderer.setPixelRatio(dpr)
        this.el.appendChild(this.renderer.domElement)

        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.01, 100)
        this.camera.position.set(0, 0, 3)

        this.addEvent(this.resize.bind(this), window, 'resize')
        this.render()

        this.resizes.push(() => {
            const { width, height, aspect } = this.viewport
            this.renderer.setSize(width, height)

            this.camera.aspect = aspect
            this.camera.updateProjectionMatrix()
        })
    }

    resize() {
        for (let i = 0, len = this.resizes.length; i < len; i++) {
            this.resizes[i]()
        }
    }

    render() {
        this.reqID = requestAnimationFrame(this.render)

        const d = this.clock.getDelta()
        for (let i = 0, len = this.reqRenders.length; i < len; i++) {
            this.reqRenders[i](d, this.clock.elapsedTime)
        }
    }

    stop() {
        window.cancelAnimationFrame(this.reqID)
    }

    destroy() {
        this.stop()
        this.renderer.domElement.addEventListener('dblclick', null, false)

        this.removeEvents()
        this.disposeObject(this.scene)
        this.renderer.forceContextLoss()
        this.scene = null
        this.camera = null
        this.renderer = null
        while (this.el.lastChild) {
            this.el.removeChild(this.el.lastChild)
        }
    }

    async loadDefaultResources() {
        return await this.addResources(defaultResources)
    }

    async addResource(payload) {
        let { type, src, name, options } = payload

        let resource
        if (type === 'texture') {
            resource = await this.loadTexture(src, options)
        }
        if (resource) {
            this.resources.push({
                type,
                name: name || src,
                resource,
            })
        }
        return resource
    }

    async addResources(payload) {
        const promises = payload.map((resource) => this.addResource(resource))

        return await Promise.all(promises).then((result) => result)
    }

    getResource = (() => {
        const memo = {}
        return (string, type = 'name') => {
            if (memo[string]) return memo[string]
            const target = this.resources.find((resource) => resource[type] === string)
            memo[string] = target
            return target
        }
    })()

    getResources(payload, type = 'name') {
        if (typeof payload === 'function') {
            return this.resources.filter(payload)
        }
        return this.resources.filter((resource) => resource[type] === payload)
    }

    loadTexture(url, options) {
        return new Promise((resolve) => {
            this.textureLoader.load(url, (texture) => {
                for (const key in options) {
                    texture[key] = options[key]
                }
                resolve(texture)
            })
        })
    }

    disposeObject(obj) {
        while (obj.children.length > 0) {
            this.disposeObject.bind(this)(obj.children[0])
            obj.remove(obj.children[0])
        }
        if (obj.geometry) {
            obj.geometry.dispose()
        }

        if (obj.material) {
            Object.keys(obj.material).forEach((prop) => {
                if (!obj.material[prop]) {
                    return
                }
                if (typeof obj.material[prop].dispose === 'function') {
                    obj.material[prop].dispose()
                }
            })
            obj.material.dispose()
        }
    }

    addEvent(event, object, type) {
        const instance = {
            event,
            object,
            type,
        }
        this.events.push(instance)
        object.addEventListener(type, event)
        return instance
    }

    removeEvent(instance) {
        const { event, object, type } = instance
        const index = this.events.findIndex((item) => item === instance)
        if (~index) {
            object.removeEventListener(type, event)
            this.events.splice(index, 1)
        }
    }

    removeEvents() {
        while (this.events.length) {
            const { event, object, type } = this.events.pop()
            object.removeEventListener(type, event)
        }
    }

    get viewport() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            aspect: window.innerWidth / window.innerHeight,
            dpr: Math.min(window.devicePixelRatio, 1.5),
        }
    }

    get viewSize() {
        const distance = this.camera.position.z
        const vFov = THREE.Math.degToRad(this.camera.fov)
        const height = 2 * Math.tan(vFov / 2) * distance
        const width = height * this.viewport.aspect
        return { width, height, vFov }
    }
}
