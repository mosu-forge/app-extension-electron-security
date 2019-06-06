import { SecureWindow } from "."

export default function AppHarden(app) {

    app.enableSandbox()

    app.on("web-contents-created", (event, contents) => {
        contents.on("will-attach-webview", (event, webPreferences, params) => {

            webPreferences = SecureWindow({ webPreferences }).webPreferences

            delete webPreferences.preload
            delete webPreferences.preloadURL

            event.preventDefault()
        })
        contents.on("will-navigate", (event, navigationUrl) => {
            console.log("ElectronSecurity: Blocked will-navigate:", navigationUrl)
            event.preventDefault()
        })
        contents.on("new-window", (event, navigationUrl) => {
            console.log("ElectronSecurity: Blocked new-window:", navigationUrl)
            event.preventDefault()
        })
    })

}
