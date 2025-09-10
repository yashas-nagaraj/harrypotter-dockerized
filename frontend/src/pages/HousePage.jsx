cat > frontend/src/pages/HousePage.jsx <<'EOF'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function HousePage(){
  const { house } = useParams()

  const [info, setInfo] = useState(null)
  const [questions, setQuestions] = useState([])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    setError(null)

    ;(async () => {
      try {
        const infoResp = await fetch('/api/' + house + '/info')
        if (!infoResp.ok) throw new Error('Failed to load house info')
        const infoJson = await infoResp.json()

        const qResp = await fetch('/api/' + house + '/questions')
        const qJson = qResp.ok ? await qResp.json() : []

        if (mounted) {
          setInfo(infoJson)
          setQuestions(qJson)
        }
      } catch (e) {
        if (mounted) setError(e.message || 'An error occurred')
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => { mounted = false }
  }, [house])

  const submit = async () => {
    if (!question.trim()) return setError('Please enter a question')
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/' + house + '/questions', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ question: question })
      })
      if (!res.ok) throw new Error('Submit failed')
      const saved = await res.json()
      setQuestions(prev => [saved, ...prev])
      setSubmitted(true)
      setQuestion('')
    } catch (e) {
      setError(e.message || 'Failed to submit')
    } finally {
      setSubmitting(false)
      setTimeout(()=>setSubmitted(false), 2500)
    }
  }

  if (loading) return <div style={{padding:20}}>Loading...</div>
  if (error && !info) return <div style={{padding:20}}><strong>Error:</strong> {error}</div>
  if (!info) return <div style={{padding:20}}>No info available.</div>

  return (
    <div style={{padding:20,fontFamily:'sans-serif'}}>
      <h2>{info.house}</h2>
      <img
        src={'/images/' + house + '.jpg'}
        alt={info.house + ' banner'}
        style={{maxWidth:600,width:'100%',height:300,objectFit:'cover'}}
        loading="lazy"
      />
      <p>{info.history}</p>

      <h3>Ask a question about {info.house}</h3>
      {submitted && <div style={{color:'green', marginBottom:8}}>Thanks — your question was saved.</div>}
      {error && <div style={{color:'crimson', marginBottom:8}}>{error}</div>}
      <div>
        <textarea
          value={question}
          onChange={e=>setQuestion(e.target.value)}
          rows={4}
          cols={60}
          placeholder={'Ask something about ' + info.house + '...'}
          disabled={submitting}
        />
        <br/>
        <button onClick={submit} disabled={submitting || question.trim() === ''}>
          {submitting ? 'Submitting...' : 'Submit question'}
        </button>
      </div>

      <h3 style={{marginTop:24}}>Recent questions</h3>
      {questions.length === 0 ? (
        <div>No questions yet — be the first to ask!</div>
      ) : (
        <ul>
          {questions.map(q => (
            <li key={q.id || (q.created_at + Math.random())} style={{marginBottom:8}}>
              <div style={{fontSize:14}}>{q.question_text || q.question}</div>
              <div style={{fontSize:12, color:'#666'}}>{new Date(q.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
EOF
