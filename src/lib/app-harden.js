import { SecureConfig } from "./secure-window"

export default function AppHarden(app, cfg) {

    cfg = {
        sandbox: true,
        preventWebview: true,
        preventNavigate: true,
        preventNewWindow: true,
        ...cfg
    }

    if(cfg.sandbox) {
        app.enableSandbox()
    }

    app.on("web-contents-created", (event, contents) => {
        contents.on("will-attach-webview", (event, webPreferences, params) => {

            webPreferences = SecureConfig({ webPreferences }).webPreferences

            delete webPreferences.preload
            delete webPreferences.preloadURL

            if(cfg.preventWebview) {
                event.preventDefault()
            }
        })
        contents.on("will-navigate", (event, navigationUrl) => {
            if(cfg.preventNavigate) {
                console.log("ElectronSecurity: Blocked will-navigate:", navigationUrl)
                event.preventDefault()
            }
        })
        contents.on("new-window", (event, navigationUrl) => {
            if(cfg.preventNewWindow) {
                console.log("ElectronSecurity: Blocked new-window:", navigationUrl)
                event.preventDefault()
            }
        })
    })

}
