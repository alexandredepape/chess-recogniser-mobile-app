import BlackKing from "./piece_components/SVGBlackKing.js";
import BlackQueen from "./piece_components/SVGBlackQueen";
import BlackRook from "./piece_components/SVGBlackRook";
import BlackBishop from "./piece_components/SVGBlackBishop";
import BlackKnight from "./piece_components/SVGBlackKnight";
import BlackPawn from "./piece_components/SVGBlackPawn";
import WhiteKing from "./piece_components/SVGWhiteKing";
import WhiteQueen from "./piece_components/SVGWhiteQueen";
import WhiteRook from "./piece_components/SVGWhiteRook";
import WhiteBishop from "./piece_components/SVGWhiteBishop";
import WhiteKnight from "./piece_components/SVGWhiteKnight";
import WhitePawn from "./piece_components/SVGWhitePawn";


const pieceImages = {
    "w-p": <WhitePawn width={45} height={45}/>,
    "w-q": <WhiteQueen width={45} height={45}/>,
    "b-k": <BlackKing width={45} height={45}/>,
    "w-k": <WhiteKing width={45} height={45}/>,
    "w-b": <WhiteBishop width={45} height={45}/>,
    "w-n": <WhiteKnight width={45} height={45}/>,
    "w-r": <WhiteRook width={45} height={45}/>,
    "b-p": <BlackPawn width={45} height={45}/>,
    "b-q": <BlackQueen width={45} height={45}/>,
    "b-b": <BlackBishop width={45} height={45}/>,
    "b-n": <BlackKnight width={45} height={45}/>,
    "b-r": <BlackRook width={45} height={45}/>,
};

export function getPieceImageFromPiece(piece) {
    let s = piece.color + "-" + piece.type;
    return pieceImages[s];
}
