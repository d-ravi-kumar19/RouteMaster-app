// CustomMarker.js
import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

export default CustomMarker = ({ rotation = 0, size = 30, color = 'dodgerblue', strokeColor = 'black' }) => {
  return (
    <Svg height={size} width={size} style={{ transform: [{ rotate: `${rotation}deg` }] }}>
      <Circle cx={size / 2} cy={size / 2} r={size / 4} fill={color} />
      <Line 
        x1={size / 2} 
        y1="0" 
        x2={size / 2} 
        y2={size / 2} 
        stroke={strokeColor} 
        strokeWidth="3" 
      />
    </Svg>
  );
};
