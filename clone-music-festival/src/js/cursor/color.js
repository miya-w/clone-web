class Color extends Cursor {
    constructor(el, options) {
        super(el)
        if (el instanceof Element) {
            this.options = {
                size: 10,
                color: '#dddddd99',
                activeColor: '#5a7c40cc',
                ...options,
                ...this.options,
            }
            this.cursorColor = this.options.color

            const { device } = detect.parse(navigator.userAgent)
            if (device.type === 'Desktop') {
                this.createCursor()
            }
        }
    }

    transitionCursor() {
        const { color, activeColor } = this.options

        if (this.isHover) {
            gsap.to(this, {
                cursorColor: activeColor,
            })
            return
        }
        gsap.to(this, {
            cursorColor: color,
        })
    }

    createCursor() {
        this.reqRenders.push((t) => {
            const { width, height } = this.viewport
            const { x, y } = this.mouse

            this.ctx.fillStyle = this.cursorColor
            this.ctx.beginPath()
            this.ctx.arc((x * width) / 2, (y * height) / 2, this.options.size, 0, 2 * Math.PI)
            this.ctx.fill()
        })
    }
}
