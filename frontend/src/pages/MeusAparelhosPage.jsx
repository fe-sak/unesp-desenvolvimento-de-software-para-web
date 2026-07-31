import { useState, useEffect } from 'react'
import { getAparelhos, getServicos } from '../api'

function MeusAparelhosPage() {
  const [aparelhos, setAparelhos] = useState([])
  const [servicos, setServicos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAparelhos(), getServicos()]).then(([apar, serv]) => {
      setAparelhos(apar)
      setServicos(serv)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const servicosDoAparelho = (aparelhoId) => {
    return servicos.filter(s => {
      const aid = typeof s.aparelho === 'object' ? s.aparelho?.id : s.aparelho
      return aid === aparelhoId
    })
  }

  const ultimoStatus = (aparelhoId) => {
    const ss = servicosDoAparelho(aparelhoId)
    if (ss.length === 0) return null
    return ss[ss.length - 1].status
  }

  const statusLabel = {
    PENDENTE: 'Pendente',
    CONFIRMADO: 'Confirmado',
    EM_ANDAMENTO: 'Em andamento',
    CANCELADO: 'Cancelado',
    CONCLUIDO: 'Concluido'
  }

  const etapas = ['PENDENTE', 'CONFIRMADO', 'EM_ANDAMENTO', 'CONCLUIDO']

  const renderTimeline = (aparelhoId) => {
    const ss = servicosDoAparelho(aparelhoId)
    if (ss.length === 0) return <p style={{ color: '#999', fontSize: 12 }}>Nenhum servico</p>

    const servico = ss[ss.length - 1]
    const statusAtual = servico.status

    return (
      <div>
        <div className="mini-timeline">
          {etapas.map((etapa, i) => {
            const idx = etapas.indexOf(statusAtual)
            const done = etapas.indexOf(etapa) <= idx
            return (
              <div key={etapa} className="timeline-step">
                <div className={`timeline-dot ${done ? 'done' : ''}`}></div>
                {i < etapas.length - 1 && <div className={`timeline-line ${done ? 'done' : ''}`}></div>}
                <div className="timeline-label">{statusLabel[etapa]}</div>
              </div>
            )
          })}
        </div>
        <p style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
          Ultimo servico: {servico.data ? servico.data.split('-').reverse().join('/') : '-'}
        </p>
      </div>
    )
  }

  if (loading) return <div className="loading-box"><div className="spinner"></div>Carregando...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h2>Meus Aparelhos</h2>
      </div>

      {aparelhos.length === 0 ? (
        <p>Nenhum aparelho cadastrado.</p>
      ) : (
        <div className="aparelhos-grid">
          {aparelhos.map(ap => (
            <div key={ap.id} className="aparelho-card">
              <h3>{ap.tipo} - {ap.modelo || 'sem modelo'}</h3>
              <p style={{ fontSize: 13, color: '#666' }}>
                {ap.marca && `Marca: ${ap.marca}`}
                {ap.defeitoRelatado && ` — ${ap.defeitoRelatado}`}
              </p>
              <div style={{ marginTop: 10 }}>
                {renderTimeline(ap.id)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MeusAparelhosPage
