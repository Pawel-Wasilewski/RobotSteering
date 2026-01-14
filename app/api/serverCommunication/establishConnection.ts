import WSPayloadDTO from "@/app/api/serverCommunication/interfaces/WSPayloadDTO";
import ConnectionWithRobotFailed from "@/app/errors/ConnectionWithRobotFailed";

export default class EstablishConnection {
    private static instance: EstablishConnection | null = null;
    private socket: WebSocket | null = null;
    private alive: boolean = false;

    private constructor() {}

    public static getInstance(): EstablishConnection {
        if (!EstablishConnection.instance) EstablishConnection.instance = new EstablishConnection();
        return EstablishConnection.instance;
    }

    public connect(url: string): void {
        this.killCommunication()

        this.socket = new WebSocket(url);
        this.alive = true;

        this.socket.onopen = (): void => console.log("Connection opened");
        this.socket.onclose = (): void => this.killCommunication();
        this.socket.onerror = (): void => this.killCommunication();

        this.socket.onmessage = (event: MessageEvent): void => {
            //TODO handle incoming messages
            console.log(`Received ${event}`);
        }
    }

    public sendPayload(payload: WSPayloadDTO): void {
        if (!this.alive || !this.socket || this.socket.readyState !== WebSocket.OPEN) throw new ConnectionWithRobotFailed();
        else this.socket.send(JSON.stringify(payload));
    }

    public killCommunication(): void {
        this.alive = false;

        if (this.socket) {
            this.socket.onclose = null;
            this.socket.onerror = null;
            this.socket.close();
        }

        this.socket = null;
    }
    public isAlive(): boolean {
        return this.alive && this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }
}