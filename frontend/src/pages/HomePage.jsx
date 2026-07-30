import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getClientes, getTecnicos, getAparelhos, getServicos } from '../api'

function HomePage({ isAdmin }) {
  const [counts, setCounts] = useState({ clientes: 0, tecnicos: 0, aparelhos: 0, servicos: 0 })

  useEffect(() => {
    if (!isAdmin) {
      Promise.all([getAparelhos(), getServicos()]).then(([apar, servs]) => {
        setCounts({ clientes: 0, tecnicos: 0, aparelhos: apar.length, servicos: servs.length })
      }).catch(() => {})
      return
    }
    Promise.all([getClientes(), getTecnicos(), getAparelhos(), getServicos()]).then(([clis, tecs, apar, servs]) => {
      setCounts({ clientes: clis.length, tecnicos: tecs.length, aparelhos: apar.length, servicos: servs.length })
    }).catch(() => {})
  }, [])

  return (
    <div className="home-page">
      <h1>Gestão de Reparos</h1>
      <br />
      <p>Bem-vindo ao sistema de gestao de reparos.</p>
      <p>Aqui você pode gerenciar clientes, técnicos, aparelhos e serviços.</p>
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
        <Link to="/aparelhos" className="home-card">
          <h3>Aparelhos</h3>
          <div className="home-count">{counts.aparelhos}</div>
          <p>Registre aparelhos com defeitos relatados</p>
        </Link>
        <Link to="/servicos" className="home-card">
          <h3>Serviços</h3>
          <div className="home-count">{counts.servicos}</div>
          <p>Agende serviços vinculando cliente, aparelho e técnico</p>
        </Link>
      </div>
    </div>
  )
}

export default HomePage
