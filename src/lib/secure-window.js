export default function SecureWindow (cfg) {
    if(!cfg.hasOwnProperty("webPreferences"))
        cfg.webPreferences = {}

    cfg.webPreferences.sandbox = true
    cfg.webPreferences.nodeIntegration = false
    cfg.webPreferences.nodeIntegrationInWorker = false
    cfg.webPreferences.nodeIntegrationInSubFrames = false
    cfg.webPreferences.enableRemoteModule = false
    cfg.webPreferences.contextIsolation = true
    cfg.webPreferences.preload = require("path").resolve(__dirname, "preload.js")

    return cfg
}
