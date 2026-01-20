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
import config from "./websocketConfig.json";
import ButtonColors from "@/app/comps/Interfaces/ButtonColors";

export default function Index() {
    const [SSID, setSSID] = useState<string | null>(null);
    const [connection, setConnection] = useState<boolean>(false);
    const successfullyConnectedMessage: string = "Connected to robot's WiFi network.";
    const commands: CommandSuite = useMemo((): CommandSuite => new CommandSuite(), []);
    const webSocketURL: string = config.websocketRoute;
    const robotsWifi: string = config.robotsWifiSSID;


    useEffect((): () => void => {
        let killGuard: boolean = false;

        const killProcess: () => void = (): void => {
            console.error(new ConnectionWithRobotInterrupted().message);
            EstablishConnection.getInstance().killCommunication();
            setConnection(false);
        }

        // INITIALIZATION
        Wifi.connect(robotsWifi)
            .then((wifiInstance: Wifi): void => {
                if (killGuard) return;
                if (!wifiInstance.isConnected) {
                    setSSID(`Not connected to expected SSID. Current: ${wifiInstance.ssid}`);
                    return;
                }
                setSSID(successfullyConnectedMessage);

                // LOCK IT
                WifiLock.lockToSSID(robotsWifi, killProcess)
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
    }, [webSocketURL, robotsWifi]);


    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
            <SendRequestButton
                buttonTitle={"Forward"}
                buttonColor={ButtonColors.SERVO_ACTION}
                onPress={(): boolean => commands.move(MovementTypes.FORWARD)}/>
            <View
                style={{
                    flexDirection: "row",
                    marginVertical: 20,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <SendRequestButton
                    buttonTitle={"Left"}
                    buttonColor={ButtonColors.SERVO_ACTION}
                    onPress={() => commands.move(MovementTypes.LEFT)}/>
                <SendRequestButton
                    buttonTitle={"Stop"}
                    buttonColor={ButtonColors.SERVO_ACTION}
                    onPress={() => commands.move(MovementTypes.STOP)}/>
                <SendRequestButton
                    buttonTitle={"Right"}
                    buttonColor={ButtonColors.SERVO_ACTION}
                    onPress={() => commands.move(MovementTypes.RIGHT)}/>
            </View>
            <SendRequestButton
                buttonTitle={"Backward"}
                buttonColor={ButtonColors.SERVO_ACTION}
                onPress={() => commands.move(MovementTypes.BACKWARD)}/>
            <View
                style={{
                    flexDirection: "row",
                    marginTop: 40,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <SendRequestButton
                    buttonTitle={"Test Connection"}
                    buttonColor={ButtonColors.SERVER_TEST}
                    onPress={() => commands.testConnection()}/>
                <SendRequestButton
                    buttonTitle={"Kill Connection"}
                    buttonColor={ButtonColors.KILL_SWITCH}
                    onPress={() => commands.killConnection(connection)}/>
            </View>
            <View
                style={{marginTop: 40}}>
                <Text>Logs: </Text>
                <Text>{SSID}</Text>
                <Text>{connection ? "WebSocket Connection: Alive" : "WebSocket Connection: Not Established"}</Text>
            </View>

        </View>
    );
}
