export default class WifiNotConnected extends Error {
    constructor(message: string = "Wifi is not connected to robots network.") {
        super(message);
        this.name = "WifiNotConnected";
    }
}