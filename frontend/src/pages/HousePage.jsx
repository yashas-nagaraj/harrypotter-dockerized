import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const PORT_MAP = {
  gryffindor: 5001,
  slytherin: 5002,
  ravenclaw: 5003,
  hufflepuff: 5004,
}

export default function HousePage(){
  const { house } = useParams()
  const [info, setInfo] = useState(null)
  const [question, setQuestion] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(()=>{
    const port = PORT_MAP[house]
    fetch(`http://localhost:${port}/info`).then(r=>r.json()).then(setInfo)
  },[house])

  const submit = async () => {
    const port = PORT_MAP[house]
    await fetch(`http://localhost:${port}/questions`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ question })
    })
    setSubmitted(true)
    setQuestion('')
  }

  if(!info) return <div>Loading...</div>
  return (
    <div style={{padding:20,fontFamily:'sans-serif'}}>
      <h2>{info.house}</h2>
      <img src={`/images/${house}.jpg`} alt={info.house} style={{maxWidth:600,width:'100%',height:300,objectFit:'cover'}}/>
      <p>{info.history}</p>

      <h3>Ask a question about {info.house}</h3>
      {submitted ? <div>Thanks — your question was saved.</div> : (
        <div>
          <textarea value={question} onChange={e=>setQuestion(e.target.value)} rows={4} cols={60}></textarea>
          <br/>
          <button onClick={submit}>Submit question</button>
        </div>
      )}
    </div>
  )
}
