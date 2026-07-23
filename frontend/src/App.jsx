import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ClientesPage from './pages/ClientesPage'
import TecnicosPage from './pages/TecnicosPage'
import EquipamentosPage from './pages/EquipamentosPage'
import AgendamentosPage from './pages/AgendamentosPage'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({ username: payload.sub, role: payload.role })
      } catch (e) {
        console.log('token invalido')
        localStorage.removeItem('token')
      }
    }
  }, [])

  const onLogin = (token) => {
    localStorage.setItem('token', token)
    const payload = JSON.parse(atob(token.split('.')[1]))
    setUser({ username: payload.sub, role: payload.role })
  }

  const onLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const isAdmin = user && user.role === 'ROLE_ADMIN'

  return (
    <div>
      {user && <Navbar user={user} isAdmin={isAdmin} onLogout={onLogout} />}
      <div className="container">
        <Routes>
          <Route path="/login" element={!user ? <LoginPage onLogin={onLogin} /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <RegisterPage onLogin={onLogin} /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <HomePage isAdmin={isAdmin} /> : <Navigate to="/login" />} />
          <Route path="/clientes" element={user ? <ClientesPage isAdmin={isAdmin} /> : <Navigate to="/login" />} />
          <Route path="/tecnicos" element={user && isAdmin ? <TecnicosPage /> : <Navigate to="/login" />} />
          <Route path="/equipamentos" element={user ? <EquipamentosPage /> : <Navigate to="/login" />} />
          <Route path="/agendamentos" element={user ? <AgendamentosPage /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
