import { useState, useEffect } from 'react';

const API_URL = 'https://api.porssisahko.net/v2/latest-prices.json';

export function useElectricityPrice() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);

  /*API returns JSON in form of

  "prices": [
    {
      "price": 12.273,
      "startDate": "2026-02-23T22:45:00.000Z",
      "endDate": "2026-02-23T22:59:59.999Z"
    }

API returns last three (3) days of data and I need to filter out only todays prices
*/


useEffect(() => {
    // Get today's date in Finnish timezone, "2026-02-23"
    const today = new Date().toLocaleDateString('fi-FI', {
      timeZone: 'Europe/Helsinki',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).split('.').reverse().join('-'); // converts "23.2.2026" → "2026-02-23"

    console.log('Today is:', today); //Check that today is displayed correctly

    fetch(API_URL)
      .then((response) => response.json())
      .then((json) => {
       // Convert each data point startDate to Finnish time before comparing
        const todaysPrices = json.prices.filter((entry) => {
          const finnishDate = new Date(entry.startDate).toLocaleDateString('fi-FI', {
            timeZone: 'Europe/Helsinki',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }).split('.').reverse().join('-');
          return finnishDate === today;
        });

        //Define the current time
        const now = new Date();
        const current = todaysPrices.find((entry) =>
          new Date(entry.startDate) <= now && new Date(entry.endDate) >= now //Find price that matches current time
        );

        //Just check that only prices of today are fetched/filtered
        console.log('Todays prices:', JSON.stringify(todaysPrices, null, 2));
        console.log('Current price entry:', JSON.stringify(current, null, 2));

        setPrices(todaysPrices);
        setCurrentPrice(current ? current.price : null);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('ERROR: ' + err.message);
        setError(err.message);
        setLoading(false);
      });
  }, []);

    return { prices, currentPrice, loading, error };
}