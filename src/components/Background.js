import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { getTimeFromWeather } from './helperFunctions/getTime'
import { getSunriseTimeFromWeather } from './helperFunctions/getTime'
import { getSunsetTimeFromWeather } from './helperFunctions/getTime'

import { getCloudCoverage } from './helperFunctions/getWeather'
import { getRainLevel } from './helperFunctions/getWeather'
import { willItSnow } from './helperFunctions/getWeather'

import { sunUpSunDown } from './helperFunctions/chooseBackground'
import { chooseBackground } from './helperFunctions/chooseBackground'

const Background = () => {
  const [weather, setWeather] = useState('')

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('https://api.weatherapi.com/v1/forecast.json?key=bc3268a2d36f4676922230553211606&q=London&days=1&aqi=yes&alerts=no')
        setWeather(data)
      } catch (err) {
        console.log('NO DATA')
      }
    }
    getData()
  }, [])

  if (!weather) return null
  const time = getTimeFromWeather(weather.location.localtime)
  const sunrise = getSunriseTimeFromWeather(weather.forecast.forecastday[0].astro.sunrise)
  const sunset = getSunsetTimeFromWeather(weather.forecast.forecastday[0].astro.sunset)
  const timeOfDay = sunUpSunDown(time, sunrise, sunset)
  const clouds = getCloudCoverage(weather.current.cloud)
  const rain = getRainLevel(weather.current.precip_mm)
  const snow = willItSnow(weather.forecast.forecastday[0].day.daily_will_it_snow)

  console.log(weather.location.localtime)
  console.log(time)
  console.log(sunrise)
  console.log(sunset)
  console.log(timeOfDay)
  console.log(clouds)
  console.log(rain)
  console.log(snow)
  console.log(chooseBackground(timeOfDay, clouds, rain, snow))

  return (
    <div id="screen"
      style={{
        backgroundImage: `url(${chooseBackground(timeOfDay, clouds, rain, snow)})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    />

  )
}

export default Background