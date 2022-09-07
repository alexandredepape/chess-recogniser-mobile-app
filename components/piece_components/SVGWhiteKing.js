import React from 'react';
import Svg, { G, Path, } from 'react-native-svg';

export default ({width, height, fill, stroke, style}) => {
    return (
        <Svg width={width} height={height} fill={fill} stroke={stroke} style={style}><G fill="none" fillRule="evenodd"
                                                                                        stroke="#000" strokeWidth="1.5"
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"><Path
            d="M22.5 11.63V6M20 8h5" strokeLinejoin="miter"/><Path
            d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff"
            strokeLinecap="butt" strokeLinejoin="miter"/><Path
            d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z"
            fill="#fff"/><Path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></G></Svg>);
};
