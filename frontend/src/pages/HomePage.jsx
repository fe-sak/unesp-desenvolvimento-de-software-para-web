import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getClientes, getTecnicos, getEquipamentos, getServicos } from '../api'

function HomePage({ isAdmin }) {
  const [counts, setCounts] = useState({ clientes: 0, tecnicos: 0, equipamentos: 0, servicos: 0 })

  useEffect(() => {
    if (!isAdmin) {
      Promise.all([getEquipamentos(), getServicos()]).then(([equips, servs]) => {
        setCounts({ clientes: 0, tecnicos: 0, equipamentos: equips.length, servicos: servs.length })
      }).catch(() => {})
      return
    }
    Promise.all([getClientes(), getTecnicos(), getEquipamentos(), getServicos()]).then(([clis, tecs, equips, servs]) => {
      setCounts({ clientes: clis.length, tecnicos: tecs.length, equipamentos: equips.length, servicos: servs.length })
    }).catch(() => {})
  }, [])

  return (
    <div className="home-page">
      <h1>Sistema de Reparos</h1>
      <br />
      <p>Bem-vindo ao sistema de gerenciamento de reparos.</p>
      <p>Aqui você pode gerenciar clientes, técnicos, equipamentos e agendamentos de serviços.</p>
      <br />
      <div className="home-cards">
        {isAdmin && (
          <Link to="/clientes" className="home-card">
            <h3>Clientes</h3>
            <div className="home-count">{counts.clientes}</div>
            <p>Cadastre e gerencie os clientes</p>
          </Link>
        )}
        {isAdmin && (
          <Link to="/tecnicos" className="home-card">
            <h3>Técnicos</h3>
            <div className="home-count">{counts.tecnicos}</div>
            <p>Cadastre os técnicos e suas especialidades</p>
          </Link>
        )}
        <Link to="/equipamentos" className="home-card">
          <h3>Equipamentos</h3>
          <div className="home-count">{counts.equipamentos}</div>
          <p>Registre equipamentos com defeitos relatados</p>
        </Link>
        <Link to="/servicos" className="home-card">
          <h3>Serviços</h3>
          <div className="home-count">{counts.servicos}</div>
          <p>Agende serviços vinculando cliente, equipamento e técnico</p>
        </Link>
      </div>
    </div>
  )
}

export default HomePage
