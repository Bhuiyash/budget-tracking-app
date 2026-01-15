import React from 'react';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

interface AppIconProps {
  size?: number;
}

export default function AppIcon({ size = 64 }: AppIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
          <Stop offset="100%" stopColor="#1d4ed8" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      
      {/* Background Circle */}
      <Circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#gradient)"
        stroke="#ffffff"
        strokeWidth="2"
      />
      
      {/* Wallet Icon */}
      <Path
        d="M25 35h50c2.5 0 4.5 2 4.5 4.5v21c0 2.5-2 4.5-4.5 4.5H25c-2.5 0-4.5-2-4.5-4.5v-21c0-2.5 2-4.5 4.5-4.5z"
        fill="#ffffff"
        opacity="0.9"
      />
      
      {/* Card slot */}
      <Path
        d="M70 45h8c1.5 0 2.5 1 2.5 2.5v5c0 1.5-1 2.5-2.5 2.5h-8c-1.5 0-2.5-1-2.5-2.5v-5c0-1.5 1-2.5 2.5-2.5z"
        fill="#10b981"
      />
      
      {/* Money symbol */}
      <Path
        d="M40 42v4m0 8v4m-8-8h16m-14-4h12m-10 8h8"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
