class ParallaxPart {
    constructor(el, options) {
        if (el instanceof Element) {
            this.el = el
            this.options = {
                strength: this.el.dataset.parallaxStrength || 10,
                ...options,
            }
        }
    }

    update(x, y) {
        const { strength } = this.options

        this.el.style.transform = `translate3d(${-x * strength}px, ${-y * strength}px, 0)`
    }
}

class Parallax {
    constructor() {
        this.position = new THREE.Vector2()
        this.lerpMouse = new THREE.Vector2()
        this.move = this.move.bind(this)
        this.render = this.render.bind(this)

        this.parts = []

        const els = document.querySelectorAll('[data-parallax]')
        els.forEach((el) => {
            el.style.display = 'block'
            this.parts.push(new ParallaxPart(el))
        })

        this.setup()
    }

    setup() {
        window.addEventListener('mousemove', this.move)
        window.addEventListener('touchmove', this.move)

        this.render()
    }

    move(e) {
        let clientX, clientY
        if (e.type === 'touchmove') {
            ;({ clientX, clientY } = e.touches[0])
        } else {
            ;({ clientX, clientY } = e)
        }
        const x = (clientX / window.innerWidth) * 2 - 1
        const y = (clientY / window.innerHeight) * 2 - 1
        this.position.set(x, y)
    }

    render() {
        this.reqID = window.requestAnimationFrame(this.render)

        this.lerpMouse = this.lerpMouse.lerp(this.position, 0.1)

        for (let i = 0; i < this.parts.length; i++) {
            this.parts[i].update(this.lerpMouse.x, this.lerpMouse.y)
        }
    }

    stop() {
        window.cancelAnimationFrame(this.reqID)
    }

    destroy() {
        window.removeEventListener('mousemove', this.move)
        window.removeEventListener('touchmove', this.move)

        this.stop()
    }
}
