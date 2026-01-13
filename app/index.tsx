import {Text, View} from "react-native";
import Wifi from "@/app/api/serverConnection/Wifi";
import {useEffect, useState} from "react";

export default function Index() {
    const [SSID, setSSID] = useState<string | null>(null);

    useEffect((): void => {
        const robotWifiSSID: string = "Robot_Network";
        Wifi.connect(robotWifiSSID)
            .then((wifiInstance: Wifi): void => {
                const output: string = wifiInstance.isConnected ? `Connected to SSID: ${wifiInstance.ssid}` : `Not connected to the expected SSID. Current SSID: ${wifiInstance.ssid}`;
                setSSID(output);
            })
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
                {SSID ? SSID : "Connecting to WiFi..."}
            </Text>
        </View>
    );
}
