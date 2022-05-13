gsap.registerPlugin(ScrollTrigger)

class Scroll {
    constructor(options) {
        this.tweens = []
        this.els = document.querySelectorAll('[data-scroll]')
        this.options = {
            start: '0% 80%',
            end: '100% 80%',
            scrub: 1,
            ease: 'none',
            markers: false,
            ...options,
        }

        ScrollTrigger.defaults({ ...this.options })
    }

    destroy() {
        while (this.tweens.length) {
            let tween = this.tweens.pop()
            tween.scrollTrigger.kill(true)
            tween.kill()
            tween = null
        }
    }

    refresh() {
        requestAnimationFrame(() => {
            ScrollTrigger.refresh()
        })
    }
}
