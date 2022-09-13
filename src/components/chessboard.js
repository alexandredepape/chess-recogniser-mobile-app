import { Vibration, View } from "react-native";
import Square from "./square";
import { useState } from "react";
import { Chess } from "chess.js";
import PiecePickerOverlay from "./piece_picker_overlay";

export default function Chessboard(props) {
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [piecePickerVisible, setPiecePickerVisible] = useState(false);

    let squares = {};
    let styles = {
        chessboard: {
            display: "flex",
            flexDirection: "column",
        },
        row: {
            display: "flex",
            flexDirection: "row",
        },
        black: "#af8461",
        white: "#e7d1af",
    };


    function onPressIn(squareId) {
        console.log("onPressIn: " + squareId);
        let square = squares[squareId];
        console.log("selecting square: " + squareId);
        if (selectedSquare) {
            if (selectedSquare.props.id === square.props.id) {
                console.log("unselecting square");
                setSelectedSquare(null);
                Vibration.vibrate(10);
            } else if (selectedSquare.props.piece) {
                console.log("We are trying to move the piece from " + selectedSquare.props.id + " to " + square.props.id);
                // empty the square where the piece was
                props.game.remove(selectedSquare.props.id);
                props.game.put({
                    type: selectedSquare.props.piece.type,
                    color: selectedSquare.props.piece.color
                }, square.props.id);
                //set the board to the new board
                props.setGame(new Chess(props.game.fen()));
                setSelectedSquare(null);
                Vibration.vibrate(50);
            } else {
                setSelectedSquare(square);
                Vibration.vibrate(100);

            }
        } else if (square.props.piece === false) {
            console.log("Square is empty, we will suggest the user to choose a piece.");
            Vibration.vibrate(10);
            setSelectedSquare(square);
            setPiecePickerVisible(!piecePickerVisible);

        } else {
            Vibration.vibrate(10);
            setSelectedSquare(square);
        }
    }

    function onLongPress(squareId) {
        console.log("onLongPress", squareId);
        let square = squares[squareId];
        if (!square.props.piece) {
            return;
        }
        Vibration.vibrate(100);
        setSelectedSquare(square);
        setPiecePickerVisible(!piecePickerVisible);

    }

    // create a function that will return the rows containing the squares for the chessboard with the pieces based on the board
    function getChessboardComponents() {
        // make the squares have ids that are the same as the square notation
        // for example, the top left square will have the id of a8
        // the bottom right square will have the id of h1
        // the top right square will have the id of h8
        // the bottom left square will have the id of a1
        // the squares will be in the order of a8, b8, c8, d8, e8, f8, g8, h8, a7, b7, c7, d7, e7, f7, g7, h7, a6, b6, c6, d6, e6, f6, g6, h6, a5, b5, c5, d5, e5, f5, g5, h5, a4, b4, c4, d4, e4, f4, g4, h4, a3, b3, c3, d3, e3, f3, g3, h3, a2, b2, c2, d2, e2, f2, g2, h2, a1, b1, c1, d1, e1, f1, g1, h1
        let numbers = ["8", "7", "6", "5", "4", "3", "2", "1"];
        let letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
        let rows = [];
        for (let i = 0; i < 8; i++) {
            let squaresRow = [];
            for (let j = 0; j < 8; j++) {
                let squareId = letters[j] + numbers[i];
                let piece = props.game.get(squareId);
                let color = (i + j) % 2 === 0 ? styles.black : styles.white;
                let square = <Square key={squareId}
                                     id={squareId}
                                     color={color}
                                     piece={piece}
                                     notation={squareId}
                                     onPressIn={onPressIn}
                                     onLongPress={onLongPress}
                                     selected={selectedSquare ? selectedSquare.props.id === squareId : false}
                />;
                squaresRow.push(square);
                squares[squareId] = square;

            }
            rows.push(<View style={styles.row} key={i}>{squaresRow}</View>);
        }
        if (props.squareA1isBottomLeft) {
            // reverse the rows
            rows.reverse();
            for (let i = 0; i < rows.length; i++) {
                rows[i].props.children.reverse();
            }
        }
        return rows;
    }

    return (
        <View style={styles.chessboard}>
            {getChessboardComponents()}
            <PiecePickerOverlay visible={piecePickerVisible}
                                setPiecePickerVisible={setPiecePickerVisible}
                                piecePickerVisible={piecePickerVisible}
                                selectedSquare={selectedSquare}
                                setSelectedSquare={setSelectedSquare}
                                game={props.game}
                                setGame={props.setGame}
            />
        </View>
    );
}
