import { useState } from 'react'
import { updateServico } from '../api'

function ServicosKanban({ servicos, clientes, tecnicos, aparelhos, onUpdate, isAdmin, tid }) {
  const [, forceRender] = useState(0)
  const colunas = {
    PENDENTE: [],
    CONFIRMADO: [],
    EM_ANDAMENTO: [],
    CANCELADO: [],
    CONCLUIDO: []
  }

  servicos.forEach(ag => {
    if (colunas[ag.status]) colunas[ag.status].push(ag)
  })

  const labels = {
    PENDENTE: 'Pendente',
    CONFIRMADO: 'Confirmado',
    EM_ANDAMENTO: 'Em andamento',
    CANCELADO: 'Cancelado',
    CONCLUIDO: 'Concluido'
  }

  const nomeCliente = (c) => {
    if (!c) return { nome: '-' }
    const found = typeof c === 'object' ? c : clientes.find(x => x.id === c)
    return found || { nome: '-' }
  }

  const nomeTecnico = (t) => {
    if (!t) return '-'
    if (typeof t === 'object') return t.nome
    const found = tecnicos.find(x => x.id === t)
    return found ? found.nome : '-'
  }

  const nomeEquip = (e) => {
    if (!e) return '-'
    if (typeof e === 'object') return e.tipo
    const found = aparelhos.find(x => x.id === e)
    return found ? found.tipo : '-'
  }

  const handleDragStart = (e, ag) => {
    e.dataTransfer.setData('text/plain', ag.id.toString())
    e.target.classList.add('dragging')
  }

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging')
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over')
  }

  const handleDrop = async (e, novoStatus) => {
    e.preventDefault()
    e.currentTarget.classList.remove('drag-over')

    const id = parseInt(e.dataTransfer.getData('text/plain'))
    const ag = servicos.find(a => a.id === id)
    if (!ag || ag.status === novoStatus) return

    const statusAntigo = ag.status
    ag.status = novoStatus
    forceRender(n => n + 1)

    try {
      const payload = {
        id,
        data: ag.data,
        hora: ag.hora,
        status: novoStatus,
        observacao: ag.observacao,
        cliente: ag.cliente?.id ? { id: ag.cliente.id } : null,
        tecnico: ag.tecnico?.id ? { id: ag.tecnico.id } : null,
        aparelho: ag.aparelho?.id ? { id: ag.aparelho.id } : null
      }
      await updateServico(payload)
    } catch (err) {
      console.log('erro ao mover card', err)
      ag.status = statusAntigo
      forceRender(n => n + 1)
      onUpdate()
    }
  }

  const aceitar = async (ag) => {
    try {
      const payload = {
        id: ag.id,
        data: ag.data,
        hora: ag.hora,
        status: 'CONFIRMADO',
        observacao: ag.observacao,
        cliente: ag.cliente?.id ? { id: ag.cliente.id } : null,
        tecnico: { id: tid },
        aparelho: ag.aparelho?.id ? { id: ag.aparelho.id } : null
      }
      await updateServico(payload)
      ag.status = 'CONFIRMADO'
      ag.tecnico = tecnicos.find(t => t.id === tid) || { id: tid }
      forceRender(n => n + 1)
    } catch (err) {
      console.log('erro ao aceitar', err)
    }
  }

  const trocarStatus = async (ag, novoStatus) => {
    const statusAntigo = ag.status
    ag.status = novoStatus
    forceRender(n => n + 1)

    try {
      const payload = {
        id: ag.id,
        data: ag.data,
        hora: ag.hora,
        status: novoStatus,
        observacao: ag.observacao,
        cliente: ag.cliente?.id ? { id: ag.cliente.id } : null,
        tecnico: ag.tecnico?.id ? { id: ag.tecnico.id } : null,
        aparelho: ag.aparelho?.id ? { id: ag.aparelho.id } : null
      }
      await updateServico(payload)
    } catch (err) {
      ag.status = statusAntigo
      forceRender(n => n + 1)
      onUpdate()
    }
  }

  const trocarTecnico = async (ag, novoTecnicoId) => {
    const tid = parseInt(novoTecnicoId)
    if (!tid) return
    try {
      const payload = {
        id: ag.id,
        data: ag.data,
        hora: ag.hora,
        status: ag.status,
        observacao: ag.observacao,
        cliente: ag.cliente?.id ? { id: ag.cliente.id } : null,
        tecnico: { id: tid },
        aparelho: ag.aparelho?.id ? { id: ag.aparelho.id } : null
      }
      await updateServico(payload)
      ag.tecnico = tecnicos.find(t => t.id === tid) || { id: tid }
      forceRender(n => n + 1)
    } catch (err) {
      console.log('erro ao trocar tecnico', err)
    }
  }

  return (
    <div>
      <div className="kanban-board">
      {Object.entries(colunas).map(([status, cards]) => (
        <div
          key={status}
          className={`kanban-coluna ${status.toLowerCase()}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, status)}
        >
          <h4>
            {labels[status]}
            <span className="kanban-count">{cards.length}</span>
          </h4>
          <div className="kanban-cards">
            {cards.map(ag => (
              <div
                key={ag.id}
                className={`kanban-card ${status.toLowerCase()}`}
                draggable
                onDragStart={(e) => handleDragStart(e, ag)}
                onDragEnd={handleDragEnd}
              >
                <p><strong>{nomeCliente(ag.cliente).nome}</strong></p>
                {nomeCliente(ag.cliente).telefone && (
                  <p style={{ fontSize: 11, color: '#888' }}>{nomeCliente(ag.cliente).telefone}</p>
                )}
                <p>{nomeEquip(ag.aparelho)}</p>
                {isAdmin ? (
                  <div style={{ marginTop: 4 }}>
                    <select
                      value={ag.tecnico?.id || ''}
                      onChange={(e) => { e.stopPropagation(); trocarTecnico(ag, e.target.value) }}
                      style={{ fontSize: 11, padding: '2px 4px', width: '100%' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="">Nenhum</option>
                      {tecnicos.map(t => (
                        <option key={t.id} value={t.id}>{t.nome}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p>{nomeTecnico(ag.tecnico)}</p>
                )}
                <p style={{ color: '#999', fontSize: 11 }}>
                  {ag.data ? ag.data.split('-').reverse().join('/') : ''}
                  {ag.hora ? ' ' + ag.hora.substring(0, 5) : ''}
                </p>
                {(status === 'PENDENTE' || status === 'CONFIRMADO') && ag.tecnico && (
                  <button className="btn btn-small" style={{ marginTop: 4 }}
                    onClick={(e) => { e.stopPropagation(); trocarStatus(ag, 'EM_ANDAMENTO') }}>
                    Iniciar
                  </button>
                )}
                {status === 'PENDENTE' && !ag.tecnico && tid && (
                  <button className="btn btn-small" style={{ marginTop: 4 }}
                    onClick={(e) => { e.stopPropagation(); aceitar(ag) }}>
                    Aceitar
                  </button>
                )}
                {status === 'EM_ANDAMENTO' && (
                  <button className="btn btn-small" style={{ marginTop: 4 }}
                    onClick={(e) => { e.stopPropagation(); trocarStatus(ag, 'CONCLUIDO') }}>
                    Concluir
                  </button>
                )}
              </div>
            ))}
            {cards.length === 0 && (
              <p style={{ color: '#bbb', textAlign: 'center', fontSize: 12, padding: 10 }}>
                Vazio
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
    </div>
  )
}

export default ServicosKanban
