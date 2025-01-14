import { useState, useEffect } from 'react'
import services from './services';

const WMO_CODES = {
  0: '01d',
  1: '02d',
  2: '03d',
  3: '04d',

  45: '50d',
  48: '50d',

  51: '09d',
  53: '09d',
  55: '09d',

  80: '09d',
  81: '09d',
  82: '09d',

  61: '10d',
  63: '10d',
  65: '10d',

  56: '13d',
  57: '13d',

  66: '13d',
  67: '13d',

  71: '13d',
  73: '13d',
  75: '13d',

  77: '13d',

  85: '13d',
  86: '13d',

  95: '11d',

  96: '11d',
  99: '11d'
};

const Temperature = ({ weather }) => {
  if (!weather) {
    return <div>Loading weather...</div>;
  }

  return (
    <div>
      {weather.weatherIconUrl && (
        <div>
          <img src={weather.weatherIconUrl} alt="Weather Icon" />
        </div>
      )}
      <div>Temperature: {weather.temperature}°C</div>
      <div>Wind Speed: {weather.windspeed} km/h</div>
    </div>
  );
};

function App() {
  const [countrySearch, setCountrySearch] = useState('')
  const [allCountries, setAllCountries] = useState(null)
  const [info, setInfo] = useState([])
  const [showMoreInfo, setShowMoreInfo] = useState({});
  const [message, setMessage] = useState('')
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    if (!allCountries) {
      services
        .getAllCountries()
        .then(countries => {
          setAllCountries(countries)
        })
    }
  }, [])

  useEffect(() => {
    info.forEach(country => {
      if (showMoreInfo[country.ccn3] && !weatherData[country.ccn3]) {
        services
          .getWeather(country.latlng[0], country.latlng[1])
          .then(currentWeather => {
            const weather = currentWeather;
            const weatherIconUrl = `https://openweathermap.org/img/wn/${WMO_CODES[weather.weathercode]}.png`;

            setWeatherData(prevState => ({
              ...prevState,
              [country.ccn3]: {
                ...weather,
                weatherIconUrl,
              },
            }));
          })
          .catch(error => {
            console.error("Error fetching weather data:", error);
          });
      }
    });
  }, [showMoreInfo, weatherData]);


  useEffect(() => {
    const trimmedSearch = countrySearch.trim();

    if (trimmedSearch.length === 0) {
      setInfo([]);
      setMessage('');
      setShowMoreInfo(false);
      return;
    }

    const filteredCountries = allCountries.filter(country =>
      country.name.common.toLowerCase().startsWith(trimmedSearch.toLowerCase())
    );

    if (filteredCountries.length > 10) {
      setMessage('Too many matches! Please specify your query');
      setInfo([]);
      setShowMoreInfo(false);
    } else {
      setInfo(filteredCountries);
      setShowMoreInfo(filteredCountries.length === 1);
      setMessage('');
    }
  }, [countrySearch]);

  const handleCountrySearch = (event) => {
    setCountrySearch(event.target.value)
  }

  const handleShowMoreInfo = (ccn3) => {
    setShowMoreInfo(prevState => ({
      ...prevState,
      [ccn3]: !prevState[ccn3],
    }));
  };

  return (
    <>
      <div>Find countries: <input value={countrySearch} onChange={handleCountrySearch} required /></div>
      <div>{message}</div>

      {info.map(country => (
        <div key={country.ccn3}>
          <div>
            <span>{country.name.common} </span>
            <button onClick={() => handleShowMoreInfo(country.ccn3)}>
              {showMoreInfo[country.ccn3] ? 'Less info' : 'More info'}
            </button>
          </div>

          {showMoreInfo[country.ccn3] && (
            <>
              <h1>{country.name.common}</h1>
              <div>Capital: {country.capital?.[0]}</div>
              <div>Area: {country?.area}</div>
              <h2>Languages</h2>
              <ul>
                {Object.entries(country?.languages).map(([key, language]) => (
                  <li key={key}>{language}</li>
                ))}
              </ul>
              {country.flags.svg ? (
                <img alt={country.flags.alt} src={country.flags.svg} height='100px' />

              ) : <div>"Loading flag"</div>}
              <h1>Temperature</h1>
              <Temperature weather={weatherData[country.ccn3]} />
            </>
          )}
        </div>
      ))}
    </>
  )
}

export default App
