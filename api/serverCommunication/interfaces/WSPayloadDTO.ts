import typeOfCommand from "@/api/serverCommunication/interfaces/TypeOfCommand";


export default interface WSPayloadDTO {
    event: typeOfCommand;
    data: any;
}