class Scale extends Cursor {
    constructor(el, options) {
        super(el)
        if (el instanceof Element) {
            this.options = {
                size: 10,
                activeScale: 4,
                ...options,
                ...this.options,
            }
            this.cursorSize = this.options.size

            const { device } = detect.parse(navigator.userAgent)
            if (device.type === 'Desktop') {
                this.createCursor()
            }
        }
    }

    transitionCursor() {
        const { size, activeScale } = this.options

        if (this.isHover) {
            gsap.to(this, {
                cursorSize: size * activeScale,
            })
            return
        }
        gsap.to(this, {
            cursorSize: size,
        })
    }

    createCursor() {
        this.reqRenders.push((t) => {
            const { width, height } = this.viewport
            const { x, y } = this.mouse

            this.ctx.fillStyle = '#dddddd99'
            this.ctx.beginPath()
            this.ctx.arc((x * width) / 2, (y * height) / 2, this.cursorSize, 0, 2 * Math.PI)
            this.ctx.fill()
        })
    }
}
