import {Text, View} from "react-native";
import {useEffect, useMemo, useState} from "react";
import LockingSSIDFailed from "@/api/errors/LockingSSIDFailed";
import EstablishConnection from "@/api/serverCommunication/establishConnection";
import WifiLock from "@/api/serverConnection/WifiLock";
import CommandSuite from "@/api/serverCommunication/CommandSuite";
import ConnectionWithRobotInterrupted from "@/api/errors/ConnectionWithRobotInterrupted";
import config from "@/api/websocketConfig.json";
import Wifi from "@/api/serverConnection/Wifi";
import SendRequestButton from "@/app/comps/SendRequestButton";
import ButtonColors from "@/api/Interfaces/ButtonColors";
import MovementTypes from "@/api/serverCommunication/interfaces/MovementTypes";
import WSState from "@/api/serverCommunication/interfaces/WSState";

export default function Index() {
    const [SSID, setSSID] = useState<string | null>(null);
    const [connection, setConnection] = useState<WSState>(WSState.DISCONNECTED);
    const successfullyConnectedMessage: string = "Connected to robot's WiFi network.";
    const commands: CommandSuite = useMemo((): CommandSuite => new CommandSuite(), []);
    const webSocketURL: string = config.websocketRoute;
    const robotsWifi: string = config.robotsWifiSSID;
    const expoDevelopmentMode: boolean = Boolean(config.expoDevelopmentMode);


    useEffect((): () => void => {
        let killGuard: boolean = false;

        const killProcess: () => void = (): void => {
            console.error(new ConnectionWithRobotInterrupted().message);
            EstablishConnection.getInstance().killCommunication();
            setConnection(WSState.DISCONNECTED);
        }

        if (expoDevelopmentMode) {
            // EXPO GO DEVELOPMENT MODE - SKIP WIFI STEPS - NOT POSSIBLE IN EXPO GO
            setConnection(WSState.CONNECTING);
            EstablishConnection.getInstance().connect(webSocketURL)
                .then((): void => {
                    setConnection(WSState.CONNECTED);
                    setSSID(successfullyConnectedMessage + " (Expo Go Development Mode)");
                })
                .catch((): void => {
                    setConnection(WSState.DISCONNECTED)
                    setSSID("Failed to connect: Connection interrupted");
                })

        } else {
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
                            setConnection(WSState.CONNECTING);
                            EstablishConnection.getInstance().connect(webSocketURL)
                                .then((): void => {
                                    setConnection(WSState.CONNECTED)
                                })
                                .catch((): void => {
                                    setConnection(WSState.DISCONNECTED)
                                    setSSID("Failed to connect: Connection interrupted");
                                })
                        })
                        .catch((): void => {
                            throw new LockingSSIDFailed()
                        });
                })
                .catch((error: Error): void => {
                    if (!killGuard) setSSID("Failed to connect: " + error.message);
                });


        }
        // CLEANUP
        return (): void => {
            killGuard = true;
            WifiLock.releaseLock();
            EstablishConnection.getInstance().killCommunication();
            setConnection(WSState.DISCONNECTED);
        };
    }, [webSocketURL, robotsWifi, expoDevelopmentMode]);


    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
            <View
                style={{
                    flexDirection: "row",
                    marginVertical: 20,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <SendRequestButton
                    buttonTitle={"Open Plastic Bin"}
                    buttonColor={ButtonColors.SERVO_BIN_ACTION}
                    onPress={(): void => {
                        commands.openTrashCan(1)
                    }}/>
                <SendRequestButton
                    buttonTitle={"Forward"}
                    buttonColor={ButtonColors.SERVO_MOVE_ACTION}
                    onPress={(): void => {
                        commands.move(MovementTypes.FORWARD)
                    }}/>
                <SendRequestButton
                    buttonTitle={"Open Paper Bin"}
                    buttonColor={ButtonColors.SERVO_BIN_ACTION}
                    onPress={(): void => {
                        commands.openTrashCan(2)
                    }}/>
            </View>

            <View
                style={{
                    flexDirection: "row",
                    marginVertical: 20,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <SendRequestButton
                    buttonTitle={"Left"}
                    buttonColor={ButtonColors.SERVO_MOVE_ACTION}
                    onPress={(): void => {
                        commands.move(MovementTypes.LEFT)
                    }}/>
                <SendRequestButton
                    buttonTitle={"Stop"}
                    buttonColor={ButtonColors.SERVO_MOVE_ACTION}
                    onPress={(): void => {
                        commands.move(MovementTypes.STOP)
                    }}/>
                <SendRequestButton
                    buttonTitle={"Right"}
                    buttonColor={ButtonColors.SERVO_MOVE_ACTION}
                    onPress={(): void => {
                        commands.move(MovementTypes.RIGHT)
                    }}/>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    marginVertical: 20,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <SendRequestButton
                    buttonTitle={"Open Mixed Bin"}
                    buttonColor={ButtonColors.SERVO_BIN_ACTION}
                    onPress={(): void => {
                        commands.openTrashCan(3)
                    }}/>
                <SendRequestButton
                    buttonTitle={"Backward"}
                    buttonColor={ButtonColors.SERVO_MOVE_ACTION}
                    onPress={(): void => {
                        commands.move(MovementTypes.BACKWARD)
                    }}/>
                <SendRequestButton
                    buttonTitle={"Close All Bins"}
                    buttonColor={ButtonColors.SERVO_BIN_ACTION}
                    onPress={(): void => {
                        commands.closeTrashCan(1);
                        commands.closeTrashCan(2);
                        commands.closeTrashCan(3);
                    }}/>
            </View>

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
                <Text>{connection === WSState.CONNECTED ? "WebSocket Connection: Alive" : "WebSocket Connection: Not Established"}</Text>
            </View>

        </View>
    );
}
