import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// auth
export const login = (username, password) =>
  api.post('/auth/login', { username, password }).then(r => r.data)

export const register = (username, password, name) =>
  api.post('/auth/register', { username, password, name }).then(r => r.data)

// clientes
export const getClientes = () => api.get('/clientes/').then(r => r.data)
export const getCliente = (id) => api.get(`/clientes/${id}`).then(r => r.data)
export const createCliente = (data) => api.post('/clientes/', data).then(r => r.data)
export const updateCliente = (data) => api.put('/clientes/', data).then(r => r.data)
export const deleteCliente = (id) => api.delete(`/clientes/${id}`).then(r => r.data)

// tecnicos
export const getTecnicos = () => api.get('/tecnicos/').then(r => r.data)
export const getTecnico = (id) => api.get(`/tecnicos/${id}`).then(r => r.data)
export const createTecnico = (data) => api.post('/tecnicos/', data).then(r => r.data)
export const updateTecnico = (data) => api.put('/tecnicos/', data).then(r => r.data)
export const deleteTecnico = (id) => api.delete(`/tecnicos/${id}`).then(r => r.data)

// equipamentos
export const getEquipamentos = () => api.get('/equipamentos/').then(r => r.data)
export const getEquipamento = (id) => api.get(`/equipamentos/${id}`).then(r => r.data)
export const createEquipamento = (data) => api.post('/equipamentos/', data).then(r => r.data)
export const updateEquipamento = (data) => api.put('/equipamentos/', data).then(r => r.data)
export const deleteEquipamento = (id) => api.delete(`/equipamentos/${id}`).then(r => r.data)

// agendamentos
export const getAgendamentos = () => api.get('/agendamentos/').then(r => r.data)
export const getAgendamento = (id) => api.get(`/agendamentos/${id}`).then(r => r.data)
export const createAgendamento = (data) => api.post('/agendamentos/', data).then(r => r.data)
export const updateAgendamento = (data) => api.put('/agendamentos/', data).then(r => r.data)
export const deleteAgendamento = (id) => api.delete(`/agendamentos/${id}`).then(r => r.data)

export default api
