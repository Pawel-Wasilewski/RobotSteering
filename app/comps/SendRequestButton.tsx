import {Pressable, StyleSheet, Text} from "react-native";
import ButtonColors from "@/app/comps/Interfaces/ButtonColors";


interface Props {
    buttonTitle: string;
    buttonColor: ButtonColors;
    onPress: (...args: any[]) => any;
}

export default function SendRequestButton({buttonTitle, buttonColor, onPress}: Props) {
    const styles = StyleSheet.create({
        button: {
            backgroundColor: buttonColor,
            width: 100,
            height: 100,
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 5,
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
        },
        buttonText: {
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "bold",
        },
        buttonClicked: {
            opacity: 0.7,
        },
    })

    return (
        <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonClicked]}
            onPress={onPress}>
            <Text
                style={styles.buttonText}>
                {buttonTitle}
            </Text>
        </Pressable>
    );
}