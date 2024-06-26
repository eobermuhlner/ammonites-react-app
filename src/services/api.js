import axios from 'axios';
import config from '../config.js';

const client = axios.create({
  baseURL: config.api.baseURL,
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

export const loginUser = (username, password) => {
    return axios.create({
        baseURL: config.api.baseURL,
        headers: {
            'Content-Type': 'application/json',
        }
        }).post('/login', {
            username,
            password
        })
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
};

export const fetchUserRoles = () => {
    return client.get('/users/roles')
        .then(response => response.data)
        .catch(error => {
            return [];
        });
};

export const fetchCurrentUser = () => {
    return client.get('/users/me')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching current user:', error);
            throw error;
        });
};

export const updateCurrentUser = (user) => {
    return client.put('/users/me', JSON.stringify(user), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Failed to update current user:', error);
            throw error;
        });
};

export const changeCurrentUserPassword = (password) => {
    return client.put(`/users/me/password`, JSON.stringify({ password: password }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error(`Failed to change password for current user:`, error);
            throw error;
        });
};

export const fetchAllAmmonites = () => {
  return client.get('/ammonites')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching all ammonites:', error);
      throw error;
    });
};

export const fetchTaxonomyOptions = (level, parent = null) => {
    const params = parent ? { parent } : {};
    return client.get(`/ammonites/taxonomy/${level}`, { params })
        .then(response => response.data)
        .catch(error => {
            console.error(`Error fetching taxonomy ${level} options:`, error);
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

export const fetchBrowseAmmonites = (filters) => {
    return client.get('/ammonites/browse', { params: filters })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching ammonites:', error);
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

export const postImportFile = (formData) => {
    return client.post('/import/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error importing file:', error);
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

export const fetchAllUsers = () => {
    return client.get('/users')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching all users:', error);
            throw error;
        });
};

export const fetchUserById = (id) => {
    return client.get(`/users/${id}`)
        .then(response => response.data)
        .catch(error => {
            console.error(`Error fetching user with id ${id}:`, error);
            throw error;
        });
};

export const createUser = (user) => {
    return client.post('/users', JSON.stringify(user), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error creating user:', error);
            throw error;
        });
};

export const createUserSelfOnboarding = (user) => {
    return client.post('/users/new', JSON.stringify(user), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error creating user:', error);
            throw error;
        });
};

export const updateUserById = (id, user) => {
    return client.put(`/users/${id}`, JSON.stringify(user), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error(`Failed to update user with id ${id}:`, error);
            throw error;
        });
};

export const changeUserPassword = (id, password) => {
    return client.put(`/users/${id}/password`, JSON.stringify({ password: password }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error(`Failed to change password for user with id ${id}:`, error);
            throw error;
        });
};

export const deleteUserById = (id) => {
    return client.delete(`/users/${id}`)
        .then(response => {
            if (response.status === 204) {
                return;
            }
            throw new Error('Network response was not ok.');
        })
        .catch(error => {
            console.error(`Failed to delete user with id ${id}:`, error);
            throw error;
        });
};

export const createDefaultUser = () => {
    return client.post('/users/default')
        .then(response => response.data)
        .catch(error => {
            console.error('Error creating default user:', error);
            throw error;
        });
};

export const addUserRole = (userId, roleName) => {
    return client.post(`/users/${userId}/roles`, JSON.stringify(roleName), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.data)
        .catch(error => {
            console.error(`Failed to add role ${roleName} to user with id ${userId}:`, error);
            throw error;
        });
};

export const removeUserRole = (userId, roleName) => {
    return client.delete(`/users/${userId}/roles`, {
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(roleName)
    })
        .then(response => response.data)
        .catch(error => {
            console.error(`Failed to remove role ${roleName} from user with id ${userId}:`, error);
            throw error;
        });
};

export const fetchAllRoles = () => {
    return client.get('/roles')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching all roles:', error);
            throw error;
        });
};

export const extractErrorMessage = (error) => {
    let errorMessage = '';

    if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
    } else if (error.message) {
        errorMessage = error.message;
    }

    return errorMessage;
}