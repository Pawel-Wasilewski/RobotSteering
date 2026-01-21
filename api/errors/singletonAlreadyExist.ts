export default class SingletonAlreadyExist extends Error {
    constructor(message: string = "An instance of this singleton class already exists.") {
        super(message);
        this.name = "SingletonAlreadyExist";
    }
}