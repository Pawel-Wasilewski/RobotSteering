import ErrorNotOverriden from "@/api/errors/errorNotOverriden";


export default class LibNotAccessible extends Error {
    constructor(lib: string | null = null) {
        if (lib === null) throw new ErrorNotOverriden();
        else {
            super("Lib isn't accessible: " + lib);
            this.name = "LibNotAccessible";
        }
    }
}