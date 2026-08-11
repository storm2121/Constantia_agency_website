'use client';

const allClients = [
  { name: 'Al Akhawayn University', logo: '/images/clients/al-akhawayn.svg' },
  { name: 'UNESCO', logo: '/images/clients/unesco.svg' },
  { name: 'United Nations', logo: '/images/clients/united-nations.svg' },
  { name: 'Masdar', logo: '/images/clients/masdar.svg' },
  { name: "Mohamed VI Foundation", logo: '/images/clients/mohamed-vi-foundation.svg' },
  { name: "L'blend", logo: '/images/clients/lblend.svg' },
  { name: 'Postera', logo: '/images/clients/postera.svg' },
  { name: 'Regisol', logo: '/images/clients/regisol.svg' },
  { name: 'Copima', logo: '/images/clients/copima.svg' },
  { name: 'Moroccan Innovation Circle', logo: '/images/clients/mic.svg' },
  { name: 'Groupe ESAI', logo: '/images/clients/esai.svg' },
  { name: 'Librabuzz', logo: '/images/clients/librabuzz.svg' },
];

export default function ClientsSection() {
  const track1 = [...allClients, ...allClients];
  const track2 = [...allClients].reverse().concat([...allClients].reverse());

  return (
    <section
      style={{
        background: '#cdcdcd',
        padding: '9rem 0',
        overflow: 'hidden',
        borderRadius: '20px 20px 0 0',
      }}
    >
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .client-logo {
          filter: grayscale(1);
          opacity: 0.4;
          transition: filter 0.4s ease, opacity 0.4s ease;
        }
        .client-logo:hover {
          filter: grayscale(0);
          opacity: 0.85;
        }
      `}</style>

      {/* Label */}
      <p style={{
        textAlign: 'center',
        fontFamily: 'var(--font-inter)',
        fontSize: '0.75rem',
        letterSpacing: '0.5em',
        textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.4)',
        marginBottom: '4rem',
      }}>
        Trusted by
      </p>

      {/* Track 1 — scrolls left */}
      <div style={{ overflow: 'hidden', marginBottom: '3rem' }}>
        <div style={{
          display: 'flex',
          gap: '4rem',
          width: 'max-content',
          animation: 'marquee-left 35s linear infinite',
        }}>
          {track1.map((client, i) => (
            <img
              key={i}
              src={client.logo}
              alt={client.name}
              className="client-logo"
              style={{ height: '28px', width: 'auto', flexShrink: 0 }}
            />
          ))}
        </div>
      </div>

      {/* Track 2 — scrolls right */}
      <div style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          gap: '4rem',
          width: 'max-content',
          animation: 'marquee-right 28s linear infinite',
        }}>
          {track2.map((client, i) => (
            <img
              key={i}
              src={client.logo}
              alt={client.name}
              className="client-logo"
              style={{ height: '28px', width: 'auto', flexShrink: 0 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
