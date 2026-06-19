import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 60000,
})

export const predictImage = async (file) => {
  const form = new FormData()
  form.append('file', file)
  const { data } = await API.post('/predict-image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const getHistory = async (limit = 20) => {
  const { data } = await API.get(`/history?limit=${limit}`)
  return data
}

export default API