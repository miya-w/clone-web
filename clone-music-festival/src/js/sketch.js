class Sketch {
    constructor(el, options) {
        if (el instanceof Element) {
            this.el = el
            this.options = {
                clear: true,
                autoRender: true,
                ...options,
            }
            this.reqRenders = []
            this.onEvents = {}
            this.render = this.render.bind(this)
            this.resize = this.resize.bind(this)

            const { width, height, dpr } = this.viewport
            this.canvas = document.createElement('canvas')
            this.canvas.width = width * dpr
            this.canvas.height = height * dpr
            this.ctx = this.canvas.getContext('2d')
            this.el.appendChild(this.canvas)

            if (this.options.autoRender) {
                this.render()
            }
            window.addEventListener('resize', this.resize)
        }
    }

    render() {
        this.reqID = window.requestAnimationFrame(this.render)

        const { width, halfWight, height, halfHeight, dpr } = this.viewport
        const { clear } = this.options

        if (clear) {
            this.ctx.clearRect(0, 0, width * dpr, height * dpr)
        }
        this.ctx.save()
        this.ctx.translate(halfWight * dpr, halfHeight * dpr)
        this.ctx.scale(dpr, dpr)
        for (let i = 0; i < this.reqRenders.length; i++) {
            this.reqRenders[i](this.reqID)
        }
        this.ctx.restore()
    }

    resize() {
        const { width, height, dpr } = this.viewport
        this.canvas.width = width * dpr
        this.canvas.height = height * dpr
    }

    stop() {
        window.cancelAnimationFrame(this.reqID)
    }

    destroy() {
        this.stop()
        this.el.removeChild(this.canvas)

        window.removeEventListener('resize', this.resize)
    }

    on(name, callback) {
        if (typeof name === 'string' && typeof callback === 'function') {
            this.onEvents[name] = callback
        }
    }

    get viewport() {
        const dpr = 1.5
        const { width, height } = this.el.getBoundingClientRect()
        return {
            width,
            height,
            halfWight: width / 2,
            halfHeight: height / 2,
            dpr,
        }
    }
}
