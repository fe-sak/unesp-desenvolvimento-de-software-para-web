import { Link } from 'react-router-dom'

function Navbar({ user, isAdmin, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Reparo</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Início</Link>
        {isAdmin && <Link to="/clientes">Clientes</Link>}
        {isAdmin && <Link to="/tecnicos">Técnicos</Link>}
        <Link to="/equipamentos">Equipamentos</Link>
        <Link to="/servicos">Servicos</Link>
      </div>
      <div className="navbar-user">
        <span>{isAdmin && <svg className="admin-icon" viewBox="0 0 24 24" width="16" height="16" fill="#f1c40f" stroke="#f1c40f" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}{user.username}</span>
        <button onClick={onLogout}>Sair</button>
      </div>
    </nav>
  )
}

export default Navbar
