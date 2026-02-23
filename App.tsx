import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useElectricityPrice } from './hooks/useElectricityPrice';
import PriceChart from './components/Pricechart';
import SaunaTimer from './components/SaunaTimer';
import { colors } from './colors';

// Filter function, returns "2026-02-23T10:00:00.000Z" to plain time like "00:00"
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fi-FI', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Helsinki', //Show UTC +2
  });
}

export default function App() {
  const { prices, currentPrice, loading, error } = useElectricityPrice();

  if (loading) return (
    <View style={styles.root}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
  if (error) return (
    <View style={styles.root}>
      <Text style={styles.text}>Error: {error}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>

      {/* Current price */}
      <Text style={styles.title}>Current price</Text>
      <Text style={styles.currentPrice}>{currentPrice} c/kWh</Text>

      {/* Chart */}
      <Text style={styles.title}>Today's price chart</Text>
      <PriceChart prices={prices} />

      {/* Sauna timer */}
      <SaunaTimer prices={prices} />

      {/* List of all today's prices */}
      <Text style={styles.title}>Today's prices</Text>
      {prices.slice().reverse().map((entry, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.text}>{formatTime(entry.startDate)}</Text>
          <Text style={styles.text}>{entry.price} c/kWh</Text>
        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.base,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    marginTop: 24,
  },
  currentPrice: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.yellow,
  },
  text: {
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.overlay,
  },
});