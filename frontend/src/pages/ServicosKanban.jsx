import { useState } from 'react'
import { updateServico } from '../api'

function ServicosKanban({ agendamentos, clientes, tecnicos, equipamentos, onUpdate }) {
  const [, forceRender] = useState(0)
  const colunas = {
    PENDENTE: [],
    CONFIRMADO: [],
    EM_ANDAMENTO: [],
    CANCELADO: [],
    CONCLUIDO: []
  }

  agendamentos.forEach(ag => {
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
    if (!c) return '-'
    if (typeof c === 'object') return c.nome
    const found = clientes.find(x => x.id === c)
    return found ? found.nome : '-'
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
    const found = equipamentos.find(x => x.id === e)
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
    const ag = agendamentos.find(a => a.id === id)
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
        equipamento: ag.equipamento?.id ? { id: ag.equipamento.id } : null
      }
      await updateServico(payload)
    } catch (err) {
      console.log('erro ao mover card', err)
      ag.status = statusAntigo
      forceRender(n => n + 1)
      onUpdate()
    }
  }

  return (
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
                <p><strong>{nomeCliente(ag.cliente)}</strong></p>
                <p>{nomeEquip(ag.equipamento)}</p>
                <p>{nomeTecnico(ag.tecnico)}</p>
                <p style={{ color: '#999', fontSize: 11 }}>
                  {ag.data ? ag.data.split('-').reverse().join('/') : ''}
                  {ag.hora ? ' ' + ag.hora.substring(0, 5) : ''}
                </p>
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
  )
}

export default ServicosKanban
