const { ipcRenderer } = require("electron")

require = null

ipcRenderer.on("P_SET_STATICS_DIR", (event, path) => {
    window.postMessage({ type: "P_MESSAGE_RENDER", subtype: "P_SET_STATICS_DIR", path }, document.defaultView.location.origin)
})

ipcRenderer.on("P_MESSAGE_RENDER", (event, data) => {
    window.postMessage({ ...data, type: "P_MESSAGE_RENDER" }, document.defaultView.location.origin)
})

window.addEventListener("message", (event) => {
    if(event.source == window && event.data.type && event.data.type == "P_MESSAGE_MAIN") {
        ipcRenderer.send("P_MESSAGE_MAIN", event.data)
    }
}, true)
