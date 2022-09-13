import React from 'react';
import Svg, { G, Path, } from 'react-native-svg';

export default ({width, height, fill, stroke, style}) => {
    return (
        <Svg width={width} height={height} fill={"black"} stroke={stroke} style={style}><G fillRule="evenodd" stroke="#000"
                                                                                        strokeWidth="1.5"
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"><Path
            d="M9 39h27v-3H9v3zm3.5-7l1.5-2.5h17l1.5 2.5h-20zm-.5 4v-4h21v4H12z" strokeLinecap="butt"/><Path
            d="M14 29.5v-13h17v13H14z" strokeLinecap="butt" strokeLinejoin="miter"/><Path
            d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" strokeLinecap="butt"/><Path
            d="M12 35.5h21m-20-4h19m-18-2h17m-17-13h17M11 14h23" fill="none" stroke="#ececec" strokeWidth="1"
            strokeLinejoin="miter"/></G></Svg>);
};
