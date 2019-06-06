/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

const path = require("path")

module.exports = function (api) {
    api.chainWebpack((cfg, { isClient, isServer }, api) => {
        if(api.ctx.modeName == "electron") {
            cfg.target("web")
            cfg.plugins.delete("html-addons")
            cfg.resolve.alias.set("electron", path.resolve(__dirname, "lib", "empty-module"))
        }
    })
    api.chainWebpackMainElectronProcess((cfg) => {
        if(api.ctx.modeName == "electron") {
            cfg.output.filename("[name].js")
            cfg.entry("preload").add(path.resolve(__dirname, "lib", "preload.js"))
            cfg.resolve.alias.set("ElectronSecurity", path.resolve(__dirname, "lib", "index"))
        }
    })
    api.extendQuasarConf((cfg, api) => {
        if(api.ctx.modeName == "electron") {
            cfg.build.transpileDependencies.push(/quasar-app-extension-electron-security[\\/]src[\\/]boot/)
            cfg.boot.push("~quasar-app-extension-electron-security/src/boot/secure-communication.js")
        }
    })
}
