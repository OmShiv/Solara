import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, G, Defs, RadialGradient, Stop, Text as SvgText } from 'react-native-svg';
import Animated, { useAnimatedProps, withSpring } from 'react-native-reanimated';
import { Waypoint, CelestialBody } from '@/lib/celestial';
import { AppColors, Spacing } from '@/constants/theme';

interface CelestialArcOverlayProps {
  waypoints: Waypoint[];
  selectedWaypoint: Waypoint | null;
  currentPosition: { azimuth: number; altitude: number };
  celestialBody: CelestialBody;
  sliderValue: number;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CENTER_X = SCREEN_WIDTH / 2;
const CENTER_Y = SCREEN_HEIGHT * 0.6;
const ARC_RADIUS = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.35;

function altitudeToY(altitude: number): number {
  const normalizedAlt = (altitude + 10) / 100;
  return CENTER_Y - normalizedAlt * ARC_RADIUS * 1.5;
}

function azimuthToX(azimuth: number, altitude: number): number {
  const range = SCREEN_WIDTH * 0.8;
  const normalizedAz = ((azimuth - 90) % 360) / 180;
  const altFactor = Math.max(0.3, (altitude + 30) / 120);
  return CENTER_X + normalizedAz * range * 0.5 * altFactor;
}

export function CelestialArcOverlay({
  waypoints,
  selectedWaypoint,
  currentPosition,
  celestialBody,
  sliderValue,
}: CelestialArcOverlayProps) {
  const pathData = useMemo(() => {
    if (waypoints.length < 2) return '';

    const points = waypoints.map(wp => ({
      x: azimuthToX(wp.azimuth, wp.altitude),
      y: altitudeToY(wp.altitude),
    }));

    let d = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cp1x = prev.x + (curr.x - prev.x) * 0.5;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) * 0.5;
      const cp2y = curr.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    return d;
  }, [waypoints]);

  const currentX = azimuthToX(currentPosition.azimuth, currentPosition.altitude);
  const currentY = altitudeToY(currentPosition.altitude);

  const selectedIndex = Math.floor(sliderValue * (waypoints.length - 1));
  const selectedPoint = waypoints[selectedIndex];
  const selectedX = selectedPoint ? azimuthToX(selectedPoint.azimuth, selectedPoint.altitude) : currentX;
  const selectedY = selectedPoint ? altitudeToY(selectedPoint.altitude) : currentY;

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="bodyGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={celestialBody.color} stopOpacity="1" />
            <Stop offset="50%" stopColor={celestialBody.color} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={celestialBody.color} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="waypointGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={AppColors.accent} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={AppColors.accent} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {pathData ? (
          <>
            <Path
              d={pathData}
              stroke={celestialBody.color}
              strokeWidth={6}
              strokeOpacity={0.3}
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d={pathData}
              stroke={celestialBody.color}
              strokeWidth={2}
              strokeOpacity={0.8}
              fill="none"
              strokeLinecap="round"
            />
          </>
        ) : null}

        {waypoints.map((wp, index) => {
          const x = azimuthToX(wp.azimuth, wp.altitude);
          const y = altitudeToY(wp.altitude);
          const isSelected = index === selectedIndex;
          const isVisible = wp.altitude > -10;

          if (!isVisible) return null;

          return (
            <G key={wp.id}>
              {isSelected ? (
                <Circle cx={x} cy={y} r={20} fill="url(#waypointGlow)" />
              ) : null}
              <Circle
                cx={x}
                cy={y}
                r={isSelected ? 8 : 5}
                fill={isSelected ? AppColors.accent : 'rgba(255, 255, 255, 0.6)'}
                stroke={isSelected ? AppColors.accent : 'rgba(255, 255, 255, 0.8)'}
                strokeWidth={isSelected ? 2 : 1}
              />
              {isSelected ? (
                <SvgText
                  x={x}
                  y={y - 20}
                  fontSize={12}
                  fontWeight="600"
                  fill="#FFFFFF"
                  textAnchor="middle"
                >
                  {wp.label}
                </SvgText>
              ) : null}
            </G>
          );
        })}

        <Circle cx={currentX} cy={currentY} r={40} fill="url(#bodyGlow)" />
        <Circle
          cx={currentX}
          cy={currentY}
          r={16}
          fill={celestialBody.color}
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth={2}
        />
        {celestialBody.type === 'moon' ? (
          <Circle
            cx={currentX - 4}
            cy={currentY}
            r={14}
            fill={AppColors.primary}
          />
        ) : null}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
