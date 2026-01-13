export default class ErrorNotOverriden extends Error {
    constructor(message: string = "This method must be overridden in a subclass.") {
        super(message);
        this.name = "ErrorNotOverriden";
    }
}