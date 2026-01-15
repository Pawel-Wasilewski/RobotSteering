import CommandSuiteInterface from "@/app/api/serverCommunication/interfaces/CommandSuiteInterface";
import EstablishConnection from "@/app/api/serverCommunication/establishConnection";
import TypeOfCommand from "@/app/api/serverCommunication/interfaces/TypeOfCommand";
import MovementTypes from "@/app/api/serverCommunication/interfaces/MovementTypes";
import WSPayloadDTO from "@/app/api/serverCommunication/interfaces/WSPayloadDTO";

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
    killConnection(): boolean {
        EstablishConnection.getInstance().killCommunication();
        return true;
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