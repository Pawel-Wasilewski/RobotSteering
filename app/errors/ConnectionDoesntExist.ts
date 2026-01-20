export default class ConnectionDoesntExist extends Error {
    constructor(message: string = "The specified connection does not exist.") {
        super(message);
        this.name = "ConnectionDoesntExist";
    }
}