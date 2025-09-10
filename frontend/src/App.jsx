import React from 'react'
import { Link } from 'react-router-dom'

const HOUSES = [
  { key: 'gryffindor', name: 'Gryffindor', img: '/images/gryffindor.jpg' },
  { key: 'slytherin', name: 'Slytherin', img: '/images/slytherin.jpg' },
  { key: 'ravenclaw', name: 'Ravenclaw', img: '/images/ravenclaw.jpg' },
  { key: 'hufflepuff', name: 'Hufflepuff', img: '/images/hufflepuff.jpg' },
]

export default function App(){
  return (
    <div style={{fontFamily:'sans-serif'}}>
      <header style={{textAlign:'center', padding:20}}>
        <img
          src="/images/hero.jpg"
          alt="Welcome: World of Harry Potter"
          style={{maxWidth:'100%',height:300,objectFit:'cover'}}
          loading="lazy"
        />
        <h1>Welcome to the World of Harry Potter</h1>
        <p>Explore the houses — click any card to enter.</p>
      </header>

      <main style={{
        display:'grid',
        gridTemplateColumns:'repeat(4,1fr)',
        gap:16,
        padding:20,
        /* responsive fallback */
        gridAutoRows: 'minmax(0, auto)'
      }}>
        {HOUSES.map(h=> (
          <Link
            to={'/houses/' + h.key}
            key={h.key}
            style={{textDecoration:'none',color:'inherit'}}
            aria-label={`Explore ${h.name}`}
          >
            <article style={{border:'1px solid #ddd',borderRadius:8,overflow:'hidden',background:'#fff'}}>
              <img
                src={h.img}
                alt={`${h.name} banner`}
                style={{width:'100%',height:180,objectFit:'cover'}}
                loading="lazy"
              />
              <div style={{padding:12}}>
                <h3 style={{margin:'0 0 8px 0'}}>{h.name}</h3>
                <p style={{margin:0}}>Click to explore {h.name}</p>
              </div>
            </article>
          </Link>
        ))}
      </main>

      <style>{`
        /* small-screen responsive: 1 column under 640px, 2 under 900px */
        @media (max-width: 640px) {
          main { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          main { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}

