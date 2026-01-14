export default class ConnectionWithRobotFailed extends Error {
    constructor(message: string = "Connection with the robot has failed.") {
        super(message);
        this.name = "ConnectionWithRobotFailed";
    }
}