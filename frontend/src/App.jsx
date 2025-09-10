import React from 'react'
import { Link } from 'react-router-dom'

const HOUSES = [
  { key: 'gryffindor', name: 'Gryffindor', img: '/images/gryffindor.jpg', port: 5001 },
  { key: 'slytherin', name: 'Slytherin', img: '/images/slytherin.jpg', port: 5002 },
  { key: 'ravenclaw', name: 'Ravenclaw', img: '/images/ravenclaw.jpg', port: 5003 },
  { key: 'hufflepuff', name: 'Hufflepuff', img: '/images/hufflepuff.jpg', port: 5004 },
]

export default function App(){
  return (
    <div style={{fontFamily:'sans-serif'}}>
      <header style={{textAlign:'center', padding:20}}>
        <img src="/images/hero.jpg" alt="hero" style={{maxWidth:'100%',height:300,objectFit:'cover'}} />
        <h1>Welcome to the World of Harry Potter</h1>
        <p>Explore the houses — click any card to enter.</p>
      </header>

      <main style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,padding:20}}>
        {HOUSES.map(h=> (
          <Link to={'/houses/' + h.key} key={h.key} style={{textDecoration:'none',color:'inherit'}}>
            <div style={{border:'1px solid #ddd',borderRadius:8,overflow:'hidden'}}>
              <img src={h.img} alt={h.name} style={{width:'100%',height:180,objectFit:'cover'}}/>
              <div style={{padding:12}}>
                <h3>{h.name}</h3>
                <p>Click to explore {h.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  )
}
