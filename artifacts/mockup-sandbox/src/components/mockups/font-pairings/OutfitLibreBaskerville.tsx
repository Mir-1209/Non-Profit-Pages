export function OutfitLibreBaskerville() {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#f5f0e8', fontFamily: "'Outfit', sans-serif", padding: '0' }}>
      <div style={{ borderBottom: '1px solid #222', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, fontSize: '17px', letterSpacing: '0.06em' }}>GCL</span>
        <div style={{ display: 'flex', gap: '32px', fontSize: '13px', fontWeight: 300, letterSpacing: '0.04em', color: '#888' }}>
          <span>Programs</span><span>Events</span><span>Chapters</span><span>About</span>
        </div>
        <button style={{ background: '#f5f0e8', color: '#0a0a0a', border: 'none', padding: '8px 20px', fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em', cursor: 'pointer', fontFamily: 'inherit' }}>Apply Now</button>
      </div>

      <div style={{ padding: '80px 40px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #333', padding: '5px 14px', marginBottom: '40px' }}>
          <span style={{ width: '6px', height: '6px', background: '#d4a96a', borderRadius: '50%', display: 'inline-block' }}></span>
          <span style={{ fontSize: '11px', fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>Font D — Outfit + Libre Baskerville</span>
        </div>

        <h1 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '68px', fontWeight: 700, lineHeight: '1.05', letterSpacing: '-0.02em', margin: '0 0 26px', maxWidth: '660px' }}>
          Where Capital<br /><em style={{ fontStyle: 'italic', color: '#d4a96a', fontWeight: 400 }}>Meets</em> Character.
        </h1>

        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#aaa', maxWidth: '540px', margin: '0 0 48px', fontWeight: 300, letterSpacing: '0.01em' }}>
          The Global Capital League builds financial leaders through a curriculum grounded in behavioral economics, real-world investing, and peer accountability. Your edge starts here.
        </p>

        <div style={{ display: 'flex', gap: '48px', marginBottom: '56px' }}>
          {[['2,400+', 'Members Worldwide'], ['38', 'University Chapters'], ['94%', 'Graduate Placement']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '40px', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: '11px', color: '#666', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '6px', fontWeight: 300 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button style={{ background: '#d4a96a', color: '#0a0a0a', border: 'none', padding: '14px 32px', fontSize: '13px', fontWeight: 500, letterSpacing: '0.06em', cursor: 'pointer', fontFamily: 'inherit' }}>Apply for Summer '26</button>
          <button style={{ background: 'transparent', color: '#f5f0e8', border: '1px solid #333', padding: '14px 32px', fontSize: '13px', fontWeight: 300, letterSpacing: '0.06em', cursor: 'pointer', fontFamily: 'inherit' }}>Explore Programs</button>
        </div>
      </div>

      <div style={{ margin: '0 40px', borderTop: '1px solid #1a1a1a', padding: '32px 0' }}>
        <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#555', fontFamily: "'Libre Baskerville', serif", fontWeight: 400, lineHeight: '1.7' }}>
          "The program changed how I think about money, risk, and leadership — all at once."
        </p>
        <p style={{ fontSize: '11px', color: '#444', marginTop: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 300 }}>— Amir K., GCL Summer '25 · Now at Blackstone</p>
      </div>
    </div>
  );
}
