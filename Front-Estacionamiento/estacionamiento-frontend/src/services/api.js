import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const autoService = {
  // Obtener todos los autos
  getAllAutos: () => api.get('/autos/'),
  
  // Obtener auto por ID
  getAutoById: (id) => api.get(`/autos/${id}/`),
  
  // Crear nuevo auto
  createAuto: (autoData) => api.post('/autos/', autoData),
  
  // Actualizar auto
  updateAuto: (id, autoData) => api.put(`/autos/${id}/`, autoData),
  
  // Eliminar auto
  deleteAuto: (id) => api.delete(`/autos/${id}/`),
  
  // Registrar entrada
  registrarEntrada: (id, observaciones = '') => 
    api.post(`/autos/${id}/registrar_entrada/`, { observaciones }),
  
  // Registrar salida
  registrarSalida: (id, observaciones = '') => 
    api.post(`/autos/${id}/registrar_salida/`, { observaciones }),
  
  // Obtener historial de auto
  getHistorial: (id) => api.get(`/autos/${id}/historial/`),
  
  // Obtener autos estacionados
  getEstacionados: () => api.get('/autos/estacionados/'),
  
  // Obtener estadísticas
  getEstadisticas: () => api.get('/autos/estadisticas/'),
  
  // Buscar historial por patente
  getHistorialPorPatente: (patente) => api.get(`/historial/${patente}/`),
};

export default api;