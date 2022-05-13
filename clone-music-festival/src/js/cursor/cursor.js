class Cursor extends Sketch {
    constructor(el) {
        super(el)
        if (el instanceof Element) {
            this.mouse = new THREE.Vector2()
            this.isHover = false
            this.mousemove = this.mousemove.bind(this)

            window.addEventListener('mousemove', this.mousemove)

            this.update()
        }
    }

    addClickEffect(Effect) {
        if (Effect) {
            this.click = this.click.bind(this)
            window.addEventListener('click', this.click)

            this.effect = new Effect(this.ctx)
        }
    }

    mousemove({ clientX, clientY }) {
        const { width, height } = this.viewport
        const x = (clientX / width) * 2 - 1
        const y = (clientY / height) * 2 - 1
        this.mouse.set(x, y)

        const pointEl = document.elementFromPoint(clientX, clientY)
        if (pointEl) {
            const { tagName, dataset } = pointEl
            if (tagName === 'A' || dataset.href) {
                if (!this.isHover) {
                    this.isHover = true
                    this.transitionCursor?.()
                }
                return
            }
        }
        if (this.isHover) {
            this.isHover = false
            this.transitionCursor?.()
        }
    }

    click() {
        const { width, height } = this.viewport
        const { x: mx, y: my } = this.mouse

        this.effect.addEffect((mx * width) / 2, (my * height) / 2)
    }

    update() {
        this.reqRenders.push((t) => {
            this.effect.update?.()
        })
    }
}
