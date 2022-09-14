import React from 'react';
import Svg, { G, Path, } from 'react-native-svg';

export default ({width, height, fill, stroke, style}) => {
    return (
        <Svg width={width} height={height} fill={fill} stroke={stroke} style={style}><G fill="#fff" fillRule="evenodd"
                                                                                        stroke="#000" strokeWidth="1.5"
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"><Path
            d="M9 39h27v-3H9v3zm3-3v-4h21v4H12zm-1-22V9h4v2h5V9h5v2h5V9h4v5" strokeLinecap="butt"/><Path
            d="M34 14l-3 3H14l-3-3"/><Path d="M31 17v12.5H14V17" strokeLinecap="butt" strokeLinejoin="miter"/><Path
            d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><Path d="M11 14h23" fill="none" strokeLinejoin="miter"/></G></Svg>);
};
