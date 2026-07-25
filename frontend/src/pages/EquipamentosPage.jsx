import { useState, useEffect } from 'react'
import { getEquipamentos, createEquipamento, updateEquipamento, deleteEquipamento, getClientes } from '../api'

function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    if (sucesso) {
      const t = setTimeout(() => setSucesso(''), 3000)
      return () => clearTimeout(t)
    }
  }, [sucesso])

  // form
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [tipo, setTipo] = useState('')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [defeito, setDefeito] = useState('')
  const [clienteId, setClienteId] = useState('')

  var carregar = async () => {
    setLoading(true)
    try {
      const [equips, clis] = await Promise.all([getEquipamentos(), getClientes()])
      setEquipamentos(equips)
      setClientes(clis)
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
    setTipo('')
    setMarca('')
    setModelo('')
    setDefeito('')
    setClienteId('')
    setShowForm(true)
    setError('')
  }

  const abrirEdicao = (equip) => {
    setEditando(equip)
    setTipo(equip.tipo)
    setMarca(equip.marca || '')
    setModelo(equip.modelo || '')
    setDefeito(equip.defeitoRelatado || '')
    setClienteId(equip.cliente?.id || '')
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
      tipo,
      marca: marca || null,
      modelo: modelo || null,
      defeitoRelatado: defeito || null,
      cliente: clienteId ? { id: parseInt(clienteId) } : null
    }

    try {
      if (editando) {
        dados.id = editando.id
        await updateEquipamento(dados)
      } else {
        await createEquipamento(dados)
      }
      fecharForm()
      carregar()
      setSucesso(editando ? 'Equipamento atualizado!' : 'Equipamento criado!')
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.error || 'Erro ao salvar equipamento')
    }
  }

  const excluir = async (id) => {
    if (!window.confirm('Tem certeza?')) return
    try {
      await deleteEquipamento(id)
      carregar()
      setSucesso('Equipamento excluído!')
    } catch (err) {
      alert('Erro ao excluir equipamento')
    }
  }

  // helper pra pegar nome do cliente
  const nomeCliente = (cliente) => {
    if (!cliente) return '-'
    // se veio com cliente populado
    if (typeof cliente === 'object') return cliente.nome
    // se veio so o id, procura na lista
    const c = clientes.find((x) => x.id === cliente)
    return c ? c.nome : `ID: ${cliente}`
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Equipamentos</h2>
        <button className="btn btn-primary" onClick={abrirNovo}>Novo Equipamento</button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {sucesso && <div className="alert-success">{sucesso}</div>}

      {showForm && (
        <div className="form-card">
          <h3>{editando ? 'Editar Equipamento' : 'Novo Equipamento'}</h3>
          <br />
          <form onSubmit={salvar}>
            <div className="form-group">
              <label className="required">Tipo</label>
              <input
                type="text"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
                placeholder="Ex: notebook, celular, ar condicionado"
              />
            </div>
            <div className="form-group">
              <label>Marca</label>
              <input
                type="text"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                placeholder="Ex: Samsung, Dell"
              />
            </div>
            <div className="form-group">
              <label>Modelo</label>
              <input
                type="text"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                placeholder="Modelo do equipamento"
              />
            </div>
            <div className="form-group">
              <label>Defeito relatado</label>
              <textarea
                value={defeito}
                onChange={(e) => setDefeito(e.target.value)}
                placeholder="Descreva o defeito..."
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Cliente</label>
              <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
                <option value="">Selecione um cliente...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary">Salvar</button>
              <button type="button" className="btn btn-secondary" onClick={fecharForm}>Cancelar</button>
            </div>
          </form>
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
              <th>Tipo</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Defeito</th>
              <th>Cliente</th>
              <th className="col-acoes">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {equipamentos.length === 0 && (
              <tr>
                <td colSpan={7}>Nenhum equipamento cadastrado</td>
              </tr>
            )}
            {equipamentos.map((equip) => (
              <tr key={equip.id}>
                <td>{equip.id}</td>
                <td>{equip.tipo}</td>
                <td>{equip.marca || '-'}</td>
                <td>{equip.modelo || '-'}</td>
                <td>{equip.defeitoRelatado || '-'}</td>
                <td>{nomeCliente(equip.cliente)}</td>
                <td>
                  <button className="btn btn-small" onClick={() => abrirEdicao(equip)}>Editar</button>
                  <button className="btn btn-small btn-danger" onClick={() => excluir(equip.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default EquipamentosPage
