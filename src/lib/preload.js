const electron = require("electron")

//require("module").globalPaths.push("${appPaths.resolve.app("node_modules").replace(/\\/g, "\\\\")}")

window.__statics = require("path").join(__dirname, "statics").replace(/\\\\/g, "\\\\")

window.electron = electron
