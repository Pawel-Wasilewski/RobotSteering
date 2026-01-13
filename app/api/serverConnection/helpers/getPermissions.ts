import LibNotAccessible from "@/app/errors/LibNoAccesable";

export default class GetPermissions {
    static async requestForegroundPermissionsAsync(): Promise<any> {
        try {
            const expoLocation = await import("expo-location");
            return expoLocation.requestForegroundPermissionsAsync();
        } catch {
            throw new LibNotAccessible("expo-location");
        }
    }
}