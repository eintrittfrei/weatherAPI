import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { getTimeFromWeather } from './helperFunctions/getTime'
import { errorHandler } from './helperFunctions/errorHandling'


const Home = () => {
  const [formData, setFormData] = useState('')
  const [formSubmit, setFormSubmit] = useState('')
  const [weather, setWeather] = useState('')
  const [displayExtra, setDisplayExtra] = useState(false)

  const handleChange = (event) => {
    console.log(event.target.value)
    setFormData(event.target.value)
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    setFormSubmit(formData)
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
        const { data } = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=bc3268a2d36f4676922230553211606&q=${formSubmit}&days=1&aqi=yes&alerts=no`)
        setWeather(data)
      } catch (err) {
        errorHandler(err)
      }
    }
    getData()
  }, [formSubmit])

  return (
    <>
      {!weather ?
        <div className="main-container">
          <span className="inline-block main-text"> What&apos;s the weather like in...</span>
          <form
            onSubmit={handleSubmit}
            className="inline-block home-form click">
            <input
              onChange={handleChange}
              className="home-input"
              placeholder=""
              name="location"
              autoComplete="off" />
          </form>
          <span className="inline-block main-text">?</span>
        </div>
        :
        <>
          <div className="display-flex-row">
            <div className="main-container">
              <span className="main-text">The weather in {weather.location.name} is {weather.current.condition.text.toLowerCase()} </span>
              <span id="display-show-hide" className="main-options-text block click" onClick={toggleDisplay}>{displayShowHide}</span>
              <span className="main-options-text block click" onClick={resetForm}>New search</span>
            </div>
            {!displayExtra ?
              <>
                <div id="display-show" className="">
                  <div className="display-show-child">
                    <div><span className="show-info-text"><span>Local Time (when loaded):</span><span>{getTimeFromWeather(weather.location.localtime)}</span></span></div>
                    <div><span className="show-info-text"><span>Temperature:</span><span>{weather.current.temp_c} &#8451;</span></span></div>
                    <div><span className="show-info-text"><span>Feels like:</span> <span>{weather.current.feelslike_c} &#8451;</span></span></div>
                  </div>
                  <div className="display-show-child">
                    <div><span className="show-info-text"><span>Wind Speed:</span> <span>{weather.current.wind_kph} kph</span></span></div>
                    <div><span className="show-info-text"><span>Wind Direction:</span> <span>{weather.current.wind_dir}</span></span></div>
                    <div><span className="show-info-text"><span>Precipitation:</span> <span>{weather.current.precip_mm} mm</span></span></div>
                    <div><span className="show-info-text"><span>Humidity:</span> <span>{weather.current.humidity} g/kg</span></span></div>
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




export default Home