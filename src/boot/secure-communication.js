import EventEmitter from "events"

class SecureCommunication extends EventEmitter {
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


export default ({ Vue }) => {
    Vue.prototype.$q.SecureCommunication = new SecureCommunication()
}
