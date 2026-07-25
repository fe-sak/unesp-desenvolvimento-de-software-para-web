import { useState, useEffect } from 'react'
import { getTecnicos, createTecnico, updateTecnico, deleteTecnico } from '../api'

function TecnicosPage() {
  const [tecnicos, setTecnicos] = useState([])
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
  const [nome, setNome] = useState('')
  const [especialidade, setEspecialidade] = useState('')

  var carregar = async () => {
    setLoading(true)
    try {
      const res = await getTecnicos()
      setTecnicos(res)
    } catch (e) {
      console.log(e)
      setError('Erro ao carregar técnicos')
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
      setSucesso(editando ? 'Técnico atualizado!' : 'Técnico criado!')
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.error || 'Erro ao salvar técnico')
    }
  }

  const excluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir?')) return
    try {
      await deleteTecnico(id)
      carregar()
      setSucesso('Técnico excluído!')
    } catch (err) {
      alert('Erro ao excluir técnico')
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Técnicos</h2>
        <button className="btn btn-primary" onClick={abrirNovo}>Novo Técnico</button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {sucesso && <div className="alert-success">{sucesso}</div>}

      {showForm && (
        <div className="form-card">
          <h3>{editando ? 'Editar Técnico' : 'Novo Técnico'}</h3>
          <br />
          <form onSubmit={salvar}>
            <div className="form-group">
              <label className="required">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Nome do técnico"
              />
            </div>
            <div className="form-group">
              <label>Especialidade</label>
              <input
                type="text"
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                placeholder="Ex: eletrônica, refrigeração"
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
        <div className="loading-box"><div className="spinner"></div>Carregando...</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Especialidade</th>
              <th className="col-acoes">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {tecnicos.length === 0 && (
              <tr>
                <td colSpan={4}>Nenhum técnico cadastrado</td>
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
