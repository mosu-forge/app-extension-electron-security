import EventEmitter from "events"

class SecureBridge extends EventEmitter {
    constructor() {
        super()
        window.addEventListener("message", (event) => {
            if(event.source == window && event.data.type && event.data.type == "P_ANSWER") {
                this.emit("message", event.data.message)
            }
        }, false)
    }
    send(message) {
        window.postMessage({ type: "P_MESSAGE", message }, document.defaultView.location.origin)
    }
}


export default ({ app, Vue }) => {
    app.SecureBridge = Vue.prototype.$q.SecureBridge = new SecureBridge()
}
