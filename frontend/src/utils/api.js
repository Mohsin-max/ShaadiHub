const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5114/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    const message = data?.message || data?.title || 'Something went wrong. Please try again.'
    throw new Error(message)
  }

  return data
}

export function signupClient(payload) {
  return request('/auth/signup/client', { method: 'POST', body: JSON.stringify(payload) })
}

export function signupProvider(payload) {
  return request('/auth/signup/provider', { method: 'POST', body: JSON.stringify(payload) })
}

export function login(payload) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
}
