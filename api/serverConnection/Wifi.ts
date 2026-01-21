import WifiManager from "react-native-wifi-reborn";
import GetPermissions from "@/api/serverConnection/helpers/getPermissions";
import NoPermissionsGranted from "@/api/errors/NoPermissionsGranted";
import WifiNotConnected from "@/api/errors/WifiNotConnected";


export default class Wifi {
    ssid!: string;
    isConnected!: boolean;

    static instance: Wifi | null = null;

    private constructor() {}

    static async connect(expectedSSID: string): Promise<Wifi> {
        if (Wifi.instance) return Wifi.instance;

        const { status } = await GetPermissions.requestForegroundPermissionsAsync();
        if (status !== "granted") throw new NoPermissionsGranted();
        else {
            return WifiManager.getCurrentWifiSSID()
                .then((ssid: string): Wifi => {
                    const wifiInstance = new Wifi();
                    wifiInstance.ssid = ssid;
                    wifiInstance.isConnected = ssid === expectedSSID;
                    Wifi.instance = wifiInstance;
                    return wifiInstance;
                })
                .catch((): never => {
                    throw new WifiNotConnected();
                })
        }
    }
}
