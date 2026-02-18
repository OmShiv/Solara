import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, G, Defs, RadialGradient, Stop, Text as SvgText, Line } from 'react-native-svg';
import { Waypoint, CelestialBody, Location } from '@/lib/celestial';
import { AppColors, Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/ThemedText';
import { Feather } from '@expo/vector-icons';

interface MapArcOverlayProps {
  waypoints: Waypoint[];
  selectedWaypoint: Waypoint | null;
  currentPosition: { azimuth: number; altitude: number };
  celestialBody: CelestialBody;
  sliderValue: number;
  location: Location;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CENTER_X = SCREEN_WIDTH / 2;
const CENTER_Y = SCREEN_HEIGHT * 0.45;
const ARC_RADIUS = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.3;

export function MapArcOverlay({
  waypoints,
  selectedWaypoint,
  currentPosition,
  celestialBody,
  sliderValue,
  location,
}: MapArcOverlayProps) {
  const arcPoints = useMemo(() => {
    return waypoints.map((wp, index) => {
      const angle = (wp.azimuth - 90) * (Math.PI / 180);
      const heightFactor = Math.max(0.2, (wp.altitude + 20) / 110);
      const radius = ARC_RADIUS * (1 + heightFactor * 0.5);
      
      return {
        x: CENTER_X + Math.cos(angle) * radius * 0.8,
        y: CENTER_Y - heightFactor * ARC_RADIUS * 0.8 + Math.sin(angle) * radius * 0.3,
        altitude: wp.altitude,
        isVisible: wp.altitude > 0,
      };
    });
  }, [waypoints]);

  const pathData = useMemo(() => {
    if (arcPoints.length < 2) return '';

    let d = `M ${arcPoints[0].x} ${arcPoints[0].y}`;
    
    for (let i = 1; i < arcPoints.length; i++) {
      const prev = arcPoints[i - 1];
      const curr = arcPoints[i];
      const cp1x = prev.x + (curr.x - prev.x) * 0.5;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) * 0.5;
      const cp2y = curr.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    return d;
  }, [arcPoints]);

  const currentAngle = (currentPosition.azimuth - 90) * (Math.PI / 180);
  const currentHeightFactor = Math.max(0.2, (currentPosition.altitude + 20) / 110);
  const currentRadius = ARC_RADIUS * (1 + currentHeightFactor * 0.5);
  const currentX = CENTER_X + Math.cos(currentAngle) * currentRadius * 0.8;
  const currentY = CENTER_Y - currentHeightFactor * ARC_RADIUS * 0.8 + Math.sin(currentAngle) * currentRadius * 0.3;

  const selectedIndex = Math.floor(sliderValue * (waypoints.length - 1));

  return (
    <View style={styles.container}>
      <View style={styles.mapBackground}>
        <View style={styles.gridContainer}>
          {[0, 1, 2, 3].map(i => (
            <View
              key={`circle-${i}`}
              style={[
                styles.gridCircle,
                {
                  width: (i + 1) * (ARC_RADIUS * 0.5),
                  height: (i + 1) * (ARC_RADIUS * 0.5),
                  borderRadius: ((i + 1) * (ARC_RADIUS * 0.5)) / 2,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.compassContainer}>
          <ThemedText style={[styles.compassLabel, styles.compassN]}>N</ThemedText>
          <ThemedText style={[styles.compassLabel, styles.compassE]}>E</ThemedText>
          <ThemedText style={[styles.compassLabel, styles.compassS]}>S</ThemedText>
          <ThemedText style={[styles.compassLabel, styles.compassW]}>W</ThemedText>
        </View>

        <View style={styles.locationMarker}>
          <Feather name="navigation" size={20} color={AppColors.accent} />
        </View>
      </View>

      <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="mapBodyGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={celestialBody.color} stopOpacity="1" />
            <Stop offset="50%" stopColor={celestialBody.color} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={celestialBody.color} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {pathData ? (
          <>
            <Path
              d={pathData}
              stroke={celestialBody.color}
              strokeWidth={8}
              strokeOpacity={0.2}
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d={pathData}
              stroke={celestialBody.color}
              strokeWidth={3}
              strokeOpacity={0.9}
              fill="none"
              strokeLinecap="round"
              strokeDasharray="8,4"
            />
          </>
        ) : null}

        {arcPoints.map((point, index) => {
          const isSelected = index === selectedIndex;
          const wp = waypoints[index];

          return (
            <G key={`waypoint-${index}`}>
              <Circle
                cx={point.x}
                cy={point.y}
                r={isSelected ? 10 : 6}
                fill={isSelected ? AppColors.accent : point.isVisible ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.3)'}
                stroke={isSelected ? AppColors.accent : 'rgba(255, 255, 255, 0.5)'}
                strokeWidth={isSelected ? 2 : 1}
              />
              {isSelected && wp ? (
                <SvgText
                  x={point.x}
                  y={point.y - 18}
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

        <Circle cx={currentX} cy={currentY} r={30} fill="url(#mapBodyGlow)" />
        <Circle
          cx={currentX}
          cy={currentY}
          r={14}
          fill={celestialBody.color}
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth={2}
        />
      </Svg>

      <View style={styles.locationInfo}>
        <ThemedText style={styles.locationName}>{location.name || 'Current Location'}</ThemedText>
        <ThemedText style={styles.locationCoords}>
          {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  mapBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    position: 'absolute',
    top: CENTER_Y - ARC_RADIUS,
    left: CENTER_X - ARC_RADIUS,
    width: ARC_RADIUS * 2,
    height: ARC_RADIUS * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridCircle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  compassContainer: {
    position: 'absolute',
    top: CENTER_Y - ARC_RADIUS - 40,
    left: CENTER_X - ARC_RADIUS - 40,
    width: (ARC_RADIUS + 40) * 2,
    height: (ARC_RADIUS + 40) * 2,
  },
  compassLabel: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  compassN: {
    top: 0,
    left: '50%',
    marginLeft: -6,
  },
  compassE: {
    right: 0,
    top: '50%',
    marginTop: -10,
  },
  compassS: {
    bottom: 0,
    left: '50%',
    marginLeft: -5,
  },
  compassW: {
    left: 0,
    top: '50%',
    marginTop: -10,
  },
  locationMarker: {
    position: 'absolute',
    top: CENTER_Y - 10,
    left: CENTER_X - 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: {
    position: 'absolute',
    top: Spacing["5xl"] * 2,
    left: Spacing.lg,
    right: Spacing.lg,
    alignItems: 'center',
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
