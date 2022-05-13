class Rotate extends Scroll {
    constructor(options) {
        super({
            scrub: null,
            ease: null,
            ...options,
        })

        this.setup()
    }

    setup() {
        this.els.forEach((el) => {
            const {
                scrollRotate,
                scrollOrigin,
                scrollOpacity,
                scrollDelay,
                scrollDuration,
                scrollEase,
            } = el.dataset

            gsap.set(el, {
                transformOrigin: scrollOrigin || 'left top',
            })

            const tween = gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    toggleActions: 'restart none none reverse',
                },
                duration: scrollDuration || 0.5,
                delay: scrollDelay,
                ease: scrollEase || 'power1.out',
                rotate: scrollRotate,
                opacity: scrollOpacity,
            })
            this.tweens.push(tween)
        })
    }
}
