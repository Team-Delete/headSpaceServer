const superagent = require('superagent');

function getWeather(request, response) {
  const weatherQuery = request.query.weatherSearch;
  console.log(weatherQuery);
  const url = 'https://api.weatherbit.io/v2.0/current';
  const query = {
    // cityName: request.query.cityName,
    // this ALSO needs to be in the .env requirements in your README
    key: process.env.WEATHERBIT_API_KEY,
    lat: request.query.lat,
    lon: request.query.lon,
  };
  superagent
    .get(url)
    .query(query)
    .then(weatherData => {
      response.json(weatherData.body.data.map(day => (
        new Forecast(day))));
    });
}

// https://medium.com/@DylanAttal/convert-celsius-to-fahrenheit-in-javascript-b6b76b47c4f0#:~:text=Luckily%20for%20us%2C%20the%20good,9%2F5%20then%20add%2032.
// the weatherbit API lets you request using different measurements; this is unnecessary.
function convertToF(celsius) {
  let fahrenheit = celsius * 9/5 + 32;
  return fahrenheit;
}

function Forecast(day) {
  this.date = day.datetime;
  this.description = day.weather.description;
  this.clouds = `${day.clouds} clouds`;
  this.temp = `${convertToF(day.temp)}°F`;
  this.directionString = day.wind_cdir_full;
  this.directionDegree = day.wind_dir;
}

module.exports = getWeather;
