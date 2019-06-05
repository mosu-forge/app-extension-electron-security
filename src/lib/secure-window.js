var SecureWindow = function (cfg) {
    if(!cfg.hasOwnProperty("webPreferences"))
        cfg.webPreferences = {}

    cfg.webPreferences.nodeIntegration = false
    cfg.webPreferences.nodeIntegrationInWorker = false
    cfg.webPreferences.nodeIntegrationInSubFrames = false
    //cfg.webPreferences.enableRemoteModule = false
    cfg.webPreferences.preload = require("path").resolve(__dirname, "preload.js")

    return cfg
}

module.exports.SecureWindow = SecureWindow
