import { Link } from 'react-router-dom'

function Navbar({ user, isAdmin, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Reparo</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        {isAdmin && <Link to="/clientes">Clientes</Link>}
        {isAdmin && <Link to="/tecnicos">Tecnicos</Link>}
        <Link to="/equipamentos">Equipamentos</Link>
        <Link to="/agendamentos">Agendamentos</Link>
      </div>
      <div className="navbar-user">
        <span>{user.username}</span>
        <button onClick={onLogout}>Sair</button>
      </div>
    </nav>
  )
}

export default Navbar
