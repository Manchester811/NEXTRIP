export interface NextripUser {
  name: string
  email: string
  createdAt: string
}

const USER_KEY = 'nextrip:user'
const SESSION_KEY = 'nextrip:session'
const REMEMBERED_EMAIL_KEY = 'nextrip:remembered-email'

export function getUser(): NextripUser | null {
  try {
    const value = localStorage.getItem(USER_KEY)
    return value ? (JSON.parse(value) as NextripUser) : null
  } catch {
    return null
  }
}

export function isAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === 'active' || localStorage.getItem(SESSION_KEY) === 'active'
}

export function login(email: string, name = 'Traveller', remember = false) {
  const user: NextripUser = { name, email, createdAt: new Date().toISOString() }
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  if (remember) localStorage.setItem(REMEMBERED_EMAIL_KEY, email)
  else localStorage.removeItem(REMEMBERED_EMAIL_KEY)
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(SESSION_KEY, 'active')
}

export function register(name: string, email: string, remember = false) {
  login(email, name, remember)
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(SESSION_KEY)
}

export function getRememberedEmail() {
  return localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? ''
}
