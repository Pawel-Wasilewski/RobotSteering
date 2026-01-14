import {Text, View} from "react-native";
import {useEffect, useState} from "react";
import ConnectionWithRobotInterrupted from "@/app/errors/ConnectionWithRobotInterrupted";
import EstablishConnection from "@/app/api/serverCommunication/establishConnection";
import Wifi from "@/app/api/serverConnection/Wifi";
import WifiLock from "@/app/api/serverConnection/WifiLock";
import SendRequestButton from "@/app/comps/SendRequestButton";

export default function Index() {
    const [SSID, setSSID] = useState<string | null>(null);
    const [connection, setConnection] = useState<boolean>(false);
    const successfullyConnectedMessage: string = "Connected to robot's WiFi network."

    const sendTestPackets = (): void => {

    }


    useEffect(() => {
        const RobotWiFiSSID = "Robot_WiFi_Network";

        const killProcess = (): void => {
            console.error(new ConnectionWithRobotInterrupted().message);
            EstablishConnection.getInstance().killCommunication();
            setConnection(false);
        }

        // INITIALIZATION
        Wifi.connect(RobotWiFiSSID)
            .then(async (wifiInstance: Wifi): Promise<void> => {
                if (!wifiInstance.isConnected) {
                    setSSID(`Not connected to expected SSID. Current: ${wifiInstance.ssid}`);
                    return;
                }
                setSSID(successfullyConnectedMessage);

                // LOCK IT
                await WifiLock.lockToSSID(RobotWiFiSSID, killProcess);

                // ESTABLISH CONNECTION
                const webSocketURL: string = "ws://0.0.0.0:3000";
                EstablishConnection.getInstance().connect(webSocketURL);
                setConnection(true);
            })
            .catch((error: Error): void => {
                setSSID("Failed to connect: " + error.message);
            });

        // CLEANUP
        return (): void => {
            WifiLock.releaseLock();
            EstablishConnection.getInstance().killCommunication();
        };
    }, []);


    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>
                {SSID ? (SSID === successfullyConnectedMessage ?
                    <SendRequestButton message={"send test packets"} callback={sendTestPackets}/> : SSID) : "Connecting to WiFi..."}
            </Text>
        </View>
    );
}
