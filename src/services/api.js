import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

client.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export const fetchAllAmmonites = () => {
  return client.get('/ammonites')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching all ammonites:', error);
      throw error;
    });
};

export const fetchAmmoniteById = (id) => {
  return client.get(`/ammonites/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error(`Error fetching ammonite with id ${id}:`, error);
      throw error;
    });
};

export const fetchMatchingAmmonites = (filters) => {
  return client.get('/ammonites/matching', { params: filters })
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching matching ammonites:', error);
      throw error;
    });
};

export const updateAmmoniteById = (id, editAmmonite) => {
  return client.put(`/ammonites/${id}`, JSON.stringify(editAmmonite), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.status === 200) {
        return response.data;
      }
      throw new Error('Network response was not ok.');
    })
    .catch(error => {
      console.error(`Failed to update ammonite with id ${id}:`, error);
      throw error;
    });
};

export const postImportAmmonites = (formData) => {
  return client.post('/import/ammonites', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error importing ammonites:', error);
      throw error;
    });
};

export const postImportAmmoniteMeasurements = (formData) => {
  return client.post('/import/ammonite/measurements', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error importing ammonite measurements:', error);
      throw error;
    });
};

export const fetchImageById = (id) => {
    return client.get(`/images/${id}`, { responseType: 'blob' })
        .then(response => response.data)
        .catch(error => {
            console.error(`Error fetching image with id ${id}:`, error);
            throw error;
        });
};

export const uploadImage = (formData) => {
    return client.post('/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error uploading image:', error);
            throw error;
        });
};