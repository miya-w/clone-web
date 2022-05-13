class Leave {
    constructor(el) {
        if (el instanceof Element) {
            this.el = el
            this.path = null
            this.svgPaths = []
        }
    }

    startTransition() {
        if (this.path && this.path instanceof SVGPathElement) {
            return new Promise((resolve) => {
                const traverse = (step = 0) => {
                    gsap.to(this.path, {
                        duration: 1 / this.svgPaths.length,
                        ease: 'none',
                        attr: {
                            d: this.svgPaths[step],
                        },
                        onComplete: () => {
                            if (step < this.svgPaths.length - 1) {
                                traverse(step + 1)
                            } else {
                                gsap.to('.page-layout__route-transition-loading', {
                                    opacity: 1,
                                    onComplete: () => {
                                        resolve()
                                    },
                                })
                            }
                        },
                    })
                }
                traverse()
            })
        }
    }

    endTransition() {
        if (this.path && this.path instanceof SVGPathElement) {
            return new Promise((resolve) => {
                const traverse = (step = this.svgPaths.length - 1) => {
                    gsap.to(this.path, {
                        duration: 1 / this.svgPaths.length,
                        ease: 'none',
                        attr: {
                            d: this.svgPaths[step],
                        },
                        onStart: () => {
                            gsap.to('.page-layout__route-transition-loading', {
                                opacity: 0,
                            })
                        },
                        onComplete: () => {
                            if (step > 0) {
                                traverse(step - 1)
                            } else {
                                resolve()
                            }
                        },
                    })
                }
                traverse()
            })
        }
    }
}
