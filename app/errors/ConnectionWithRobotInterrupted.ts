export default class ConnectionWithRobotInterrupted extends Error {
    constructor(message: string = "Connection with the robot has been interrupted.") {
        super(message);
        this.name = "ConnectionWithRobotInterrupted";
    }
}