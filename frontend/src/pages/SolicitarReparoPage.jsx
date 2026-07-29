import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createAparelho, createServico, getAparelhos } from '../api'

function SolicitarReparoPage() {
  const navigate = useNavigate()
  const [modo, setModo] = useState('novo')
  const [aparelhos, setAparelhos] = useState([])
  const [aparelhoId, setAparelhoId] = useState('')
  const [tipo, setTipo] = useState('')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [defeito, setDefeito] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAparelhos().then(setAparelhos).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)

    try {
      let aparelho
      if (modo === 'existente') {
        aparelho = { id: parseInt(aparelhoId) }
      } else {
        aparelho = await createAparelho({
          tipo,
          marca: marca || null,
          modelo: modelo || null,
          defeitoRelatado: defeito || null
        })
      }

      await createServico({
        status: 'PENDENTE',
        aparelho: { id: aparelho.id }
      })

      navigate('/meus-aparelhos')
    } catch (error) {
      console.log(error)
      setErr(error.response?.data?.error || 'Erro ao solicitar reparo')
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Solicitar Reparo</h2>
      </div>

      {err && <div className="alert-error">{err}</div>}

      <div className="form-card">
        <div className="form-group">
          <label>Tipo de solicitacao</label>
          <div style={{ display: 'flex', gap: '15px', marginTop: 4 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 'normal' }}>
              <input type="radio" name="modo" checked={modo === 'novo'} onChange={() => setModo('novo')} style={{ width: 'auto' }} />
              Aparelho novo
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 'normal' }}>
              <input type="radio" name="modo" checked={modo === 'existente'} onChange={() => setModo('existente')} style={{ width: 'auto' }} />
              Aparelho ja cadastrado
            </label>
          </div>
        </div>

        <br />

        {modo === 'existente' ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="required">Selecione o aparelho</label>
              <select value={aparelhoId} onChange={(e) => setAparelhoId(e.target.value)} required>
                <option value="">Escolha um aparelho...</option>
                {aparelhos.map(a => (
                  <option key={a.id} value={a.id}>{a.tipo} / {a.marca} / {a.modelo || 'sem modelo'}</option>
                ))}
              </select>
              {aparelhos.length === 0 && (
                <p style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Nenhum aparelho cadastrado</p>
              )}
            </div>
            <div className="form-group">
              <label className="required">Defeito relatado</label>
              <textarea
                value={defeito}
                onChange={(e) => setDefeito(e.target.value)}
                required
                placeholder="Descreva o problema..."
                rows={4}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Enviando...' : 'Solicitar'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/meus-aparelhos')}>
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
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
                placeholder="Modelo do aparelho"
              />
            </div>
            <div className="form-group">
              <label className="required">Defeito relatado</label>
              <textarea
                value={defeito}
                onChange={(e) => setDefeito(e.target.value)}
                required
                placeholder="Descreva o problema..."
                rows={4}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Enviando...' : 'Solicitar'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/meus-aparelhos')}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default SolicitarReparoPage
