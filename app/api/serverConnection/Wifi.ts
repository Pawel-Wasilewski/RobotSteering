import WifiManager from "react-native-wifi-reborn";
import NoPermissionsGranted from "@/app/errors/NoPermissionsGranted";
import GetPermissions from "@/app/api/serverConnection/helpers/getPermissions";
import WifiNotConnected from "@/app/errors/WifiNotConnected";

export default class Wifi {
    ssid!: string;
    isConnected!: boolean;

    static instance: Wifi | null = null;

    private constructor() {}

    static async connect(expectedSSID: string): Promise<Wifi> {
        if (Wifi.instance) return Wifi.instance;

        const status: any = await GetPermissions.requestForegroundPermissionsAsync();
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

/*
 if (!singletonInstance) {
            GetPermissions.requestForegroundPermissionsAsync()
                .then((): void => {
                    WifiManager.getCurrentWifiSSID()
                        .then((currentSSID: string): void => {
                            if (currentSSID !== wifiName) {
                                this.wifi = {
                                    ssid: currentSSID,
                                    isConnected: false
                                };
                            } else {
                                this.wifi = {
                                    ssid: currentSSID,
                                    isConnected: true
                                };
                                throw new WifiNotConnected();
                            }
                        });
                })
                .catch((): never => {
                    throw new NoPermissionsGranted();
                });
        }
        else {
            throw new SingletonAlreadyExist();
        }
 */