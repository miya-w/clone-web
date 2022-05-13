class Loading {
    constructor(stacks, options) {
        this.options = {
            minTime: 1000,
            ...options,
        }
        this.stacks = [
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve()
                }, this.options.minTime)
            }),
        ]
        this.onEvents = {}

        this.add(stacks)
    }

    add(payload) {
        if (Array.isArray(payload)) {
            const promise = Promise.all(payload.filter((p) => p instanceof Promise))
            this.stacks.push(promise)
            return promise
        }
        if (payload instanceof Promise) {
            this.stacks.push(payload)
            return payload
        }
    }

    del() {
        this.stacks.shift()
    }

    waitLoading() {
        const lockEl = document.querySelector('.o-loading')
        bodyScrollLock.disableBodyScroll(lockEl, {
            reserveScrollBarGap: true,
        })

        return Promise.all(this.stacks).then((results) => {
            bodyScrollLock.enableBodyScroll(lockEl)
            results.forEach((result) => {
                this.del()
            })
            this.onEvents.loadingDone?.()
        })
    }

    on(name, callback) {
        if (typeof name === 'string' && typeof callback === 'function') {
            this.onEvents[name] = callback
        }
    }
}
