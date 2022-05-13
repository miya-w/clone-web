class Line {
    constructor(ctx, options) {
        this.ctx = ctx
        this.options = {
            counts: 4,
            life: 200,
            colors: ['#dddddd'],
            ...options,
        }
        this.lines = []
        this.circles = []

        document.querySelector('.page-layout__cursor').style.filter = 'none'
    }

    addEffect(x, y) {
        this.createLines(x, y)
        // this.createCircle(x, y)
    }

    createLines(x, y) {
        const { counts, life, colors } = this.options

        for (let i = 0; i < counts; i++) {
            const angle = i * ((Math.PI * 2) / counts)
            const gradient = this.ctx.createLinearGradient(0, 0, 80, 0)
            gradient.addColorStop(0, 'transparent')
            gradient.addColorStop(1, colors[(Math.random() * colors.length) >> 0])

            this.lines.push({
                p: new THREE.Vector2(x, y),
                s: 100,
                t: life,
                tt: life,
                ts: 15,
                c: gradient,
                angle,
            })
        }
    }

    createCircle(x, y) {
        const { life, colors } = this.options

        this.circles.push({
            p: new THREE.Vector2(x, y),
            s: 40,
            t: life,
            tt: life,
            ts: 25,
            c: colors[(Math.random() * colors.length) >> 0],
        })
    }

    update() {
        for (let i = 0; i < this.lines.length; i++) {
            const { p, s, t, tt, ts, c, angle } = this.lines[i]

            const progress = 1 - t / tt
            const size = s * progress
            this.lines[i].angle += 0.03

            this.ctx.save()
            this.ctx.translate(p.x, p.y)
            this.ctx.rotate(angle)
            this.ctx.fillStyle = c
            if (progress > 0.5) {
                this.ctx.fillRect(s / 2, 0, -s + size, 0.5)
            } else {
                this.ctx.fillRect(0, 0, size, 0.5)
            }
            this.ctx.restore()

            this.lines[i].t = t - ts

            if (t < ts) {
                this.lines.splice(i, 1)
                i--
            }
        }

        for (let i = 0; i < this.circles.length; i++) {
            let { p, s, t, tt, ts, c } = this.circles[i]

            const progress = t / tt
            const size = s * progress

            this.ctx.strokeStyle = c + '66'
            this.ctx.lineWidth = size
            this.ctx.beginPath()
            this.ctx.arc(p.x, p.y, s - size / 2, 0, 2 * Math.PI)
            this.ctx.stroke()

            this.circles[i].t = t - ts

            if (t < ts) {
                this.circles.splice(i, 1)
                i--
            }
        }
    }
}
