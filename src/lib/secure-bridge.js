import { ipcMain } from "electron"
import EventEmitter from "events"

export default function(window) {
    return new SecureBridge(window)
}

class SecureBridge extends EventEmitter {
    constructor(window) {
        super()
        this.window = window
        ipcMain.on("P_MESSAGE", (event, message) => {
            this.emit("message", message)
        })
    }
    send(message) {
        this.window.send("P_ANSWER", message)
    }
}
