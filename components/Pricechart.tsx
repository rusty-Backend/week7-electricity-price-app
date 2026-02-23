import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { colors } from '../colors';

const chartWidth = Dimensions.get('window').width - 80;

export default function PriceChart({ prices }) {
  if (!prices || prices.length === 0) return null;

  // Average the 15-min slots into hourly data points (96 → 24)
  const hourlyData = [];
  for (let hour = 0; hour < 24; hour++) {
    const slicesForHour = prices.filter((entry) => {
      const entryHour = new Date(entry.startDate).toLocaleString('fi-FI', {
        hour: 'numeric',
        timeZone: 'Europe/Helsinki',
      });
      return parseInt(entryHour) === hour;
    });

    if (slicesForHour.length > 0) {
      const avg = slicesForHour.reduce((sum, e) => sum + e.price, 0) / slicesForHour.length;
      hourlyData.push({
        value: parseFloat(avg.toFixed(2)),
        label: `${String(hour).padStart(2, '0')}`,
      });
    }
  }

  return (
    <View style={{ overflow: 'hidden', borderRadius: 8, backgroundColor: colors.surface }}>
      <LineChart
        data={hourlyData}
        width={chartWidth}
        height={200}
        color={colors.yellow}
        thickness={2}
        hideDataPoints={true}
        areaChart
        startFillColor={colors.yellow}
        startOpacity={0.3}
        endOpacity={0.0}
        noOfSections={5}
        backgroundColor={colors.surface}
        yAxisColor={colors.overlay}
        xAxisColor={colors.overlay}
        yAxisTextStyle={{ color: colors.subtext, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: colors.subtext, fontSize: 9 }}
        rulesColor={colors.overlay}
        rotateLabel
        spacing={chartWidth / 26}
        scrollToEnd={false}
        disableScroll={true}
      />
    </View>
  );
}