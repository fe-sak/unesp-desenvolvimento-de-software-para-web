import { useState, useEffect } from 'react'
import {
  getAgendamentos, createAgendamento, updateAgendamento, deleteAgendamento,
  getClientes, createCliente, getTecnicos, createTecnico, getEquipamentos, createEquipamento
} from '../api'

function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState([])
  const [clientes, setClientes] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [equipamentos, setEquipamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    if (sucesso) {
      const t = setTimeout(() => setSucesso(''), 3000)
      return () => clearTimeout(t)
    }
  }, [sucesso])

  const [showWizard, setShowWizard] = useState(false)
  const [editando, setEditando] = useState(null)
  const [passo, setPasso] = useState(1)

  // selecoes
  const [clienteId, setClienteId] = useState('')
  const [equipamentoId, setEquipamentoId] = useState('')
  const [tecnicoId, setTecnicoId] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [status, setStatus] = useState('PENDENTE')
  const [observacao, setObservacao] = useState('')

  // forms inline
  const [criandoCliente, setCriandoCliente] = useState(false)
  const [novoCliente, setNovoCliente] = useState({ nome: '', telefone: '', email: '' })

  const [criandoEquip, setCriandoEquip] = useState(false)
  const [novoEquip, setNovoEquip] = useState({ tipo: '', marca: '', modelo: '', defeito: '' })

  const [criandoTecnico, setCriandoTecnico] = useState(false)
  const [novoTecnico, setNovoTecnico] = useState({ nome: '', especialidade: '' })

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

  const formatData = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 8)
    if (digits.length <= 2) return digits
    if (digits.length <= 4) return digits.slice(0, 2) + '/' + digits.slice(2)
    return digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4)
  }

  const formatHora = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length <= 2) return digits
    return digits.slice(0, 2) + ':' + digits.slice(2)
  }

  const resetWizard = () => {
    setEditando(null)
    setPasso(1)
    setClienteId('')
    setEquipamentoId('')
    setTecnicoId('')
    setData('')
    setHora('')
    setStatus('PENDENTE')
    setObservacao('')
    setCriandoCliente(false)
    setNovoCliente({ nome: '', telefone: '', email: '' })
    setCriandoEquip(false)
    setNovoEquip({ tipo: '', marca: '', modelo: '', defeito: '' })
    setCriandoTecnico(false)
    setNovoTecnico({ nome: '', especialidade: '' })
    setError('')
  }

  const abrirNovo = () => {
    resetWizard()
    setShowWizard(true)
  }

  const abrirEdicao = (ag) => {
    resetWizard()
    setEditando(ag)
    setClienteId(ag.cliente?.id || '')
    setEquipamentoId(ag.equipamento?.id || '')
    setTecnicoId(ag.tecnico?.id || '')
    setData(ag.data ? ag.data.split('-').reverse().join('/') : '')
    setHora(ag.hora ? ag.hora.substring(0, 5) : '')
    setStatus(ag.status || 'PENDENTE')
    setObservacao(ag.observacao || '')
    setPasso(4)
    setShowWizard(true)
  }

  const fecharWizard = () => {
    setShowWizard(false)
    setEditando(null)
  }

  const salvarAgendamento = async () => {
    setError('')

    const dados = {
      data: data ? data.split('/').reverse().join('-') : null,
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
      fecharWizard()
      carregar()
      setSucesso(editando ? 'Agendamento atualizado!' : 'Agendamento criado!')
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.error || 'Erro ao salvar agendamento')
    }
  }

  const salvarCliente = async () => {
    try {
      const created = await createCliente(novoCliente)
      await carregar()
      setClienteId(created.id)
      setCriandoCliente(false)
      setNovoCliente({ nome: '', telefone: '', email: '' })
    } catch (err) {
      alert('Erro ao criar cliente')
    }
  }

  const salvarEquip = async () => {
    try {
      const dados = {
        ...novoEquip,
        defeitoRelatado: novoEquip.defeito || null,
        cliente: clienteId ? { id: parseInt(clienteId) } : null
      }
      const created = await createEquipamento(dados)
      await carregar()
      setEquipamentoId(created.id)
      setCriandoEquip(false)
      setNovoEquip({ tipo: '', marca: '', modelo: '', defeito: '' })
    } catch (err) {
      alert('Erro ao criar equipamento')
    }
  }

  const salvarTecnico = async () => {
    try {
      const created = await createTecnico(novoTecnico)
      await carregar()
      setTecnicoId(created.id)
      setCriandoTecnico(false)
      setNovoTecnico({ nome: '', especialidade: '' })
    } catch (err) {
      alert('Erro ao criar tecnico')
    }
  }

  const excluir = async (id) => {
    if (!window.confirm('Tem certeza?')) return
    try {
      await deleteAgendamento(id)
      carregar()
      setSucesso('Agendamento excluído!')
    } catch (err) {
      alert('Erro ao excluir agendamento')
    }
  }

  const statusLabel = (s) => {
    const map = {
      PENDENTE: 'Pendente',
      CONFIRMADO: 'Confirmado',
      CANCELADO: 'Cancelado',
      CONCLUIDO: 'Concluído'
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

  const podeAvancar = () => {
    if (passo === 1) return !!clienteId
    if (passo === 2) return !!equipamentoId
    if (passo === 3) return !!tecnicoId
    if (passo === 4) return !!data && !!hora
    return false
  }

  const tituloCliente = () => {
    const c = clientes.find(x => x.id === parseInt(clienteId))
    return c ? c.nome : 'Nenhum'
  }

  const tituloEquip = () => {
    const e = equipamentos.find(x => x.id === parseInt(equipamentoId))
    return e ? `${e.tipo} - ${e.modelo || 'sem modelo'}` : 'Nenhum'
  }

  const tituloTecnico = () => {
    const t = tecnicos.find(x => x.id === parseInt(tecnicoId))
    return t ? t.nome : 'Nenhum'
  }

  const renderPassos = () => {
    const passos = ['Cliente', 'Equipamento', 'Técnico', 'Detalhes']
    return (
      <div className="wizard-steps">
        {passos.map((label, i) => {
          const num = i + 1
          var cls = 'wizard-step'
          if (num === passo) cls += ' active'
          if (num < passo) cls += ' done'
          return (
            <div key={num} className={cls}>
              <span className="wizard-num">{num}</span>
              <span className="wizard-label">{label}</span>
            </div>
          )
        })}
      </div>
    )
  }

  const renderPasso1 = () => (
    <div>
      <h3>Passo 1: Cliente</h3>
      <br />
      <div className="form-group">
        <label>Selecione um cliente</label>
        <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
          <option value="">Escolha...</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </div>

      {!criandoCliente ? (
        <button type="button" className="btn btn-small" onClick={() => setCriandoCliente(true)}>
          + Novo cliente
        </button>
      ) : (
        <div className="wizard-inline-form">
          <h4>Novo cliente</h4>
          <div className="form-group">
            <label className="required">Nome</label>
            <input type="text" value={novoCliente.nome} required
              onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
              placeholder="Nome do cliente" />
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input type="text" value={novoCliente.telefone}
              onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })}
              placeholder="(11) 99999-9999" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={novoCliente.email}
              onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })}
              placeholder="cliente@email.com" />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-primary" onClick={salvarCliente}>Salvar</button>
            <button type="button" className="btn btn-secondary" onClick={() => setCriandoCliente(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )

  const renderPasso2 = () => (
    <div>
      <h3>Passo 2: Equipamento</h3>
      <br />
      <div className="form-group">
        <label>Selecione um equipamento</label>
        <select value={equipamentoId} onChange={(e) => setEquipamentoId(e.target.value)}>
          <option value="">Escolha...</option>
          {equipamentos.filter(eq => {
            if (!clienteId) return true
            const cid = typeof eq.cliente === 'object' ? eq.cliente?.id : eq.cliente
            return cid === parseInt(clienteId)
          }).map(eq => (
            <option key={eq.id} value={eq.id}>{eq.tipo} - {eq.modelo || 'sem modelo'}</option>
          ))}
        </select>
      </div>

      {!criandoEquip ? (
        <button type="button" className="btn btn-small" onClick={() => setCriandoEquip(true)}>
          + Novo equipamento
        </button>
      ) : (
        <div className="wizard-inline-form">
          <h4>Novo equipamento</h4>
          <div className="form-group">
            <label className="required">Tipo</label>
            <input type="text" value={novoEquip.tipo} required
              onChange={(e) => setNovoEquip({ ...novoEquip, tipo: e.target.value })}
              placeholder="Ex: notebook, celular" />
          </div>
          <div className="form-group">
            <label>Marca</label>
            <input type="text" value={novoEquip.marca}
              onChange={(e) => setNovoEquip({ ...novoEquip, marca: e.target.value })}
              placeholder="Ex: Samsung, Dell" />
          </div>
          <div className="form-group">
            <label>Modelo</label>
            <input type="text" value={novoEquip.modelo}
              onChange={(e) => setNovoEquip({ ...novoEquip, modelo: e.target.value })}
              placeholder="Modelo" />
          </div>
          <div className="form-group">
            <label>Defeito relatado</label>
            <textarea value={novoEquip.defeito} rows={2}
              onChange={(e) => setNovoEquip({ ...novoEquip, defeito: e.target.value })}
              placeholder="Descreva o defeito..." />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-primary" onClick={salvarEquip}>Salvar</button>
            <button type="button" className="btn btn-secondary" onClick={() => setCriandoEquip(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )

  const renderPasso3 = () => (
    <div>
      <h3>Passo 3: Técnico</h3>
      <br />
      <div className="form-group">
        <label>Selecione um técnico</label>
        <select value={tecnicoId} onChange={(e) => setTecnicoId(e.target.value)}>
          <option value="">Escolha...</option>
          {tecnicos.map(t => (
            <option key={t.id} value={t.id}>{t.nome}</option>
          ))}
        </select>
      </div>

      {!criandoTecnico ? (
        <button type="button" className="btn btn-small" onClick={() => setCriandoTecnico(true)}>
          + Novo técnico
        </button>
      ) : (
        <div className="wizard-inline-form">
          <h4>Novo técnico</h4>
          <div className="form-group">
            <label className="required">Nome</label>
            <input type="text" value={novoTecnico.nome} required
              onChange={(e) => setNovoTecnico({ ...novoTecnico, nome: e.target.value })}
              placeholder="Nome do técnico" />
          </div>
          <div className="form-group">
            <label>Especialidade</label>
            <input type="text" value={novoTecnico.especialidade}
              onChange={(e) => setNovoTecnico({ ...novoTecnico, especialidade: e.target.value })}
              placeholder="Ex: eletrônica, refrigeração" />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-primary" onClick={salvarTecnico}>Salvar</button>
            <button type="button" className="btn btn-secondary" onClick={() => setCriandoTecnico(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )

  const renderPasso4 = () => (
    <div>
      <h3>{editando ? 'Passo 4: Editar agendamento' : 'Passo 4: Detalhes do agendamento'}</h3>
      <br />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label className="required">Data</label>
          <input type="text" value={data}
            onChange={(e) => setData(formatData(e.target.value))}
            required placeholder="31/12/2026" />
        </div>
        <div className="form-group">
          <label className="required">Hora</label>
          <input type="text" value={hora}
            onChange={(e) => setHora(formatHora(e.target.value))}
            required placeholder="14:30" maxLength={5} />
        </div>
      </div>
      <div className="form-group">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="PENDENTE">Pendente</option>
          <option value="CONFIRMADO">Confirmado</option>
          <option value="CANCELADO">Cancelado</option>
              <option value="CONCLUIDO">Concluído</option>
        </select>
      </div>
      <div className="form-group">
        <label>Observação</label>
        <textarea value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Observações..." rows={3} />
      </div>

      <div className="wizard-review">
        <h4>Resumo</h4>
        <p><strong>Cliente:</strong> {tituloCliente()}</p>
        <p><strong>Equipamento:</strong> {tituloEquip()}</p>
        <p><strong>Técnico:</strong> {tituloTecnico()}</p>
        <p><strong>Data:</strong> {data || '-'} às {hora || '-'}</p>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="page-header">
        <h2>Agendamentos</h2>
        <button className="btn btn-primary" onClick={abrirNovo}>Novo Agendamento</button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {sucesso && <div className="alert-success">{sucesso}</div>}

      {showWizard && (
        <div className="wizard-card">
          {renderPassos()}

          <div className="wizard-body">
            {passo === 1 && renderPasso1()}
            {passo === 2 && renderPasso2()}
            {passo === 3 && renderPasso3()}
            {passo === 4 && renderPasso4()}
          </div>

          <div className="wizard-botoes">
            {passo > 1 && (
              <button type="button" className="btn btn-secondary" onClick={() => setPasso(passo - 1)}>
                Voltar
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={fecharWizard}>Cancelar</button>
            {passo < 4 ? (
              <button type="button" className="btn btn-primary"
                disabled={!podeAvancar()}
                onClick={() => setPasso(passo + 1)}>
                Próximo
              </button>
            ) : (
              <button type="button" className="btn btn-primary"
                disabled={!podeAvancar()}
                onClick={salvarAgendamento}>
                {editando ? 'Salvar' : 'Finalizar'}
              </button>
            )}
          </div>
        </div>
      )}

      <br />

      {loading ? (
        <div className="loading-box"><div className="spinner"></div>Carregando...</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Status</th>
              <th>Cliente</th>
              <th>Técnico</th>
              <th>Equipamento</th>
              <th>Obs</th>
              <th className="col-acoes">Acoes</th>
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
                <td>{ag.data ? ag.data.split('-').reverse().join('/') : '-'}</td>
                <td>{ag.hora ? ag.hora.substring(0, 5) : '-'}</td>
                <td><span className={`status-badge status-${ag.status}`}>{statusLabel(ag.status)}</span></td>
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
