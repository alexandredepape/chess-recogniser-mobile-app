import { Pressable, SafeAreaView, StyleSheet, View } from "react-native";
import { Camera } from "expo-camera";

export default function CameraView(props) {
    return (
        <SafeAreaView style={styles.cameraContainer}>

            <Camera ref={props.cameraRef}
                    ratio="16:9"
                    style={styles.camera}>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.takePictureButton}
                               onPressIn={() => props.takePicture()}>
                    </Pressable>
                </View>
            </Camera>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        // backgroundColor: 'transparent',
        // margin: 64,
    },
    takePictureButton: {
        // flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: "white",
        padding: 15,
        width: 65,
        height: 65,
        borderRadius: 70 / 2,
        margin: 10,
        borderColor: "#000000",
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffdb81',
    },
    progressBarContainer: {
        flex: 1,
        backgroundColor: "#313845",
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBar: {
        width: 300,
        // backgroundColor: "white",
        borderRadius: 7.5,
        height: 15,
        margin: 10,
    },
});
