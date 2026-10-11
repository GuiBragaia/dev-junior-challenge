import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function hora(valor) {
  return new Date(valor).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function textoDoErro(data) {
  if (!data) return 'Não foi possível fazer o check-in'
  if (Array.isArray(data.message)) return data.message[0]
  if (data.message) return data.message
  return 'Não foi possível fazer o check-in'
}

export default function App() {
  const [cpf, setCpf] = useState('')
  const [fila, setFila] = useState([])
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function carregarFila() {
    const resposta = await fetch(`${API}/checkins`)
    if (!resposta.ok) {
      setErro('Não foi possível carregar a fila')
      return
    }
    setFila(await resposta.json())
  }

  useEffect(() => {
    carregarFila()
  }, [])

  async function aoEnviar(event) {
    event.preventDefault()
    setErro('')
    setEnviando(true)

    try {
      const resposta = await fetch(`${API}/checkins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf }),
      })
      const dados = await resposta.json().catch(() => null)

      if (!resposta.ok) {
        setErro(textoDoErro(dados))
        return
      }

      setCpf('')
      await carregarFila()
    } catch {
      setErro('Não foi possível falar com a API')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main>
      <h1>Check-in</h1>
      <p className="subtitulo">Informe o CPF para entrar na fila de hoje.</p>

      <form onSubmit={aoEnviar}>
        <label htmlFor="cpf">CPF</label>
        <div className="linha">
          <input
            id="cpf"
            value={cpf}
            onChange={(event) => setCpf(event.target.value)}
            placeholder="000.000.000-00"
            inputMode="numeric"
            autoComplete="off"
          />
          <button type="submit" disabled={enviando || cpf.trim() === ''}>
            {enviando ? 'Enviando...' : 'Confirmar'}
          </button>
        </div>
      </form>

      {erro ? <p className="erro">{erro}</p> : null}

      <h2>Fila de hoje</h2>
      {fila.length === 0 ? (
        <p className="vazio">Ninguém na fila ainda.</p>
      ) : (
        <ol>
          {fila.map((item) => (
            <li key={item.id}>
              <span>{item.nome}</span>
              <time>{hora(item.chegadaEm)}</time>
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}
