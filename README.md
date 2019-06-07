Quasar Electron Security (alpha-3)
===

This extension is created in an effort to improve security for Electron apps with Quasar and make secure communication easy between the render and main process. Notably, it disables `nodeIntegration`, enables `contextIsolation` and enables `sandbox` in the `webPreferences` options. It also changes the webpack target from `electron-renderer` to `web`. This means that you cannot use the `remote` module or any other nodejs functions on the frontend, and must use the newly introduced `SecureBridge` class to pass messages between the render and main process.

If your app does heavy IPC calls or utilizes the remote module, then you will have to restructure how that works in order to use this app extension.

## SecureWindow

Instead of calling `new BrowserWindow`, call this function to create new windows with more secure webPreferences settings. This function will also inject a preload script that sets up the secure bridge. As of this version, it does not allow you to set your own preload script.

```javascript
mainWindow = SecureWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
})

// is equivalent to

mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
        sandbox: true,
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        nodeIntegrationInSubFrames: false,
        enableRemoteModule: false,
        contextIsolation: true,
        preload: require('path').resolve(__dirname, 'preload.js')
    }
})
```

## SecureBridge

Since `nodeIntegration` is turned off and `contextIsolation` is turned on, traditional usage of `ipcRenderer` and `ipcMain` will not work. Instead, a `SecureBridge` class is introduced to both the main and render process that uses the preload script to pass messages. There are two methods that can be used in both the main and render process: `send` and `sendPromise`. See usage section for more details.

## AppHarden

This function applies some common settings to your electron app to prevent actions such as the render spawning new windows, or navigating away from your app. By default it is very restrictive, but allows you to disable certain features. Calling this on your app is optional, and the restrictions can easily be implemented with your own event listeners. See usage section for more details.

# Usage

## Main Process

Once installed, you can use these new functions in your `electron-main.js` file.

```javascript
import { app, BrowserWindow } from 'electron'

/** Import from Electron Security **/
import { AppHarden, SecureWindow, SecureBridge } from 'ElectronSecurity'

if (process.env.PROD) {
    global.__statics = require('path').join(__dirname, 'statics').replace(/\\/g, '\\\\')
}

let mainWindow, mainBridge


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
     * Call the `SecureBridge` function with the mainWindow created above
     * This object allows you to communicate securely with the browser contents
     **/
    mainBridge = SecureBridge(mainWindow)

    mainBridge.on('message', message => {
        console.log('message received', message)
        mainBridge.send('PONG')
    })

    mainBridge.on('messagePromise', (resolve, reject, message) => {
        console.log('messagePromise received', message)
        if(message == 'rejectme') {
            reject('I am programmed to reject this message')
        } else {
            resolve(message.split('').reverse().join(''))
        }
    })

    mainWindow.webContents.on('did-finish-load', () => {
        mainBridge.sendPromise('getroute').then(message => {
            console.log('sendPromise was resolved', message)
        }).catch(error => {
            console.error('sendPromise was rejected', error)
        })
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

This app extension injects a secureBridge instance into your render process at `Vue.prototype.$secureBridge` and `app.secureBridge`. You can use this to both send and listen for messages.

```javascript
this.$secureBridge.on('message', message => {
    console.log('message received', message)
})
this.$secureBridge.send('ping')

this.$secureBridge.sendPromise('foobar').then(message => {
    console.log('sendPromise was resolved', message)
}).catch(error => {
    console.error('sendPromise was rejected', error)
})

this.$secureBridge.sendPromise('rejectme').then(message => {
    console.log('sendPromise was resolved', message)
}).catch(error => {
    console.error('sendPromise was rejected', error)
})

this.$secureBridge.on('messagePromise', (resolve, reject, message) => {
    console.log('messagePromise received', message)
    if(message == 'getroute') {
        resolve(this.$router.currentRoute.path)
    }
})
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
