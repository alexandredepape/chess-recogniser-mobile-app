import { StyleSheet, Text, Vibration, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import { getPieceImageFromPiece } from "./square_image_loader";
import { useEffect, useRef, useState } from "react";

const WHITE_QUEEN = getPieceImageFromPiece({type: "q", color: "w"});

export default function LoadingScreen(props) {
    const [progressBarValue, setProgressBarValue] = useState(0);
    const counter = useRef(0);

    function start() {
        counter.current = 0;
        setProgressBarValue(0);
    }

    useEffect(() => {
        start();
    }, []);

    useEffect(() => {
        // console.log("useEffect called");
        // console.log("counter: " + JSON.stringify(counter));
        // if (!props.serverIsPredicting) return;
        let nbTicks = 10;
        if (counter.current < nbTicks) {
            counter.current += 1;
            const timer = setTimeout(() => {
                setProgressBarValue(progressBarValue + 1 / nbTicks);
                Vibration.vibrate(10);
            }, 4000 / nbTicks);

            return () => {
                clearTimeout(timer)
            };
        }

    }, [progressBarValue]);
    return (
        <View style={styles.progressBarContainer}>
            <Text style={styles.progressBarText}>
                Server is calculating...
            </Text>
            <ProgressBar style={styles.progressBar}
                         progress={progressBarValue}
                         color={"#9dd4ae"}/>
            {WHITE_QUEEN}
        </View>
    )
}

const styles = StyleSheet.create({
    progressBarText: {
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

    }
});
