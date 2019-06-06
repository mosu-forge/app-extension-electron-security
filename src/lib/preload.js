const { ipcRenderer } = require("electron")

require = null

ipcRenderer.on("P_STATIC", (event, message) => {
    window.__statics = message
})

ipcRenderer.on("P_ANSWER", (event, message) => {
    window.postMessage({ type: "P_ANSWER", message }, document.defaultView.location.origin)
})

window.addEventListener("message", (event) => {
    if(event.source == window && event.data.type && event.data.type == "P_MESSAGE") {
        ipcRenderer.send("P_MESSAGE", event.data.message)
    }
}, true)
