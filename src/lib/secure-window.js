import { BrowserWindow } from "electron"

export function SecureConfig(cfg) {
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

export default function SecureWindow(cfg) {
    const window = new BrowserWindow(SecureConfig(cfg))
    window.webContents.on("dom-ready", () => {
        window.send("P_STATIC", require("path").join(__dirname, "statics").replace(/\\\\/g, "\\\\"))
    })
    return window
}
