import { useState, useEffect } from 'react'
import {
  getAgendamentos, createAgendamento, updateAgendamento, deleteAgendamento,
  getClientes, getTecnicos, getEquipamentos
} from '../api'

function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState([])
  const [clientes, setClientes] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [equipamentos, setEquipamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [status, setStatus] = useState('PENDENTE')
  const [observacao, setObservacao] = useState('')
  const [clienteId, setClienteId] = useState('')
  const [tecnicoId, setTecnicoId] = useState('')
  const [equipamentoId, setEquipamentoId] = useState('')

  var carregar = async () => {
    setLoading(true)
    try {
      const [agens, clis, tecs, equips] = await Promise.all([
        getAgendamentos(), getClientes(), getTecnicos(), getEquipamentos()
      ])
      setAgendamentos(agens)
      setClientes(clis)
      setTecnicos(tecs)
      setEquipamentos(equips)
    } catch (e) {
      console.log(e)
      setError('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  const abrirNovo = () => {
    setEditando(null)
    setData('')
    setHora('')
    setStatus('PENDENTE')
    setObservacao('')
    setClienteId('')
    setTecnicoId('')
    setEquipamentoId('')
    setShowForm(true)
    setError('')
  }

  const abrirEdicao = (ag) => {
    setEditando(ag)
    setData(ag.data || '')
    setHora(ag.hora || '')
    setStatus(ag.status || 'PENDENTE')
    setObservacao(ag.observacao || '')
    setClienteId(ag.cliente?.id || '')
    setTecnicoId(ag.tecnico?.id || '')
    setEquipamentoId(ag.equipamento?.id || '')
    setShowForm(true)
    setError('')
  }

  const fecharForm = () => {
    setShowForm(false)
    setEditando(null)
  }

  const salvar = async (e) => {
    e.preventDefault()
    setError('')

    const dados = {
      data: data || null,
      hora: hora || null,
      status,
      observacao: observacao || null,
      cliente: clienteId ? { id: parseInt(clienteId) } : null,
      tecnico: tecnicoId ? { id: parseInt(tecnicoId) } : null,
      equipamento: equipamentoId ? { id: parseInt(equipamentoId) } : null
    }

    try {
      if (editando) {
        dados.id = editando.id
        await updateAgendamento(dados)
      } else {
        await createAgendamento(dados)
      }
      fecharForm()
      carregar()
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.error || 'Erro ao salvar agendamento')
    }
  }

  const excluir = async (id) => {
    if (!window.confirm('Tem certeza?')) return
    try {
      await deleteAgendamento(id)
      carregar()
    } catch (err) {
      alert('Erro ao excluir agendamento')
    }
  }

  const statusLabel = (s) => {
    const map = {
      PENDENTE: 'Pendente',
      CONFIRMADO: 'Confirmado',
      CANCELADO: 'Cancelado',
      CONCLUIDO: 'Concluido'
    }
    return map[s] || s
  }

  const nomeCliente = (c) => {
    if (!c) return '-'
    if (typeof c === 'object') return c.nome
    const found = clientes.find(x => x.id === c)
    return found ? found.nome : `ID: ${c}`
  }

  const nomeTecnico = (t) => {
    if (!t) return '-'
    if (typeof t === 'object') return t.nome
    const found = tecnicos.find(x => x.id === t)
    return found ? found.nome : `ID: ${t}`
  }

  const nomeEquip = (e) => {
    if (!e) return '-'
    if (typeof e === 'object') return `${e.tipo} - ${e.modelo || 'sem modelo'}`
    const found = equipamentos.find(x => x.id === e)
    return found ? `${found.tipo} - ${found.modelo || 'sem modelo'}` : `ID: ${e}`
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Agendamentos</h2>
        <button className="btn btn-primary" onClick={abrirNovo}>Novo Agendamento</button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h3>{editando ? 'Editar Agendamento' : 'Novo Agendamento'}</h3>
          <br />
          <form onSubmit={salvar}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Data</label>
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hora</label>
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="PENDENTE">Pendente</option>
                <option value="CONFIRMADO">Confirmado</option>
                <option value="CANCELADO">Cancelado</option>
                <option value="CONCLUIDO">Concluido</option>
              </select>
            </div>
            <div className="form-group">
              <label>Observacao</label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Observacoes sobre o servico..."
                rows={3}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Cliente</label>
                <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
                  <option value="">Selecione...</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Tecnico</label>
                <select value={tecnicoId} onChange={(e) => setTecnicoId(e.target.value)} required>
                  <option value="">Selecione...</option>
                  {tecnicos.map(t => (
                    <option key={t.id} value={t.id}>{t.nome}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Equipamento</label>
                <select value={equipamentoId} onChange={(e) => setEquipamentoId(e.target.value)} required>
                  <option value="">Selecione...</option>
                  {equipamentos.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.tipo} - {eq.modelo || 'sem modelo'}</option>
                  ))}
                </select>
              </div>
            </div>
            <br />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary">Salvar</button>
              <button type="button" className="btn btn-secondary" onClick={fecharForm}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <br />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Status</th>
              <th>Cliente</th>
              <th>Tecnico</th>
              <th>Equipamento</th>
              <th>Obs</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.length === 0 && (
              <tr>
                <td colSpan={9}>Nenhum agendamento cadastrado</td>
              </tr>
            )}
            {agendamentos.map((ag) => (
              <tr key={ag.id}>
                <td>{ag.id}</td>
                <td>{ag.data || '-'}</td>
                <td>{ag.hora || '-'}</td>
                <td>{statusLabel(ag.status)}</td>
                <td>{nomeCliente(ag.cliente)}</td>
                <td>{nomeTecnico(ag.tecnico)}</td>
                <td>{nomeEquip(ag.equipamento)}</td>
                <td>{ag.observacao || '-'}</td>
                <td>
                  <button className="btn btn-small" onClick={() => abrirEdicao(ag)}>Editar</button>
                  <button className="btn btn-small btn-danger" onClick={() => excluir(ag.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default AgendamentosPage
