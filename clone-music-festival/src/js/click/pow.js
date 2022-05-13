class Pow {
    constructor(ctx, options) {
        this.ctx = ctx
        this.options = {
            counts: 30,
            velocity: 1,
            acceleration: 2,
            life: 200,
            colors: ['#40587c', '#5a7c40', '#e2ae4a', '#dddddd'],
            ...options,
        }
        this.particles = []
        this.circles = []
    }

    addEffect(x, y) {
        this.createParticles(x, y)
        this.createCircle(x, y)
    }

    createParticles(x, y) {
        const { counts, velocity, acceleration, life, colors } = this.options

        for (let i = 0; i < counts; i++) {
            this.particles.push({
                p: new THREE.Vector2(x, y),
                v: new THREE.Vector2((Math.random() - 0.5) * velocity, (Math.random() - 0.5) * velocity),
                a: new THREE.Vector2(
                    (Math.random() - 0.5) * acceleration,
                    (Math.random() - 0.5) * acceleration
                ),
                s: Math.random() * 40,
                t: life,
                tt: life,
                ts: Math.random() * 5 + 5,
                c: colors[(Math.random() * colors.length) >> 0],
            })
        }
    }

    createCircle(x, y) {
        const { velocity, acceleration, life, colors } = this.options

        this.circles.push({
            p: new THREE.Vector2(x, y),
            v: Math.random() * 6 + velocity,
            a: Math.random() * 6 + acceleration,
            s: 0,
            t: life,
            tt: life,
            ts: Math.random() * 5 + 7,
            c: colors[(Math.random() * colors.length) >> 0],
        })
    }

    update() {
        for (let i = 0; i < this.particles.length; i++) {
            const { p, v, a, s, t, tt, ts, c } = this.particles[i]
            v.add(a)
            p.add(v)
            v.multiplyScalar(0.97)
            a.multiplyScalar(0.97)

            const size = s * (t / tt)

            this.ctx.fillStyle = c + 'cc'
            this.ctx.beginPath()
            this.ctx.arc(p.x, p.y, size, 0, 2 * Math.PI)
            this.ctx.fill()

            this.particles[i].t = t - ts

            if (t < ts) {
                this.particles.splice(i, 1)
                i--
            }
        }

        for (let i = 0; i < this.circles.length; i++) {
            let { p, v, a, s, t, tt, ts, c } = this.circles[i]
            v += a
            this.circles[i].s += v
            v *= 0.97
            a *= 0.97

            this.ctx.globalAlpha = t / tt
            this.ctx.strokeStyle = c
            this.ctx.lineWidth = 2
            this.ctx.beginPath()
            this.ctx.arc(p.x, p.y, s, 0, 2 * Math.PI)
            this.ctx.stroke()

            this.circles[i].t = t - ts

            if (t < ts) {
                this.circles.splice(i, 1)
                i--
            }
        }
    }
}
