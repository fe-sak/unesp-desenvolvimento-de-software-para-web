import { useState, useEffect } from 'react'
import { getClientes, createCliente, updateCliente, deleteCliente } from '../api'

function ClientesPage({ isAdmin }) {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')

  var carregar = async () => {
    setLoading(true)
    try {
      const res = await getClientes()
      setClientes(res)
    } catch (e) {
      console.log('erro ao carregar clientes', e)
      setError('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  const abrirNovo = () => {
    setEditando(null)
    setNome('')
    setTelefone('')
    setEmail('')
    setShowForm(true)
    setError('')
  }

  const abrirEdicao = (cliente) => {
    setEditando(cliente)
    setNome(cliente.nome)
    setTelefone(cliente.telefone || '')
    setEmail(cliente.email || '')
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
      nome,
      telefone: telefone || null,
      email: email || null
    }

    try {
      if (editando) {
        dados.id = editando.id
        await updateCliente(dados)
      } else {
        await createCliente(dados)
      }
      fecharForm()
      carregar()
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.error || 'Erro ao salvar cliente')
    }
  }

  const excluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir?')) return
    try {
      await deleteCliente(id)
      carregar()
    } catch (err) {
      console.log(err)
      alert('Erro ao excluir cliente')
    }
  }

  if (!isAdmin) {
    return <div className="page"><h2>Acesso negado</h2><p>Somente administradores podem gerenciar clientes.</p></div>
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Clientes</h2>
        <button className="btn btn-primary" onClick={abrirNovo}>Novo Cliente</button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h3>{editando ? 'Editar Cliente' : 'Novo Cliente'}</h3>
          <br />
          <form onSubmit={salvar}>
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Nome do cliente"
              />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@email.com"
              />
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
        <p>Carregando...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 && (
              <tr>
                <td colSpan={5}>Nenhum cliente cadastrado</td>
              </tr>
            )}
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nome}</td>
                <td>{cliente.telefone || '-'}</td>
                <td>{cliente.email || '-'}</td>
                <td>
                  <button className="btn btn-small" onClick={() => abrirEdicao(cliente)}>Editar</button>
                  <button className="btn btn-small btn-danger" onClick={() => excluir(cliente.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ClientesPage
