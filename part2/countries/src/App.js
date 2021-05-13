import React, { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all')
      .then(
        response => setCountries(response.data),
        reason => console.log("Couldn't get from https://restcountries.eu/rest/v2/all,", reason)
      )
  }, [])

  /** nameContainsFilter takes in country data and returns if it contains filter (case-insensitive) */
  const nameContainsFilter = (country) => country.name.toLowerCase().includes(filter.toLowerCase())

  return (
    <div>
      <Filterer filter={filter} setFilter={setFilter} />
      <Display countries={countries.filter(country => nameContainsFilter(country))} />
    </div>
  );
}

const Filterer = ({ filter, setFilter }) => {
  return (
    <div>
      find countries
      <input value={filter} onChange={e => setFilter(e.target.value)} />
    </div>
  )
}

/**
 * Display displays a list of already filtered countries.
 * 
 * @param {{countries: any[]}}
 */
const Display = ({ countries }) => {
  if (countries.length > 10) {
    return (<div>Too many matches, specify another filter</div>)
  }

  if (countries.length === 1) {
    return <DisplaySingle country={countries[0]} />
  }

  return (
    <div>
      {countries.map(country => <DisplayItem key={country.alpha2Code} country={country} />)}
    </div>
  )
}

const DisplaySingle = ({ country }) => {
  return (
    <div>
      <h1>{country.name} ({country.nativeName})</h1>
      <BasicInfo country={country} />
      <Languages languages={country.languages} />
      <Flag country={country} />
      <Weather city={country.capital} />
    </div>
  )
}

/**
 * DisplayItem displays an item in the Display component
 * with a show/hide button
 */
const DisplayItem = ({ country }) => {
  const [show, setShow] = useState(false)

  return (
    <div>
      {country.name}
      <button onClick={() => setShow(!show)}>
        {show ? 'hide' : 'show'}
      </button>
      {show ? <DisplaySingle country={country} /> : <></>}
    </div>
  )
}

/** BasicInfo displays basic info of a country  */
const BasicInfo = ({ country }) => (
  <div>
    <div>capital {country.capital}</div>
    <div>population {country.population}</div>
  </div>
)

/** Languages displays the languages of a country */
const Languages = ({ languages }) => (
  <div>
    <h2>languages</h2>
    <ul>
      {languages.map(lang => <li key={lang.iso639_1}>{lang.name} ({lang.nativeName})</li>)}
    </ul>
  </div>
)

/** Flag displays a country's flag */
const Flag = ({ country }) => (
  <div>
    <img src={country.flag} alt={`Flag of ${country.name}`} width='200px' />
  </div>
)

/** Weather displays a city's weather */
const Weather = ({ city }) => {
  const [output, setOutput] = useState(<div>Fetching data for {city}...</div>)
  const API_KEY = process.env.REACT_APP_API_KEY // for weatherstack

  const parseWeatherData = (weatherData) => (
    <div>
      <h2>Weather in {city}</h2>
      <div>
        <img src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt={weatherData.weather[0].description} />
        {weatherData.weather[0].description}
      </div>
      <div>
        <strong>temperature:</strong> {weatherData.main.temp} °C
        (feels like {weatherData.main.feels_like} °C)</div>
      <div>
        <strong>wind:</strong> {weatherData.wind.speed} km/h direction {weatherData.wind.deg}°
      </div>
    </div>
  )

  useEffect(() => {
    const params = new URLSearchParams({
      'q': city,
      'appid': API_KEY,
      'units': 'metric'
    })
    axios.get('https://api.openweathermap.org/data/2.5/weather?' + params.toString())
      .then(
        response => setOutput(parseWeatherData(response.data)),
        reason => {
          console.log(`Couldn't get weather data from ${city}`, reason)
          setOutput(<div>Could not get weather data for {city}</div>)
        }
      )
  }, [city, API_KEY])

  return output
}

export default App;
