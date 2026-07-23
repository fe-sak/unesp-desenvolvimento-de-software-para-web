import { useState, useEffect } from 'react'
import { getTecnicos, createTecnico, updateTecnico, deleteTecnico } from '../api'

function TecnicosPage() {
  const [tecnicos, setTecnicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [nome, setNome] = useState('')
  const [especialidade, setEspecialidade] = useState('')

  var carregar = async () => {
    setLoading(true)
    try {
      const res = await getTecnicos()
      setTecnicos(res)
    } catch (e) {
      console.log(e)
      setError('Erro ao carregar tecnicos')
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
    setEspecialidade('')
    setShowForm(true)
    setError('')
  }

  const abrirEdicao = (tecnico) => {
    setEditando(tecnico)
    setNome(tecnico.nome)
    setEspecialidade(tecnico.especialidade || '')
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
      especialidade: especialidade || null
    }

    try {
      if (editando) {
        dados.id = editando.id
        await updateTecnico(dados)
      } else {
        await createTecnico(dados)
      }
      fecharForm()
      carregar()
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.error || 'Erro ao salvar tecnico')
    }
  }

  const excluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir?')) return
    try {
      await deleteTecnico(id)
      carregar()
    } catch (err) {
      alert('Erro ao excluir tecnico')
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Tecnicos</h2>
        <button className="btn btn-primary" onClick={abrirNovo}>Novo Tecnico</button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h3>{editando ? 'Editar Tecnico' : 'Novo Tecnico'}</h3>
          <br />
          <form onSubmit={salvar}>
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Nome do tecnico"
              />
            </div>
            <div className="form-group">
              <label>Especialidade</label>
              <input
                type="text"
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                placeholder="Ex: eletronica, refrigeracao"
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
              <th>Especialidade</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {tecnicos.length === 0 && (
              <tr>
                <td colSpan={4}>Nenhum tecnico cadastrado</td>
              </tr>
            )}
            {tecnicos.map((tecnico) => (
              <tr key={tecnico.id}>
                <td>{tecnico.id}</td>
                <td>{tecnico.nome}</td>
                <td>{tecnico.especialidade || '-'}</td>
                <td>
                  <button className="btn btn-small" onClick={() => abrirEdicao(tecnico)}>Editar</button>
                  <button className="btn btn-small btn-danger" onClick={() => excluir(tecnico.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default TecnicosPage
