import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const projectsAPI = {
  getAll: (page = 0, size = 10) => api.get(`/projects?page=${page}&size=${size}`),
  getById: (id) => api.get(`/projects/${id}`),
  create: (projectData) => api.post('/projects', projectData),
  getByClient: (page = 0, size = 10) => api.get(`/projects/client?page=${page}&size=${size}`),
  searchBySkill: (skill, page = 0, size = 10) => 
    api.get(`/projects/search/skill?skill=${skill}&page=${page}&size=${size}`),
  searchBySkills: (skills, page = 0, size = 10) => 
    api.get(`/projects/search/skills?skills=${skills.join(',')}&page=${page}&size=${size}`),
};

export const applicationsAPI = {
  create: (applicationData) => api.post('/applications', applicationData),
  getByProject: (projectId, page = 0, size = 10) => 
    api.get(`/applications/project/${projectId}?page=${page}&size=${size}`),
  getByFreelancer: (page = 0, size = 10) => 
    api.get(`/applications/freelancer?page=${page}&size=${size}`),
  updateStatus: (applicationId, status) => 
    api.put(`/applications/${applicationId}/status?status=${status}`),
  getById: (id) => api.get(`/applications/${id}`),
  checkIfApplied: (projectId) => api.get(`/applications/check/${projectId}`),
};

export default api; 