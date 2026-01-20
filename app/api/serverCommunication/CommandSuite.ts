import CommandSuiteInterface from "@/app/api/serverCommunication/interfaces/CommandSuiteInterface";
import EstablishConnection from "@/app/api/serverCommunication/establishConnection";
import TypeOfCommand from "@/app/api/serverCommunication/interfaces/TypeOfCommand";
import MovementTypes from "@/app/api/serverCommunication/interfaces/MovementTypes";
import WSPayloadDTO from "@/app/api/serverCommunication/interfaces/WSPayloadDTO";
import ConnectionDoesntExist from "@/app/errors/ConnectionDoesntExist";

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
    killConnection(connectionStatus: boolean): boolean {
        if (connectionStatus) {
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