import React, { useEffect, useState } from 'react'
import './Weather.css'
import search_icon from '/images/search.png'
import clear_icon from '/images/clear.png'
import cloud_icon from '/images/clouds.png'
import drizzle_icon from '/images/drizzle.png'
import rain_icon from '/images/rain.png'
import snow_icon from '/images/snow.png'
import humidity_icon from '/images/humidity.png'
import wind_icon from '/images/wind.png'

const Weather = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    //const API_KEY = import.meta.env.VITE_APP_KEY
    const API_KEY = '16efa6b827076ba4f5dbbe54794fca6a'
    // console.log('API_KEY at init:', API_KEY); // Logging API_KEY once is enough

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": drizzle_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    }

    const search = async (currentCity) => {
        if (!currentCity) {
            console.log("Search input is empty. Aborting search.");
            setWeatherData(null); // Clear weather data if input is empty
            return; 
        }
        console.log(`Attempting to search for city: "${currentCity}" with API Key: ${API_KEY}`);
        try{
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&units=metric&appid=${API_KEY}`
            const response = await fetch(url);
            const data = await response.json();
            console.log("API Response Data:", data);

            if (response.ok && data.cod === 200) { // Check data.cod for success from OpenWeatherMap
                const icon = allIcons[data.weather[0].icon] || clear_icon;
                setWeatherData({
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    temperature: Math.floor(data.main.temp),
                    location: data.name,
                    icon: icon,
                });
            } else {
                const errorMessage = data.message || response.statusText || "Unknown API error";
                console.error(`API Error for city "${currentCity}": ${errorMessage}`);
                setWeatherData(null); 
                alert(`Error fetching weather for "${currentCity}": ${errorMessage}`);
            }
        }
        catch(error){
            console.error('Network or other error fetching weather data:', error);
            setWeatherData(null); 
            alert('Failed to fetch weather data. Please check your internet connection or the city name.');
        }
    }

    useEffect(() => {
        setCity("London"); // Set city state for initial load consistency
        search('London'); 
    },[])

    const handleSearch = () => {
        console.log(`Search button clicked. Current city state: "${city}"`);
        search(city);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            console.log(`Enter key pressed. Current city state: "${city}"`);
            search(city);
        }
    }

    return (
        <div className='weather'>
           <div className="search-bar">
            <input 
              type="text" 
              placeholder='Search for a city...' // More descriptive placeholder
              value={city} 
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown} // Use defined handler
            />
            <img 
              src={search_icon} 
              alt="Search" 
              onClick={handleSearch} // Use defined handler
            />
           </div>

           {weatherData ? (
            <>
              <img src={weatherData.icon} alt='Weather condition' className='weather-icon'/>
              <p className='temperature'>{weatherData.temperature}°c</p>
              <p className='location'>{weatherData.location}</p>
              <div className="weatherData">
                <div className="col">
                    <img src={humidity_icon} alt='Humidity icon'/>     
                    <div>
                        <p>{weatherData.humidity}%</p>
                        <span>Humidity</span>
                    </div>
                </div>
                <div className="col">
                    <img src={wind_icon} alt='Wind icon' />
                    <div>
                        <p>{weatherData.windSpeed} Km/h</p>
                        <span>Wind Speed</span>
                    </div>
                </div>
              </div>
            </>
           ) : (
            <p>Enter a city name to see the weather, or check console for errors.</p> 
           )}
        </div>
    )
}

export default Weather;