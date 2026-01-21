import MovementTypes from "@/api/serverCommunication/interfaces/MovementTypes";
import WSState from "@/api/serverCommunication/interfaces/WSState";


export default interface CommandSuiteInterface {
    testConnection(): boolean;
    move(direction: MovementTypes): boolean;
    killConnection(connectionStatus: WSState): boolean;
    openTrashCan(idOfTrashLid: number): boolean;
    closeTrashCan(idOfTrashLid: number): boolean;
}