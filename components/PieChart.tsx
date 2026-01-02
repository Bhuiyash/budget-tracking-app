import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

export interface PieChartData {
  category: string;
  total: number;
  percentage: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  centerText?: string;
  centerValue?: string;
}

const { width } = Dimensions.get('window');

export default function PieChart({ 
  data, 
  size = width * 0.8, 
  centerText = "Total",
  centerValue = ""
}: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  const radius = size / 2 - 30;
  const centerX = size / 2;
  const centerY = size / 2;
  const innerRadius = radius * 0.6; // For donut chart effect

  const createPath = (startAngle: number, endAngle: number) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    // Outer arc points
    const x1Outer = centerX + radius * Math.cos(startAngleRad);
    const y1Outer = centerY + radius * Math.sin(startAngleRad);
    const x2Outer = centerX + radius * Math.cos(endAngleRad);
    const y2Outer = centerY + radius * Math.sin(endAngleRad);
    
    // Inner arc points
    const x1Inner = centerX + innerRadius * Math.cos(endAngleRad);
    const y1Inner = centerY + innerRadius * Math.sin(endAngleRad);
    const x2Inner = centerX + innerRadius * Math.cos(startAngleRad);
    const y2Inner = centerY + innerRadius * Math.sin(startAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `
      M ${x1Outer} ${y1Outer} 
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}
      L ${x1Inner} ${y1Inner}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x2Inner} ${y2Inner}
      Z
    `;
  };

  let currentAngle = 0;
  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          <G>
            {data.map((item, index) => {
              const sliceAngle = (item.percentage / 100) * 360;
              
              // Skip very small slices
              if (item.percentage < 1) {
                return null;
              }
              
              const path = createPath(currentAngle, currentAngle + sliceAngle);
              currentAngle += sliceAngle;
              
              return (
                <Path
                  key={`slice-${index}`}
                  d={path}
                  fill={item.color}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              );
            })}
          </G>
        </Svg>
        
        {/* Center content */}
        <View style={[styles.centerContent, {
          width: innerRadius * 1.8,
          height: innerRadius * 1.8,
          borderRadius: innerRadius * 0.9,
          top: centerY - innerRadius * 0.9,
          left: centerX - innerRadius * 0.9,
        }]}>
          <Text style={styles.centerText}>{centerText}</Text>
          <Text style={styles.centerValue}>{centerValue || `₹${total.toLocaleString()}`}</Text>
        </View>
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        {data
          .filter(item => item.percentage >= 1)
          .map((item, index) => (
            <View key={`legend-${index}`} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <View style={styles.legendTextContainer}>
                <Text style={styles.legendCategory}>{item.category}</Text>
                <Text style={styles.legendAmount}>₹{item.total.toLocaleString()}</Text>
              </View>
              <Text style={styles.legendPercentage}>{item.percentage}%</Text>
            </View>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  centerContent: {
    position: 'absolute',
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  centerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 4,
  },
  centerValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  legend: {
    width: '100%',
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  legendTextContainer: {
    flex: 1,
  },
  legendCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  legendAmount: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  legendPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    minWidth: 45,
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
});
