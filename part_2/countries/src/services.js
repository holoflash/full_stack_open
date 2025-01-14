import axios from 'axios'

const getAllCountries = async () => {
    const response = await axios
        .get('https://studies.cs.helsinki.fi/restcountries/api/all/')
    return response.data
}

const getWeather = async (lat, long) => {
    const response = await axios
        .get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`)
    return response.data.current_weather

}

export default { getAllCountries, getWeather }