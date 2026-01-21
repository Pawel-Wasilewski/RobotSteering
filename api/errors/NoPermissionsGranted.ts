export default class NoPermissionsGranted extends Error {
    constructor(message: string = "No permissions granted to access WiFi information.") {
        super(message);
        this.name = "NoPermissionsGranted";
    }
}