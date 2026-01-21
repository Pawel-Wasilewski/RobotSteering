import ConnectionWithRobotFailed from "@/api/errors/ConnectionWithRobotFailed";
import WSPayloadDTO from "@/api/serverCommunication/interfaces/WSPayloadDTO";
import ConnectionWithRobotInterrupted from "@/api/errors/ConnectionWithRobotInterrupted";


export default class EstablishConnection {
    private static instance: EstablishConnection | null = null;
    private socket: WebSocket | null = null;
    private alive: boolean = false;

    private constructor() {
    }

    public static getInstance(): EstablishConnection {
        if (!EstablishConnection.instance) EstablishConnection.instance = new EstablishConnection();
        return EstablishConnection.instance;
    }

    public connect(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.killCommunication();

            this.socket = new WebSocket(url);
            this.alive = false;

            this.socket.onopen = () => {
                console.log("Connection opened");
                this.alive = true;
                resolve();
            };

            this.socket.onerror = (e: Event): void => {
                this.killCommunication();
                reject(e);
            };

            this.socket.onclose = (): void => {
                this.killCommunication();
                reject(new ConnectionWithRobotInterrupted());
            };
        });
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