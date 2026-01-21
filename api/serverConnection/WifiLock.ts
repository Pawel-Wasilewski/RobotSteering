import WifiManager from "react-native-wifi-reborn";
import NetInfo from "@react-native-community/netinfo";
import ConnectionWithRobotInterrupted from "@/api/errors/ConnectionWithRobotInterrupted";

export default class WifiLock {
    private static unsubscribe: (() => void) | null = null;
    private static lockedSSID: string | null = null;

    static async lockToSSID(robotsWifi: string, killProcess: () => void): Promise<void> {
        this.lockedSSID = robotsWifi;
        const ssid: string = await WifiManager.getCurrentWifiSSID()

        if (ssid !== this.lockedSSID) {
            killProcess()
            throw new ConnectionWithRobotInterrupted()
        }

        this.unsubscribe = NetInfo.addEventListener(async (state): Promise<void> => {
            if (!state.isConnected || state.type !== "wifi") {
                killProcess()
                return
            }

            WifiManager.getCurrentWifiSSID()
                .then((currentSSID: string): void => {
                  if (currentSSID !== this.lockedSSID) {
                        killProcess();
                  }
                })
                .catch((): void => {
                    killProcess();
                })
        })
    }

    static releaseLock(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
            this.lockedSSID = null;
        }
    }
}