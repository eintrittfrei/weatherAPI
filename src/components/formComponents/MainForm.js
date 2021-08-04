import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react-router-dom'

const MainForm = () => {
  const [formData, setFormData] = useState('')
  const [formSubmit, setFormSubmit] = useState('')
  const [weather, setWeather] = useState('')
  const [displayExtra, setDisplayExtra] = useState(false)

  const handleChange = (event) => {
    console.log(event.target.value)
    const newFormData = event.target.value
    setFormData(newFormData)
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
        console.log(err)
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
            className="inline-block home-form">
            <input
              onChange={handleChange}
              className="home-input"
              placeholder=""
              name="location"
              autoComplete="off" />
          </form>
        </div>
        :
        <>
          <div className="display-flex-row">
            <div className="main-container">
              <span className="main-text">The weather in {weather.location.name} is {weather.current.condition.text.toLowerCase()} </span>
              <span id="display-show-hide" className="main-options-text block" onClick={toggleDisplay}>{displayShowHide}</span>
              <span className="main-options-text block" onClick={resetForm}>New search</span>
            </div>
            {!displayExtra ?
              <>
                <div id="display-show" className="">
                  <div className="display-show-child">
                    <div><span className="show-info-text"><span>Temperature:</span><span>{weather.current.temp_c} &#8451;</span></span></div>
                    <div><span className="show-info-text"><span>Feels like:</span> <span>{weather.current.feelslike_c} &#8451;</span></span></div>
                    <div><span className="show-info-text"><span>Max Temperature:</span><span>{weather.forecast.forecastday[0].day.maxtemp_c} &#8451;</span></span></div>
                    <div><span className="show-info-text"><span>Min Temperature:</span><span>{weather.forecast.forecastday[0].day.mintemp_c} &#8451;</span></span></div>
                  </div>
                  <div className="display-show-child">
                    <div><span className="show-info-text"><span>Wind Speed:</span> <span>{weather.current.wind_kph} kph</span></span></div>
                    <div><span className="show-info-text"><span>Wind Direction:</span> <span>{weather.current.wind_dir}</span></span></div>
                    <div><span className="show-info-text"><span>Precipitation:</span> <span>{weather.current.precip_mm} mm</span></span></div>
                    <div><span className="show-info-text"><span>Humidity:</span> <span>{weather.current.humidity} &#37;</span></span></div>
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

export default MainForm