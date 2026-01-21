export default class LockingSSIDFailed extends Error {
    constructor(message: string = "Locking SSID failed.") {
        super(message);
        this.name = "LockingSSIDFailed";
    }
}