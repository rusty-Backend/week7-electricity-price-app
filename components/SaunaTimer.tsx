
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../colors';

export default function SaunaTimer({ prices }) {
  if (!prices || prices.length < 12) return null;

  // Sort prices by startDate ascending (00:00 first, 23:45 last)
  const sorted = prices.slice().sort((a, b) =>
    new Date(a.startDate) - new Date(b.startDate)
  );

  // Slide a 12-slot (3 hour) window through all prices and find the cheapest window
  let lowestTotal = Infinity; //Set impossible price as a initial, any given average price is smaller than this
  let bestStart = 0; //Stores the index which was starting index for the best price

  
  for (let i = 0; i <= sorted.length - 12; i++) { //Go through all the price points from 0 to 84 (+12 = 96 / 4 = 24)
    let total = 0; //Our initial price
    for (let j = i; j < i + 12; j++) { //Go through the price points from i to i + 12 aka next 3 hours
      total += sorted[j].price; //Sum up the 12 price points
    }
    if (total < lowestTotal) { //Compare
      lowestTotal = total; //Set if lowest
      bestStart = i; //Save the i for lowest starting index
    }
  }

//Define the start and end values for optimal sauna time
  const avgPrice = (lowestTotal / 12).toFixed(2);
  const startTime = new Date(sorted[bestStart].startDate).toLocaleTimeString('fi-FI', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Helsinki',
  });
  const endTime = new Date(sorted[bestStart + 11].endDate).toLocaleTimeString('fi-FI', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Helsinki',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}> Optimal Sauna Time</Text>
      <Text style={styles.window}>{startTime} – {endTime}</Text>
      <Text style={styles.avg}>avg. {avgPrice} c/kWh</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.overlay,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  label: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: 6,
  },
  window: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  avg: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: 4,
  },
});