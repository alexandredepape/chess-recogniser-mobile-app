import React from 'react';
import { Overlay } from '@rneui/themed';
import { Pressable, StyleSheet, Vibration, View } from 'react-native';
import { getPieceImageFromPiece } from "./square_image_loader";
import { Chess } from "chess.js";


export default function PiecePickerOverlay(props) {
    // create a function that creates a grid of all the pieces
    // the grid will be 3X4
    // the grid will be a 2D array
    // the grid will be a 2D array of objects
    // the objects will have a type and a color
    function createPieceGrid() {
        let pieceGrid = [];
        let pieceTypes = ["p", "n", "b", "r", "q", "k"];
        let pieceColors = ["w", "b"];

        function alreadyHasKing(color) {
            let fen = props.game.fen();
            let pieces = fen.split(" ")[0];
            if (color === "w") {
                return pieces.includes("K");
            }
            return pieces.includes("k");
        }


        for (let i = 0; i < 2; i++) {
            let row = [];
            for (let j = 0; j < 6; j++) {
                row.push({
                    type: pieceTypes[j],
                    color: pieceColors[i]
                });
            }
            pieceGrid.push(row);
        }
        // remove the kings from the piece types if the props.game already has one of them

        if (alreadyHasKing("w")) {
            pieceGrid[0].splice(5, 1);
        }
        if (alreadyHasKing("b")) {
            pieceGrid[1].splice(5, 1);
        }
        return pieceGrid;
    }

    function getPieceGrid() {
        const pieceGrid = createPieceGrid();
        return (pieceGrid.map((row, rowIndex) => {
                return (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((piece, pieceIndex) => {
                            return (
                                <Pressable key={pieceIndex} onPressIn={() => onPieceSelected(piece)}>
                                    {getPieceImageFromPiece(piece)}
                                </Pressable>
                            );
                        })}
                    </View>
                );
            })
        )
    }

    function onPieceSelected(piece) {
        console.log("onPieceSelected", piece);

        if (props.selectedSquare) {
            if (!piece) {
                props.game.remove(props.selectedSquare.props.id);
            } else {
                props.game.put({
                    type: piece.type,
                    color: piece.color
                }, props.selectedSquare.props.id);
            }
            //set the board to the new board
            props.setGame(new Chess(props.game.fen()));
            props.setSelectedSquare(null);
            Vibration.vibrate(50);
        }
        props.setPiecePickerVisible(!props.piecePickerVisible)
    }

    function addSquareReset() {

        if (props.selectedSquare && props.selectedSquare.props.piece) {
            return (
                <Pressable style={{
                    width: 45,
                    height: 45,
                    backgroundColor: props.selectedSquare.props.color,

                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 0.5,
                    borderColor: "#000",
                }}
                           onPressIn={() => onPieceSelected(null)}>
                </Pressable>
            )
        }
    }

    // place the overlay in the middle of the chessboard
    return (
        <Overlay overlayStyle={styles.overlay}
                 isVisible={props.visible}
                 onBackdropPress={() => {
                     props.setPiecePickerVisible(!props.piecePickerVisible);
                     props.setSelectedSquare(null);
                     Vibration.vibrate(10);
                 }}>
            {getPieceGrid()}
            {addSquareReset()}


        </Overlay>
    );
};

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: "#313845",
        alignItems: "center",
        borderRadius: 10,
        //place it in the middle of the chessboard
        position: "absolute",
        top: 150,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between"

    },
    button: {
        margin: 10,
    },
    textPrimary: {
        marginVertical: 20,
        textAlign: 'center',
        fontSize: 20,
    },
    textSecondary: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 17,
    },
});

