import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ClientesPage from './pages/ClientesPage'
import TecnicosPage from './pages/TecnicosPage'
import AparelhosPage from './pages/AparelhosPage'
import ServicosPage from './pages/ServicosPage'
import MeusAparelhosPage from './pages/MeusAparelhosPage'
import SolicitarReparoPage from './pages/SolicitarReparoPage'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (!payload.role) {
          localStorage.removeItem('token')
          return
        }
        setUser({ username: payload.sub, role: payload.role })
      } catch (e) {
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
  const isTecnico = user && user.role === 'ROLE_TECNICO'
  const isCliente = user && user.role === 'ROLE_USER'

  const getHomeRedirect = () => {
    if (isTecnico) return '/servicos'
    if (isCliente) return '/meus-aparelhos'
    return '/'
  }

  return (
    <div>
      {user && <Navbar user={user} isAdmin={isAdmin} isTecnico={isTecnico} isCliente={isCliente} onLogout={onLogout} />}
      <div className="container">
        <Routes>
          <Route path="/login" element={!user ? <LoginPage onLogin={onLogin} /> : <Navigate to={getHomeRedirect()} />} />
          <Route path="/register" element={!user ? <RegisterPage onLogin={onLogin} /> : <Navigate to={getHomeRedirect()} />} />
          <Route path="/" element={user ? <HomePage isAdmin={isAdmin} isTecnico={isTecnico} isCliente={isCliente} /> : <Navigate to="/login" />} />
          <Route path="/clientes" element={user && isAdmin ? <ClientesPage isAdmin={isAdmin} /> : <Navigate to="/login" />} />
          <Route path="/tecnicos" element={user && isAdmin ? <TecnicosPage /> : <Navigate to="/login" />} />
          <Route path="/aparelhos" element={user && (isAdmin || isTecnico) ? <AparelhosPage /> : <Navigate to="/login" />} />
          <Route path="/servicos" element={user && (isAdmin || isTecnico) ? <ServicosPage /> : <Navigate to="/login" />} />
          <Route path="/meus-aparelhos" element={user && isCliente ? <MeusAparelhosPage /> : <Navigate to="/login" />} />
          <Route path="/solicitar-reparo" element={user && isCliente ? <SolicitarReparoPage /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
