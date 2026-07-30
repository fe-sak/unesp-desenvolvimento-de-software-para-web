import { Link } from 'react-router-dom'

function Navbar({ user, isAdmin, isTecnico, isCliente, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="22" height="22" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="11" fill="#2c3e50"/>
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="none" stroke="#ecf0f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {isCliente ? 'Meus Reparos' : 'Gestão de Reparos'}
        </Link>
      </div>
      <div className="navbar-links">
        {(isAdmin || isTecnico) && <Link to="/">Início</Link>}
        {isAdmin && <Link to="/clientes">Clientes</Link>}
        {isAdmin && <Link to="/tecnicos">Técnicos</Link>}
        {(isAdmin || isTecnico) && <Link to="/aparelhos">Aparelhos</Link>}
        {(isAdmin || isTecnico) && <Link to="/servicos">Serviços</Link>}
        {isCliente && <Link to="/solicitar-reparo">Solicitar Reparo</Link>}
      </div>
      <div className="navbar-user">
        <span>{isAdmin && <svg className="admin-icon" viewBox="0 0 24 24" width="16" height="16" fill="#f1c40f" stroke="#f1c40f" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}{user.username}</span>
        <button onClick={onLogout}>Sair</button>
      </div>
    </nav>
  )
}

export default Navbar
