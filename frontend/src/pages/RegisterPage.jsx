import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { register, getTecnicos, createCliente } from '../api'

function RegisterPage({ onLogin }) {
  const [passo, setPasso] = useState(1)
  const [tipo, setTipo] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [tecnicoId, setTecnicoId] = useState('')
  const [tecnicos, setTecnicos] = useState([])
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    getTecnicos().then(setTecnicos).catch(() => {})
  }, [])

  const escolherTipo = (t) => {
    setTipo(t)
    setPasso(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)

    try {
      let cid = undefined
      let tid = undefined
      if (tipo === 'cliente') {
        const created = await createCliente({ nome: nomeCompleto, telefone: telefone || null, email: email || null })
        cid = created.id
      }
      if (tipo === 'tecnico' && tecnicoId) tid = parseInt(tecnicoId)
      const data = await register(username, password, name || undefined, tipo === 'admin', cid, tid)
      onLogin(data.token)
    } catch (error) {
      console.log(error)
      setErr(error.response?.data?.error || 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 420 }}>
        <h2>Cadastro</h2>
        <br />

        {passo === 1 && (
          <div>
            <p style={{ textAlign: 'center', marginBottom: 16, color: '#555' }}>Qual o seu perfil?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button type="button" className="btn btn-primary" onClick={() => escolherTipo('cliente')}>
                Sou cliente
              </button>
              <button type="button" className="btn btn-primary" onClick={() => escolherTipo('tecnico')}>
                Sou tecnico
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => escolherTipo('admin')}>
                Sou administrador
              </button>
            </div>
          </div>
        )}

        {passo === 2 && (
          <div>
            <p style={{ textAlign: 'center', marginBottom: 12, color: '#555' }}>
              {tipo === 'cliente' && 'Cadastro de cliente'}
              {tipo === 'tecnico' && 'Cadastro de tecnico'}
              {tipo === 'admin' && 'Cadastro de administrador'}
            </p>

            {err && <div className="alert-error">{err}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="required">Usuario</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="escolha um usuario" />
              </div>

              <div className="form-group">
                <label className="required">Senha</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="escolha uma senha" />
              </div>

              <div className="form-group">
                <label>Nome</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="seu nome de exibicao" />
              </div>

              {tipo === 'cliente' && (
                <>
                  <div className="form-group">
                    <label className="required">Nome completo</label>
                    <input type="text" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} required placeholder="Seu nome completo" />
                  </div>
                  <div className="form-group">
                    <label>Telefone</label>
                    <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 99999-9999" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
                  </div>
                </>
              )}

              {tipo === 'tecnico' && (
                <div className="form-group">
                  <label>Tecnico</label>
                  <select value={tecnicoId} onChange={(e) => setTecnicoId(e.target.value)} required>
                    <option value="">Selecione seu cadastro...</option>
                    {tecnicos.filter(t => !t.hasUsuario).map((t) => (
                      <option key={t.id} value={t.id}>{t.nome}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setPasso(1)}>
                  Voltar
                </button>
              </div>
            </form>
          </div>
        )}

        <br />
        <p>Ja tem conta? <Link to="/login">Faca login</Link></p>
      </div>
    </div>
  )
}

export default RegisterPage
