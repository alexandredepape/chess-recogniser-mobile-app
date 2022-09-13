import { Button, Linking, Pressable, SafeAreaView, StyleSheet, Text, Vibration, View } from "react-native";
import Chessboard from "./src/components/chessboard";
import { createRef, useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { getPieceImageFromPiece } from "./src/components/square_image_loader";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowRotateRight, faCamera, faPlay, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Camera } from 'expo-camera';

import LoadingScreen from "./src/components/loading_screen";
import CameraView from "./src/components/camera_view";

const WHITE_QUEEN = getPieceImageFromPiece({type: "q", color: "w"});
const BLACK_QUEEN = getPieceImageFromPiece({type: "q", color: "b"});

export default function App() {
    const [game, setGame] = useState(new Chess("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"))
    const [turn, setTurn] = useState("w");
    const [squareA1isBottomLeft, setSquareA1isBottomLeft] = useState(true);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [takingPicture, setTakingPicture] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [serverIsPredicting, setServerIsPredicting] = useState(false);
    const cameraRef = createRef();

    const chessboard = <Chessboard game={game} setGame={setGame} squareA1isBottomLeft={squareA1isBottomLeft}/>;
    const loadingScreen = <LoadingScreen serverIsPredicting={serverIsPredicting}/>;
    const cameraView = <CameraView cameraRef={cameraRef} takePicture={takePicture}/>;

    function getFen() {
        let fen = game.fen();
        // modify the turn in the fen based on the turn variable
        fen = fen.split(" ");
        fen[1] = turn;
        fen = fen.join(" ");
        return fen;
    }


    // open "https://lichess.org/analysis/standard/" in the browser with the fen of the chessboard added to it
    function goToLichess() {
        console.log("goToLichess");
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
        let split = game.fen().split(" ");
        let fenRows = split[0];
        fenRows = fenRows.split("").reverse().join("");
        let newFen = fenRows + " " + split[1] + " " + split[2] + " " + split[3] + " " + split[4] + " " + split[5];
        setGame(new Chess(newFen));
        setSquareA1isBottomLeft(!squareA1isBottomLeft);
    }

    useEffect(() => {
        console.log("useEffect takingPicture:" + takingPicture);
        if (!takingPicture && photo.current) {
            console.log("Sending to server a " + photo.current.width + "x" + photo.current.height + " image");
            const URL = "https://f66d-2a02-a03f-6b2d-1e00-5951-5e9-2a97-f09e.eu.ngrok.io";
            const PREDICT_ENDPOINT = URL + "/predict";

            fetch(PREDICT_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    image_base_64: photo.current.base64
                })
            }).then(response => response.json()).then(data => {
                console.log("fen: " + data.fen);
                setServerIsPredicting(false);
                photo.current = null;
                let turn = data.fen.split(" ")[1];
                setTurn(turn);
                setGame(new Chess(data.fen));
            });
            console.log("setting server is predicting to true");
            setServerIsPredicting(true);
        }
    }, [takingPicture]);

    let photo = useRef(null);

    async function takePicture() {
        console.log("takePictureButton pushed");
        Vibration.vibrate(100);
        console.log("Taking the picture");
        let options = {
            quality: 0.5,
            skipProcessing: true,
            base64: true
        };
        let result = await cameraRef.current.takePictureAsync(options);
        console.log("finished taking a picture");
        photo.current = result;
        setTakingPicture(false);
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
        return cameraView;
    }
    if (serverIsPredicting) {
        return loadingScreen;
    }
    const size = 30;
    return (
        <SafeAreaView style={styles.container}>

            {!takingPicture && chessboard}
            {!takingPicture &&
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <Pressable style={styles.invertButton}
                               onPressIn={() => onInvertBoard()}>
                        <FontAwesomeIcon size={size} style={styles.icon} icon={faArrowRotateRight}/>

                        {/*<Text style={styles.buttonText}>*/}
                        {/*    Invert Board*/}
                        {/*</Text>*/}
                    </Pressable>
                    {/*Create a button to empty the board*/}
                    <Pressable style={styles.emptyBoardButton}
                               onPressIn={() => resetGame()}>
                        <FontAwesomeIcon size={size} icon={faTimes}/>

                        {/*<Text style={styles.buttonText}>*/}
                        {/*    Reset Game*/}
                        {/*</Text>*/}
                    </Pressable>
                    <Pressable style={styles.turnButton}
                               onPressIn={() => toggleTurn()}>

                        {turn === "w" ? WHITE_QUEEN : BLACK_QUEEN}
                        {/*<Text style={styles.buttonText}>*/}
                        {/*    's turn*/}
                        {/*</Text>*/}
                    </Pressable>
                    <Pressable style={styles.applyButton}
                               onPressIn={() => goToLichess()}>
                        <FontAwesomeIcon size={size} icon={faPlay}/>
                        {/*<Text style={styles.buttonText}>*/}
                        {/*    Apply*/}
                        {/*</Text>*/}
                    </Pressable>
                </View>}
            <View style={{flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>

                <Pressable style={styles.cameraButton}
                           onPressIn={() => openCamera()}>
                    <FontAwesomeIcon size={size} icon={faCamera}/>
                </Pressable>
            </View>

        </SafeAreaView>
    );
}
const BLUE = "#313845";

const styles = StyleSheet.create({
    container: {
        backgroundColor: BLUE,
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
});
