import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { register, getClientes, getTecnicos, createCliente } from '../api'

function RegisterPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [admin, setAdmin] = useState(false)
  const [tipo, setTipo] = useState('cliente')
  const [clienteId, setClienteId] = useState('')
  const [tecnicoId, setTecnicoId] = useState('')
  const [clientes, setClientes] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [novoCliente, setNovoCliente] = useState({ nome: '', telefone: '', email: '' })
  const [modoCliente, setModoCliente] = useState('existente')

  useEffect(() => {
    getClientes().then(setClientes).catch(() => {})
    getTecnicos().then(setTecnicos).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)

    try {
      let cid = undefined
      let tid = undefined
      if (!admin) {
        if (tipo === 'cliente') {
          if (modoCliente === 'novo') {
            const created = await createCliente(novoCliente)
            cid = created.id
          } else if (clienteId) {
            cid = parseInt(clienteId)
          }
        }
        if (tipo === 'tecnico' && tecnicoId) tid = parseInt(tecnicoId)
      }
      const data = await register(username, password, name || undefined, admin, cid, tid)
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
      <div className="auth-card">
        <h2>Cadastro</h2>
        <br />
        {err && <div className="alert-error">{err}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="required">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="escolha um usuário"
            />
          </div>

          <div className="form-group">
            <label className="required">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="escolha uma senha"
            />
          </div>

          <div className="form-group">
            <label>Nome (opcional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="seu nome"
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="admin"
              checked={admin}
              onChange={(e) => setAdmin(e.target.checked)}
              style={{ width: 'auto' }}
            />
            <label htmlFor="admin" style={{ marginBottom: 0 }}>Administrador</label>
          </div>

          {!admin && (
            <>
              <div className="form-group">
                <label>Tipo de conta</label>
                <div style={{ display: 'flex', gap: '15px', marginTop: 4 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 'normal' }}>
                    <input type="radio" name="tipo" checked={tipo === 'cliente'} onChange={() => setTipo('cliente')} style={{ width: 'auto' }} />
                    Cliente
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 'normal' }}>
                    <input type="radio" name="tipo" checked={tipo === 'tecnico'} onChange={() => setTipo('tecnico')} style={{ width: 'auto' }} />
                    Técnico
                  </label>
                </div>
              </div>

              {tipo === 'cliente' && (
                <>
                  <div className="form-group">
                    <label>Cadastro</label>
                    <div style={{ display: 'flex', gap: '15px', marginTop: 4 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 'normal' }}>
                        <input type="radio" name="modoCliente" checked={modoCliente === 'existente'} onChange={() => setModoCliente('existente')} style={{ width: 'auto' }} />
                        Ja sou cliente
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 'normal' }}>
                        <input type="radio" name="modoCliente" checked={modoCliente === 'novo'} onChange={() => setModoCliente('novo')} style={{ width: 'auto' }} />
                        Novo por aqui
                      </label>
                    </div>
                  </div>

                  {modoCliente === 'existente' ? (
                    <div className="form-group">
                      <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
                        <option value="">Selecione seu cadastro...</option>
                        {clientes.filter(c => !c.hasUsuario).map((c) => (
                          <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div style={{ background: '#fafafa', border: '1px solid #ddd', padding: 12, borderRadius: 4, marginBottom: 12 }}>
                      <div className="form-group">
                        <label className="required">Nome completo</label>
                        <input type="text" value={novoCliente.nome}
                          onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
                          required placeholder="Seu nome completo" />
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
                          placeholder="seu@email.com" />
                      </div>
                    </div>
                  )}
                </>
              )}

              {tipo === 'tecnico' && (
                <div className="form-group">
                  <label>Técnico</label>
                  <select value={tecnicoId} onChange={(e) => setTecnicoId(e.target.value)} required>
                    <option value="">Selecione seu cadastro...</option>
                    {tecnicos.filter(t => !t.hasUsuario).map((t) => (
                      <option key={t.id} value={t.id}>{t.nome}</option>
                    ))}
                  </select>
                  {tecnicos.filter(t => !t.hasUsuario).length === 0 && (
                    <p style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Nenhum tecnico disponivel</p>
                  )}
                </div>
              )}
            </>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <br />
        <p>
          Já tem conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
