import EventEmitter from "events"

class SecureBridge extends EventEmitter {
    constructor() {
        super()
        this.id = 0
        this.promises = new Map()
        window.addEventListener("message", (event) => {
            if(event.source == window && event.data.type && event.data.type == "P_MESSAGE_RENDER") {
                this.receive(event.data)
            }
        }, false)
    }
    receive(data) {
        switch(data.subtype) {
            case "P_SET_STATICS_DIR":
                window.__statics = data.path
                break
            case "PROMISE_RENDER":
                if(data.id && this.promises.has(data.id)) {
                    if(data.status == "RESOLVE") {
                        this.promises.get(data.id)[0](data.message)
                    } else {
                        this.promises.get(data.id)[1](data.message)
                    }
                    this.promises.delete(data.id)
                }
                break
            case "PROMISE_MAIN":
                if(data.id) {
                    new Promise((resolve, reject) => {
                        this.emit("messagePromise", resolve, reject, data.message)
                    }).then(message => {
                        try {
                            window.postMessage({ type: "P_MESSAGE_MAIN", subtype: "PROMISE_MAIN", status: "RESOLVE", id: data.id, message }, document.defaultView.location.origin)
                        } catch(error) {
                            message = { error: error.message }
                            window.postMessage({ type: "P_MESSAGE_MAIN", subtype: "PROMISE_MAIN", status: "REJECT", id: data.id, message }, document.defaultView.location.origin)
                        }
                    }).catch(message => {
                        try {
                            window.postMessage({ type: "P_MESSAGE_MAIN", subtype: "PROMISE_MAIN", status: "REJECT", id: data.id, message }, document.defaultView.location.origin)
                        } catch(error) {
                            message = { error: error.message }
                            window.postMessage({ type: "P_MESSAGE_MAIN", subtype: "PROMISE_MAIN", status: "REJECT", id: data.id, message }, document.defaultView.location.origin)
                        }
                    })
                }
                break
            case "TRANSMIT":
                this.emit("message", data.message)
                break
        }
    }
    send(message) {
        window.postMessage({ type: "P_MESSAGE_MAIN", subtype: "TRANSMIT", message }, document.defaultView.location.origin)
    }
    sendPromise(message) {
        return new Promise((resolve, reject) => {
            const id = ++this.id % Number.MAX_SAFE_INTEGER
            this.promises.set(id, [resolve, reject])
            window.postMessage({ type: "P_MESSAGE_MAIN", subtype: "PROMISE_RENDER", id, message }, document.defaultView.location.origin)
        })
    }
}

export default ({ app, Vue }) => {
    app.secureBridge = Vue.prototype.$secureBridge = new SecureBridge()
}
