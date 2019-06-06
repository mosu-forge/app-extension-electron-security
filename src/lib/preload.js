//window.__statics = require("path").join(__dirname, "statics").replace(/\\\\/g, "\\\\")

require = null

window.addEventListener("message", (event) => {
    if(event.source == window && event.data.type && event.data.type == "P_MESSAGE") {
        window.postMessage({ type: "P_ANSWER", text: "testing123" }, "*")
    }
}, false)
