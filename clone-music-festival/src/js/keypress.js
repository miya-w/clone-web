class Keypress {
    constructor(...args) {
        this.allowKeys = args.map((key) => {
            if (Array.isArray(key)) {
                return key.map((k) => k.toLowerCase())
            }
            return key.toLowerCase()
        })
        this.pressKeys = new Set()
        this.keypress = this.keypress.bind(this)
        this.keyup = this.keyup.bind(this)

        this.el = document.querySelector('.page-layout')

        window.addEventListener('keypress', this.keypress)
        window.addEventListener('keyup', this.keyup)
    }

    keypress(e) {
        let { key: pressKey } = e
        pressKey = pressKey.toLowerCase()
        this.pressKeys.add(pressKey)

        if (this.checkActive()) {
            this.el.style.filter = 'grayscale(1) brightness(0.4)'
        }
    }

    keyup(e) {
        let { key: pressKey } = e
        pressKey = pressKey.toLowerCase()
        this.pressKeys.delete(pressKey)

        if (!this.checkActive()) {
            this.el.style.filter = 'none'
        }
    }

    checkActive() {
        return this.allowKeys.some((key) => {
            if (Array.isArray(key)) {
                return key.every((k) => this.pressKeys.has(k))
            }
            return this.pressKeys.has(key)
        })
    }
}
