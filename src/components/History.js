import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { correctFormat } from './helperFunctions/sortForecast'
import { getSunriseTimeFromWeather, getSunsetTimeFromWeather, getMoonriseMoonsetTimeFromWeather } from './helperFunctions/getTime'
import { errorHandler } from './helperFunctions/errorHandling'

const History = () => {
  const [formData, setFormData] = useState('')
  const [formDateData, setFormDateData] = useState('')
  const [formSubmit, setFormSubmit] = useState({
    location: '',
    date: '',
  })
  const [weather, setWeather] = useState('')
  const [displayExtra, setDisplayExtra] = useState(false)

  const handleChange = (event) => {
    setFormData(event.target.value)
  }
  const handleDateChange = (event) => {
    setFormDateData(event.target.value)
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    const newFormSubmit = { ...formSubmit, location: formData, date: formDateData }
    setFormSubmit(newFormSubmit)
  }

  const resetForm = () => {
    setWeather('')
  }

  const toggleDisplay = () => {
    setDisplayExtra(!displayExtra)
  }
  const displayShowHide = displayExtra ? 'Expand' : 'Condense'


  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`https://api.weatherapi.com/v1/history.json?key=bc3268a2d36f4676922230553211606&q=${formSubmit.location}&dt=${formSubmit.date}`)
        setWeather(data)
      } catch (err) {
        errorHandler(err)
      }
    }
    getData()
  }, [formSubmit])


  console.log(weather)

  return (
    <>
      {!weather ?
        <div className="main-container">
          <form
            onSubmit={handleSubmit}
            className="inline-block home-form">
            <div>
              <span className="inline-block main-text"> What was the weather like in...</span>
              <input
                onChange={handleChange}
                className="home-input click"
                placeholder=""
                name="location"
                autoComplete="off" />
            </div>
            <div>
              <span className="inline-block main-text"> on the date...</span>
              <input
                onChange={handleDateChange}
                className="number-input main-text click"
                type="date"
                name="number" />
              <span className="inline-block main-text">?</span>
            </div>

            <div>
              <input
                type="submit"
                style={{ position: 'absolute', left: '-9999px' }}
              />
            </div>
          </form>
          <span className="main-options-text block">(API limited to last 7 days)</span>
        </div >
        :
        <>
          <div className="display-flex-row">
            <div className="main-container">
              <span className="main-display-text">The weather in {weather.location.name} on the {correctFormat(weather.forecast.forecastday[0].date)} was {weather.forecast.forecastday[0].day.condition.text.toLowerCase()} </span>
              <span id="display-show-hide" className="main-options-text block click" onClick={toggleDisplay}>{displayShowHide}</span>
              <span className="main-options-text block click" onClick={resetForm}>New search</span>
            </div>
            {!displayExtra ?
              <>
                <div id="display-show" className="history-display-flex">
                  <div className="display-show-child">
                    <div><span className="show-info-text"><span>Average Temperature:</span><span>{weather.forecast.forecastday[0].day.avgtemp_c} &#8451;</span></span></div>
                    <div><span className="show-info-text"><span>Max Temperature:</span><span>{weather.forecast.forecastday[0].day.maxtemp_c} &#8451;</span></span></div>
                    <div><span className="show-info-text"><span>Min Temperature:</span><span>{weather.forecast.forecastday[0].day.mintemp_c} &#8451;</span></span></div>
                    <div><span className="show-info-text"><span>Total Rainfall:</span><span>{weather.forecast.forecastday[0].day.totalprecip_mm} mm</span></span></div>
                    <div><span className="show-info-text"><span>Average Humidity:</span><span>{weather.forecast.forecastday[0].day.avghumidity} g/kg</span></span></div>
                  </div>
                  <div className="display-show-child">
                    <div><span className="show-info-text"><span>Sunrise:</span><span>{getSunriseTimeFromWeather(weather.forecast.forecastday[0].astro.sunrise)} </span></span></div>
                    <div><span className="show-info-text"><span>Sunset:</span><span>{getSunsetTimeFromWeather(weather.forecast.forecastday[0].astro.sunset)}</span></span></div>
                    <div><span className="show-info-text"><span>Moonrise:</span><span>{getMoonriseMoonsetTimeFromWeather(weather.forecast.forecastday[0].astro.moonrise)}</span></span></div>
                    <div><span className="show-info-text"><span>Moonset:</span><span>{getMoonriseMoonsetTimeFromWeather(weather.forecast.forecastday[0].astro.moonset)}</span></span></div>
                    <div><span className="show-info-text"><span>Moonphase:</span><span>{weather.forecast.forecastday[0].astro.moon_phase}</span></span></div>
                  </div>
                </div>
              </>
              :
              <>
              </>
            }
          </div>
        </>
      }
    </>
  )
}

export default History