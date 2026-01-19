import {Text, View} from "react-native";
import {useEffect, useMemo, useState} from "react";
import ConnectionWithRobotInterrupted from "@/app/errors/ConnectionWithRobotInterrupted";
import EstablishConnection from "@/app/api/serverCommunication/establishConnection";
import Wifi from "@/app/api/serverConnection/Wifi";
import WifiLock from "@/app/api/serverConnection/WifiLock";
import SendRequestButton from "@/app/comps/SendRequestButton";
import CommandSuite from "@/app/api/serverCommunication/CommandSuite";
import LockingSSIDFailed from "@/app/errors/LockingSSIDFailed";
import MovementTypes from "@/app/api/serverCommunication/interfaces/MovementTypes";
import WebSocketConfigDTO from "@/app/comps/Interfaces/WebSocketConfigDTO";

export default function Index() {
    const [SSID, setSSID] = useState<string | null>(null);
    const [connection, setConnection] = useState<boolean>(false);
    const successfullyConnectedMessage: string = "Connected to robot's WiFi network.";
    const commands: CommandSuite = useMemo((): CommandSuite => new CommandSuite(), []);

    const config: WebSocketConfigDTO = require("./websocketConfig.json");
    const webSocketURL: string = config.websocketRoute;


    useEffect((): () => void => {
        let killGuard: boolean = false;
        const RobotWiFiSSID = "Robot_WiFi_Network";

        const killProcess: () => void = (): void => {
            console.error(new ConnectionWithRobotInterrupted().message);
            EstablishConnection.getInstance().killCommunication();
            setConnection(false);
        }

        // INITIALIZATION
        Wifi.connect(RobotWiFiSSID)
            .then((wifiInstance: Wifi): void => {
                if (killGuard) return;
                if (!wifiInstance.isConnected) {
                    setSSID(`Not connected to expected SSID. Current: ${wifiInstance.ssid}`);
                    return;
                }
                setSSID(successfullyConnectedMessage);

                // LOCK IT
                WifiLock.lockToSSID(RobotWiFiSSID, killProcess)
                    .then((): void => {
                        // ESTABLISH CONNECTION
                        EstablishConnection.getInstance().connect(webSocketURL);
                        setConnection(true);
                    })
                    .catch((): void => {
                        throw new LockingSSIDFailed()
                    });
            })
            .catch((error: Error): void => {
                if (!killGuard) setSSID("Failed to connect: " + error.message);
            });

        // CLEANUP
        return (): void => {
            killGuard = true;
            WifiLock.releaseLock();
            EstablishConnection.getInstance().killCommunication();
            setConnection(false);
        };
    }, [webSocketURL]);


    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
            <SendRequestButton
                buttonActionName={"Move Forward"}
                callback={(): boolean => commands.move(MovementTypes.FORWARD)}/>
            <View
                style={{
                    flexDirection: "row",
                    marginVertical: 20,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <SendRequestButton
                    buttonActionName={"Move Left"}
                    callback={(): boolean => commands.move(MovementTypes.LEFT)}/>
                <SendRequestButton
                    buttonActionName={"Stop"}
                    callback={(): boolean => commands.move(MovementTypes.STOP)}/>
                <SendRequestButton
                    buttonActionName={"Move Right"}
                    callback={(): boolean => commands.move(MovementTypes.RIGHT)}/>
            </View>
            <SendRequestButton
                buttonActionName={"Move Backward"}
                callback={(): boolean => commands.move(MovementTypes.BACKWARD)}/>
            <View
                style={{marginTop: 40}}>
                <Text>Logs: </Text>
                <Text>{SSID}</Text>
                <Text>{connection ? "WebSocket Connection: Alive" : "WebSocket Connection: Not Established"}</Text>
            </View>

        </View>
    );
}
