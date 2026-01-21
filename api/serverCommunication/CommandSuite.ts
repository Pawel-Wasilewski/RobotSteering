import CommandSuiteInterface from "@/api/serverCommunication/interfaces/CommandSuiteInterface";
import EstablishConnection from "@/api/serverCommunication/establishConnection";
import TypeOfCommand from "@/api/serverCommunication/interfaces/TypeOfCommand";
import MovementTypes from "@/api/serverCommunication/interfaces/MovementTypes";
import WSPayloadDTO from "@/api/serverCommunication/interfaces/WSPayloadDTO";
import ConnectionDoesntExist from "@/api/errors/ConnectionDoesntExist";
import WSState from "@/api/serverCommunication/interfaces/WSState";


export default class CommandSuite implements CommandSuiteInterface {
    testConnection(): boolean {
        EstablishConnection.getInstance().sendPayload({
            event: TypeOfCommand.TEST_CONNECTION,
            data: null
        })
        return true;
    }
    move(direction: MovementTypes): boolean {
        const payloadData: WSPayloadDTO = {
            event: TypeOfCommand.MOVE,
            data: {
                direction: direction
            }
        };
        EstablishConnection.getInstance().sendPayload(payloadData);
        return true;
    }
    killConnection(connectionStatus: WSState): boolean {
        if (connectionStatus === WSState.CONNECTED) {
            EstablishConnection.getInstance().killCommunication();
            return true;
        }
        else throw new ConnectionDoesntExist();
    }
    openTrashCan(idOfTrashLid: number): boolean {
        EstablishConnection.getInstance().sendPayload({
            event: TypeOfCommand.OPEN_TRASHCAN,
            data: {
                lid: idOfTrashLid
            }
        });
        return true;
    }
    closeTrashCan(idOfTrashLid: number): boolean {
        EstablishConnection.getInstance().sendPayload({
            event: TypeOfCommand.CLOSE_TRASHCAN,
            data: {
                lid: idOfTrashLid
            }
        });
        return true;
    }
}