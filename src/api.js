import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Your Spring Boot API URL

const client = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchAllAmmonites = async () => {
  try {
    const response = await client.get('/ammonites');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
