import { Pressable, Text, View } from "react-native";
import { getPieceImageFromPiece } from "./square_image_loader";

export default function Square(props) {

    function getNotationColor(color) {
        return color === "#af8461" ? "#e7d1af" : "#af8461";
    }

    let styles = {
        // Create a square style that centers the piece svgin the square
        square: {
            width: 45,
            height: 45,
            backgroundColor: props.color,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 0.25,
            borderColor: "#000",
            userSelect: "none"
        },
        selected: {
            width: 45,
            height: 45,
            backgroundColor: "#ffdd86",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 0.25,
            borderColor: "#000",
        },

        notation: {
            occupied: {
                color: getNotationColor(props.color),
                fontSize: 7.5,
                fontWeight: "bold",
                paddingRight: 2.5,
                position: "absolute",
                top: 0,
                right: 0,
            },
            empty: {
                color: getNotationColor(props.color),
                fontSize: 15,
                fontWeight: "bold",
                position: "absolute",
            }

        }

    };


    return (
        <Pressable onPressIn={() => props.onPressIn(props.id)}
                   onLongPress={() => props.onLongPress(props.id)}>
            <View style={props.selected ? styles.selected : styles.square}>
                <Text style={props.piece ? styles.notation.occupied : styles.notation.empty}>{props.notation}</Text>
                {props.piece && getPieceImageFromPiece(props.piece)}
            </View>
        </Pressable>
    );
}
