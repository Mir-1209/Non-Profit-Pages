export function SyneInstrumentSerif() {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#f5f0e8', fontFamily: "'Syne', sans-serif", padding: '0' }}>
      <div style={{ borderBottom: '1px solid #222', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: '20px', letterSpacing: '-0.01em' }}>GCL</span>
        <div style={{ display: 'flex', gap: '32px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>
          <span>Programs</span><span>Events</span><span>Chapters</span><span>About</span>
        </div>
        <button style={{ background: '#f5f0e8', color: '#0a0a0a', border: 'none', padding: '8px 20px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>Apply Now</button>
      </div>

      <div style={{ padding: '80px 40px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #333', padding: '5px 14px', marginBottom: '40px' }}>
          <span style={{ width: '6px', height: '6px', background: '#e8d5a3', borderRadius: '50%', display: 'inline-block' }}></span>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#888' }}>Font B — Syne + Instrument Serif</span>
        </div>

        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '76px', fontWeight: 400, lineHeight: '1.0', letterSpacing: '-0.01em', margin: '0 0 24px', maxWidth: '700px' }}>
          Where Capital<br /><span style={{ fontStyle: 'italic', color: '#e8d5a3' }}>Meets</span> Character.
        </h1>

        <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#999', maxWidth: '540px', margin: '0 0 48px', fontWeight: 400, letterSpacing: '0.01em' }}>
          The Global Capital League builds financial leaders through a curriculum grounded in behavioral economics, real-world investing, and peer accountability. Your edge starts here.
        </p>

        <div style={{ display: 'flex', gap: '48px', marginBottom: '56px' }}>
          {[['2,400+', 'Members Worldwide'], ['38', 'University Chapters'], ['94%', 'Graduate Placement']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '44px', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1, fontStyle: 'italic' }}>{n}</div>
              <div style={{ fontSize: '11px', color: '#666', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '6px', fontWeight: 600 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button style={{ background: '#e8d5a3', color: '#0a0a0a', border: 'none', padding: '14px 32px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>Apply for Summer '26</button>
          <button style={{ background: 'transparent', color: '#f5f0e8', border: '1px solid #333', padding: '14px 32px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>Explore Programs</button>
        </div>
      </div>

      <div style={{ margin: '0 40px', borderTop: '1px solid #1a1a1a', padding: '32px 0' }}>
        <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#555', fontFamily: "'Instrument Serif', serif", lineHeight: '1.6' }}>
          "The program changed how I think about money, risk, and leadership — all at once."
        </p>
        <p style={{ fontSize: '10px', color: '#444', marginTop: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>— Amir K., GCL Summer '25 · Now at Blackstone</p>
      </div>
    </div>
  );
}
