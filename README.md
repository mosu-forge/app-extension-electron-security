Quasar Electron Security (alpha-2)
===

This extension is created in an effort to improve security for Electron apps with Quasar. Notably, it disables `nodeIntegration` and changes the webpack target from `electron-render` to `web`. This means that you cannot use the `remote` module on the frontend, and must use the newly introduced `SecureCommunication` function to pass messages between the render and main process.

If your app does heavy IPC calls (whether custom or via remote module) then you will have to restructure how that works in order to use this app extension.

## SecureWindow

Instead of calling `new BrowserWindow`, call this helper function to create new windows with more secure webPreferences settings. This function will also inject a preload script that sets up secure communications. As of this version, it does not allow you to set your own preload script.

```javascript
webPreferences: {
    sandbox: true,
    nodeIntegration: false,
    nodeIntegrationInWorker: false,
    nodeIntegrationInSubFrames: false,
    enableRemoteModule: false,
    contextIsolation: true
}
```

## SecureCommunication

Since `nodeIntegration` is turned off and `contextIsolation` is turned on, traditional usage of `ipcRenderer` will not work. Instead, a `SecureCommunication` function is introduced to both the main and render process that uses `window.postMessage()` to pass messages. See later section for examples of usage.

## AppHarden

This function for now is basic, but allows you to apply some common settings to your electron app that do things such as preventing new windows from spawning, or navigating away from your app.

# Usage

## Main Process

Once installed, you can use these new functions in your `electron-main.js` file.

```javascript
import { app, BrowserWindow } from 'electron'

/** Import from Electron Security **/
import { AppHarden, SecureWindow, SecureCommunication } from 'ElectronSecurity'

if (process.env.PROD) {
    global.__statics = require('path').join(__dirname, 'statics').replace(/\\/g, '\\\\')
}

let mainWindow, mainCommunication

function createWindow () {

    /**
     * Instead of `new BrowserWindow` we use `SecureWindow`
     * Notice the lack of `new` keyword. This function will return a BrowserWindow
     * so you can use loadURL and other methods in the same fashion
     **/
    mainWindow = SecureWindow({
        width: 1000,
        height: 600,
        useContentSize: true,
    })

    /**
     * Call the `SecureCommunication` function with the mainWindow created above
     * This object allows you to communicate securely with the browser contents
     **/
    mainCommunication = SecureCommunication(mainWindow)

    mainCommunication.on('message', message => {
        console.log(message)
        mainCommunication.send('PONG')
    })

    mainWindow.loadURL(process.env.APP_URL)
    mainWindow.openDevTools()

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

/**
 * Call this function to harden your app's permissions
 * The default options are shown below
**/
AppHarden(app, {
    sandbox: true,
    preventWebview: true,
    preventNavigate: true,
    preventNewWindow: true,
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})
```

## Render Process

In a component, boot file, or other script in the render process, you can listen and send messages like this:

```javascript
this.$q.SecureCommunication.on("message", message => {
    console.log(message)
})

this.$q.SecureCommunication.send("PING")
```

# Install
```bash
quasar ext add electron-security

or

yarn add mosu-forge/app-extension-electron-security
quasar ext invoke electron-security
```
Quasar CLI will retrieve it from NPM and install the extension.

# Uninstall
```bash
quasar ext remove electron-security
```

# Patreon
If you like (and use) this App Extension, please consider becoming a Quasar [Patreon](https://www.patreon.com/quasarframework).
