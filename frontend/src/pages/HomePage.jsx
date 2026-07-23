import { Link } from 'react-router-dom'

function HomePage({ isAdmin }) {
  return (
    <div className="home-page">
      <h1>Sistema de Reparos</h1>
      <br />
      <p>Bem vindo ao sistema de gerenciamento de reparos.</p>
      <p>Aqui voce pode gerenciar clientes, tecnicos, equipamentos e agendamentos de servicos.</p>
      <br />
      <div className="home-cards">
        {isAdmin && (
          <Link to="/clientes" className="home-card">
            <h3>Clientes</h3>
            <p>Cadastre e gerencie os clientes</p>
          </Link>
        )}
        {isAdmin && (
          <Link to="/tecnicos" className="home-card">
            <h3>Tecnicos</h3>
            <p>Cadastre os tecnicos e suas especialidades</p>
          </Link>
        )}
        <Link to="/equipamentos" className="home-card">
          <h3>Equipamentos</h3>
          <p>Registre equipamentos com defeitos relatados</p>
        </Link>
        <Link to="/agendamentos" className="home-card">
          <h3>Agendamentos</h3>
          <p>Agende servicos vinculando cliente, equipamento e tecnico</p>
        </Link>
      </div>
    </div>
  )
}

export default HomePage
