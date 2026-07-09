import React, { useState } from "react";

function TarjetaContacto({ nombre, linkedinURL, rol, foto }) {
  const [encima, setEncima] = useState(false);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div 
        onMouseEnter={() => setEncima(true)}
        onMouseLeave={() => setEncima(false)}
        style={{
          backgroundColor: '#9cc5ee', 
          borderRadius: '12px',
          padding: '20px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '10px',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          transform: encima ? 'translateY(-8px)' : 'translateY(0)',
          boxShadow: encima ? '0 12px 24px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        <img 
          src={foto} 
          alt={nombre} 
          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} 
        />
        <div>
          <h6 style={{ margin: '5px 0', fontWeight: 'bold', fontSize: '1.1rem' }}>{nombre}</h6>
          <p style={{ margin: '2px 0', color: '#666', fontSize: '0.9rem' }}>{rol}</p>
          <small style={{ color: '#007bff', fontSize: '0.8rem' }}>{linkedinURL}</small>
        </div>
      </div>
    </div>
  );
}

export default TarjetaContacto;
