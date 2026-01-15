import typeOfCommand from "@/app/api/serverCommunication/interfaces/TypeOfCommand";

export default interface WSPayloadDTO {
    event: typeOfCommand;
    data: any;
}