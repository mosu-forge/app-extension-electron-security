Quasar Electron Security (alpha-1)
===

This extension is created in an effort to run `nodeIntegration: false` with Quasar. As of now it is only a proof of concept and is not ready for production use.

It works by modifying some webpack options.

On the render process:
- Replaces the require("electron") with an empty module
- Changes the target to "web"
- Removes the "html-addons" webpack plugin created by Quasar.

On the main process:
- Adds a preload script to the main window that only exposes what is necessary for your application

# Usage

Once installed, in your `electron-main.js` file, create a new window like this:

```javascript
mainWindow = new BrowserWindow(
  SecureWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
  })
)
```

The `SecureWindow` function will inject the `nodeIntegration: false` setting as well as the preload script bundled with this App Extension. As of now you cannot yet run your own preload script.


# Install
```bash
quasar ext add electron-security

or

yarn add mosu-forge/app-extension-electron-security
quasar ext invoke electron-security
```
Quasar CLI will retrieve it from NPM and install the extension.

## Prompts

The extension will ask:
> Inject Electron into Render Process?
If you select this option, the electron module will be re-injected at `Vue.prototype.$q.electron` else it will be null.

# Uninstall
```bash
quasar ext remove electron-security
```

# Patreon
If you like (and use) this App Extension, please consider becoming a Quasar [Patreon](https://www.patreon.com/quasarframework).
