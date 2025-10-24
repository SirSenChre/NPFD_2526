const input = document.querySelector('input');
const button = document.querySelector('button');
const errorMsg = document.querySelector('p.error_msg');
const cityName = document.querySelector('h2.city_name');
const temp = document.querySelector('p.temp');
const weatherImg = document.querySelector('img.weather_img');
const weatherDesc = document.querySelector('p.weather_description');
const humidity = document.querySelector('span.humidity');
const windSpeed = document.querySelector('span.wind_speed');
const pressure = document.querySelector('span.pressure');
const visibility = document.querySelector('span.visibility');
const clouds = document.querySelector('span.clouds');
const feelsLike = document.querySelector('span.feels_like');
const pollutionImg = document.querySelector('img.pollution_img');
const pollutionValue = document.querySelector('span.pollution_value');


const APIinfo = {
    link : 'https://api.openweathermap.org/data/2.5/weather?q=',
    key : '&appid=b47d57280ed16cf2540a9ec6fac36f66',
    units : '&units=metric',
    lang : '&lang=pl'
};


function getWeather() { 
    APIcity = input.value;
    apiURL = `${APIinfo.link}${APIcity}${APIinfo.key}${APIinfo.units}${APIinfo.lang}`;
    console.log(apiURL);

    axios.get(apiURL).then((response) => {
        // console.log(response.data);

        cityName.textContent = `${response.data.name}, ${response.data.sys.country}`;
        temp.textContent = `${Math.round(response.data.main.temp)}°C`;
        weatherDesc.textContent = response.data.weather[0].description;
        feelsLike.textContent = `${Math.round(response.data.main.feels_like)}°C`;
        humidity.textContent = `${response.data.main.humidity}%`;
        windSpeed.textContent = `${Math.round(response.data.wind.speed*3.6)} km/h`;
        pressure.textContent = `${response.data.main.pressure} hPa`;
        visibility.textContent = `${(response.data.visibility/1000).toFixed(1)} km`;
        clouds.textContent = `${response.data.clouds.all}%`;
        weatherImg.src = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
        //kod czyszczacy paragraf z bledem
        errorMsg.textContent = '';

        //http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat={lat}&lon={lon}&appid={API key}

        apiURLpollution = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}${APIinfo.key}`;

        axios.get(apiURLpollution).then((res) => {
            // console.log(res);
            pollutionValue.textContent = `${res.data.list[0].components.pm2_5}`;

            const pm25 = res.data.list[0].components.pm2_5;

            let color = '';
            if (pm25 < 10) {
                pollutionImg.style.backgroundColor = '#51b728ff';
            }
            else if (pm25 >= 10 && pm25 < 25) {
                pollutionImg.style.backgroundColor = '#95dc19ff';
            }
            else if (pm25 >= 25 && pm25 < 50) {
                pollutionImg.style.backgroundColor = '#f5ee17ff';
            }
            else if (pm25 >= 50 && pm25 < 75) {
                pollutionImg.style.backgroundColor = '#da960dff';
            }
            else {
                pollutionImg.style.backgroundColor = '#da0d0dff';
            }
            // pollutionImg.style.backgroundColor = color;
        })
        

    }).catch((error) => {
        // console.log(error.response.data);
        errorMsg.textContent = `${error.response.data.message}`;
        // kod czyszczacy wszystkie pola, kore zawieraja informacje z poprzedniego zapytania
        const elementsToClear = [
            cityName, temp, weatherDesc, feelsLike,
            humidity, windSpeed, pressure, visibility, clouds, pollutionValue
        ];

        pollutionImg.style.backgroundColor = 'transparent';

        elementsToClear.forEach(el => el.textContent = '');

        weatherImg.src = '';
    }).finally(() => {
        input.value = '';
    })
}


function getWeatherByEnter(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
}

button.addEventListener('click', getWeather);
input.addEventListener('keypress', getWeatherByEnter);