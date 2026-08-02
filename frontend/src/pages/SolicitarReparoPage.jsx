import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createAparelho, createServico } from '../api'

function SolicitarReparoPage() {
  const navigate = useNavigate()
  const [tipo, setTipo] = useState('')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [defeito, setDefeito] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)

    try {
      const aparelho = await createAparelho({
        tipo,
        marca: marca || null,
        modelo: modelo || null,
        defeitoRelatado: defeito || null
      })

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
        <h3>Descreva o aparelho com defeito</h3>
        <br />
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
      </div>
    </div>
  )
}

export default SolicitarReparoPage
