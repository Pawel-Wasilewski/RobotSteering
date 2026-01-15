import MovementTypes from "@/app/api/serverCommunication/interfaces/MovementTypes";

export default interface CommandSuiteInterface {
    testConnection(): boolean;
    move(direction: MovementTypes): boolean;
    killConnection(): boolean;
    openTrashCan(idOfTrashLid: number): boolean;
    closeTrashCan(idOfTrashLid: number): boolean;
}