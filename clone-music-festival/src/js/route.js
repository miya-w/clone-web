class Route {
    constructor() {
        this.routeName = location.hash.replace('#', '') || 'index'
        this.pages = document.querySelectorAll('[data-route]')
        this.routeChange = this.routeChange.bind(this)
        this.onEvents = {}

        this.pages.forEach((page) => {
            const { route } = page.dataset
            if (this.routeName !== route) {
                page.style.display = 'none'
            } else {
                document.querySelector(`[data-href='${route}']`).classList.add('-route-exact')
            }
        })
        window.addEventListener('hashchange', this.routeChange)
    }

    routeChange() {
        const hash = location.hash.replace('#', '') || 'index'

        const fromRoute = document.querySelector(`[data-route='${this.routeName}']`)
        const toRoute = document.querySelector(`[data-route='${hash}']`)
        if (fromRoute && toRoute) {
            fromRoute.style.display = 'none'
            document
                .querySelector(`[data-href='${this.routeName}']`)
                .classList.remove('-route-exact')
            toRoute.style.display = 'block'
            document.querySelector(`[data-href='${hash}']`).classList.add('-route-exact')
            this.routeName = hash
        }
    }

    async to(route) {
        const toRoute = document.querySelector(`[data-route='${route}']`)
        if (toRoute && route !== this.routeName) {
            await this.beforeRouteChange(this.routeName, route)
            location.hash = route
            this.afterRouteChange(this.routeName, route)
        }
    }

    beforeRouteChange(from, to) {
        return new Promise((resolve) => {
            if (this.onEvents.beforeRouteChange) {
                this.onEvents.beforeRouteChange?.(from, to, resolve)
            } else {
                resolve()
            }
        })
    }

    afterRouteChange(from, to) {
        this.onEvents.afterRouteChange?.(from, to)
    }

    on(name, callback) {
        if (typeof name === 'string' && typeof callback === 'function') {
            this.onEvents[name] = callback
        }
    }
}
