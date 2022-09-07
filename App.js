import { Button, Linking, Pressable, SafeAreaView, StyleSheet, Text, Vibration, View } from "react-native";
import Chessboard from "./components/chessboard";
import { createRef, useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { getPieceImageFromPiece } from "./components/square_image_loader";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowRotateRight, faCamera, faPlay, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Camera } from 'expo-camera';
import { ProgressBar } from 'react-native-paper';

export default function App() {
    const [game, setGame] = useState(new Chess("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"))
    const [turn, setTurn] = useState("w");
    const [squareA1isBottomLeft, setSquareA1isBottomLeft] = useState(true);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [takingPicture, setTakingPicture] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [serverIsPredicting, setServerIsPredicting] = useState(false);
    const [progressBarValue, setProgressBarValue] = useState(0);

    let chessboard = <Chessboard game={game} setGame={setGame} squareA1isBottomLeft={squareA1isBottomLeft}/>;
    const cameraRef = createRef();


    function getFen() {
        let fen = game.fen();
        // modify the turn in the fen based on the turn variable
        fen = fen.split(" ");
        fen[1] = turn;
        fen = fen.join(" ");
        return fen;
    }

    const counter = useRef(0);

    useEffect(() => {
        console.log("useEffect called");
        console.log("counter: " + JSON.stringify(counter));
        let nbTicks = 50;
        if (counter.current < nbTicks) {
            counter.current += 1;
            const timer = setTimeout(() => setProgressBarValue(progressBarValue + 1 / nbTicks), 4000 / nbTicks);

            return () => {
                clearTimeout(timer)
            };
        }
    }, [progressBarValue]);

    // open "https://lichess.org/analysis/standard/" in the browser with the fen of the chessboard added to it
    function sendToServer() {
        console.log("sendToServer");
        let fen = getFen();
        // open the url in the browser
        Linking.openURL('https://lichess.org/analysis/standard/' + fen);
        // vibrate the phone
        Vibration.vibrate(50);
    }

    function toggleTurn() {
        console.log("toggleTurn");
        setTurn(turn === "w" ? "b" : "w");
        Vibration.vibrate(100);
    }

    let whiteQueen = getPieceImageFromPiece({type: "q", color: "w"});
    let blackQueen = getPieceImageFromPiece({type: "q", color: "b"});

    function resetGame() {
        setGame(new Chess());
        Vibration.vibrate(100);
    }

    async function openCamera() {
        setTakingPicture(!takingPicture);
        Vibration.vibrate(100);
    }


    function onInvertBoard() {
        Vibration.vibrate(100);
        console.log("fen before invert: " + game.fen());
        // reverse the fen notation and set a new game with the reversed fen notation
        let split = game.fen().split(" ");
        let fenRows = split[0];
        fenRows = fenRows.split("").reverse().join("");
        let newFen = fenRows + " " + split[1] + " " + split[2] + " " + split[3] + " " + split[4] + " " + split[5];
        console.log("newFen: " + newFen);
        setGame(new Chess(newFen));
        setSquareA1isBottomLeft(!squareA1isBottomLeft);
    }


    async function takePicture() {
        console.log("takePicture");
        Vibration.vibrate(100);

        let photo = await cameraRef.current.takePictureAsync({quality: 1, base64: true});
        console.log("finished taking a picture");
        counter.current = 0;
        setTakingPicture(false);
        setServerIsPredicting(true);
        setProgressBarValue(0);

        const PREDICT_ENDPOINT = "https://84d1-2a02-a03f-6b2d-1e00-b52d-2a-1c52-daeb.eu.ngrok.io/predict";
        fetch(PREDICT_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                image_base_64: photo.base64
            })
        }).then(response => response.json()).then(data => {
            console.log("fen: " + data.fen);
            setServerIsPredicting(false);
            setGame(new Chess(data.fen));
        });

    }

    if (!permission) {
        // Camera permissions are still loading
        return <View/>;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.cameraContainer}>
                <Text style={{textAlign: 'center'}}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="grant permission"/>
            </View>
        );
    }
    if (takingPicture) {
        return (
            <View style={styles.cameraContainer}>
                <Camera ref={cameraRef}
                        style={styles.camera}
                        onCameraReady={() => setCameraReady(true)}
                >
                    {cameraReady && <View style={styles.buttonContainer}>
                        <Pressable style={styles.takePictureButton}
                                   onPressIn={() => takePicture()}>
                            <FontAwesomeIcon size={25} icon={faCamera} color={"black"}/>
                        </Pressable>
                    </View>}
                </Camera>
            </View>
        )
    }
    if (serverIsPredicting) {
        return (
            <View style={styles.progressBarContainer}>
                <Text style={styles.text}>
                    Server is calculating...
                </Text>
                <ProgressBar style={styles.progressBar}
                             progress={progressBarValue}
                             color={"#9dd4ae"}/>
                {whiteQueen}
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.container}>

            {!takingPicture && chessboard}
            {!takingPicture &&
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <Pressable style={styles.invertButton}
                               onPressIn={() => onInvertBoard()}>
                        <FontAwesomeIcon size={25} style={styles.icon} icon={faArrowRotateRight}/>

                        {/*<Text style={styles.buttonText}>*/}
                        {/*    Invert Board*/}
                        {/*</Text>*/}
                    </Pressable>
                    {/*Create a button to empty the board*/}
                    <Pressable style={styles.emptyBoardButton}
                               onPressIn={() => resetGame()}>
                        <FontAwesomeIcon size={25} icon={faTimes}/>

                        {/*<Text style={styles.buttonText}>*/}
                        {/*    Reset Game*/}
                        {/*</Text>*/}
                    </Pressable>
                    <Pressable style={styles.turnButton}
                               onPressIn={() => toggleTurn()}>

                        {turn === "w" ? whiteQueen : blackQueen}
                        {/*<Text style={styles.buttonText}>*/}
                        {/*    's turn*/}
                        {/*</Text>*/}
                    </Pressable>
                    <Pressable style={styles.applyButton}
                               onPressIn={() => sendToServer()}>
                        <FontAwesomeIcon size={25} icon={faPlay}/>
                        {/*<Text style={styles.buttonText}>*/}
                        {/*    Apply*/}
                        {/*</Text>*/}
                    </Pressable>
                </View>}
            <View style={{flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>

                <Pressable style={styles.cameraButton}
                           onPressIn={() => openCamera()}>
                    <FontAwesomeIcon size={25} icon={faCamera}/>
                </Pressable>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#313845",
        flex: 1,
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
        paddingTop: 44,
        padding: 8
    },
    // Create button style that looks like apple buttons
    applyButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#9dd4ae",
        padding: 15,
        borderRadius: 7.5,
        margin: 10,
        borderColor: "#000000",
        borderWidth: 1,
        userSelect: "none"
    },

    turnButton: {
        backgroundColor: "#5da8ff",
        borderRadius: 7.5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        padding: 5,
        borderColor: "#000000",
        borderWidth: 1,
        userSelect: "none"
    },

    emptyBoardButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ff5d5d",
        padding: 15,
        borderRadius: 7.5,
        margin: 10,
        borderColor: "#000000",
        borderWidth: 1,
        userSelect: "none"
    },
    buttonText: {
        color: "#000000",
        fontSize: 20,
    },
    invertButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#5d5dff",
        padding: 15,
        borderRadius: 7.5,
        margin: 10,
        borderColor: "#000000",
        borderWidth: 1,
        userSelect: "none"
    },
    cameraButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ffdb81",
        padding: 15,
        borderRadius: 7.5,
        margin: 10,
        borderColor: "#000000",
        borderWidth: 1,
        userSelect: "none"
    },
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
        backgroundColor: "#ffdb81",
        padding: 15,
        borderRadius: 7.5,
        margin: 10,
        borderColor: "#000000",
        borderWidth: 1,
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

    }
});
