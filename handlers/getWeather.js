const superagent = require('superagent');

function getWeather(request, response) {
  const weatherQuery = request.query.weatherSearch;
  const url = 'https://api.weatherbit.io/v2.0/current';
  const query = {
    cityName: request.query.cityName,
    key: process.env.WEATHERBIT_API_KEY,
    lat: request.query.lat,
    lon: request.query.lon,
  }
  superagent
    .get(url)
    .query(query)
    .then(weatherData => {
      response.json(weatherData.body.data.map(day => (
        new Forecast(day))));
    });
};

function Forecast(day) {
  this.date = day.datetime;
  this.description = day.weather.description;
  this.clouds = day.clouds;
  this.temp = day.temp;
  this.directionString = day.wind_cdir_full;
  this.directionDegree = day.wind_dir
}

module.exports = getWeather;
