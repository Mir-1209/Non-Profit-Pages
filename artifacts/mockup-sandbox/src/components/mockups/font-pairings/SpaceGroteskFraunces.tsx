export function SpaceGroteskFraunces() {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#f5f0e8', fontFamily: "'Space Grotesk', sans-serif", padding: '0' }}>
      <div style={{ borderBottom: '1px solid #222', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em' }}>GCL</span>
        <div style={{ display: 'flex', gap: '32px', fontSize: '13px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888' }}>
          <span>Programs</span><span>Events</span><span>Chapters</span><span>About</span>
        </div>
        <button style={{ background: '#f5f0e8', color: '#0a0a0a', border: 'none', padding: '8px 20px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>Apply Now</button>
      </div>

      <div style={{ padding: '80px 40px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #333', padding: '5px 14px', marginBottom: '40px' }}>
          <span style={{ width: '6px', height: '6px', background: '#c8a96e', borderRadius: '50%', display: 'inline-block' }}></span>
          <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>Font A — Space Grotesk + Fraunces</span>
        </div>

        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '72px', fontWeight: 800, lineHeight: '1.0', letterSpacing: '-0.03em', margin: '0 0 24px', maxWidth: '680px' }}>
          Where Capital<br /><em style={{ fontStyle: 'italic', color: '#c8a96e' }}>Meets</em> Character.
        </h1>

        <p style={{ fontSize: '16px', lineHeight: '1.75', color: '#aaa', maxWidth: '560px', margin: '0 0 48px', fontWeight: 400 }}>
          The Global Capital League builds financial leaders through a curriculum grounded in behavioral economics, real-world investing, and peer accountability. Your edge starts here.
        </p>

        <div style={{ display: 'flex', gap: '48px', marginBottom: '56px' }}>
          {[['2,400+', 'Members Worldwide'], ['38', 'University Chapters'], ['94%', 'Graduate Placement']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: '42px', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: '12px', color: '#666', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '6px', fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button style={{ background: '#c8a96e', color: '#0a0a0a', border: 'none', padding: '14px 32px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>Apply for Summer '26</button>
          <button style={{ background: 'transparent', color: '#f5f0e8', border: '1px solid #333', padding: '14px 32px', fontSize: '13px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>Explore Programs</button>
        </div>
      </div>

      <div style={{ margin: '0 40px', borderTop: '1px solid #1a1a1a', padding: '32px 0' }}>
        <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#555', fontFamily: "'Fraunces', serif" }}>
          "The program changed how I think about money, risk, and leadership — all at once."
        </p>
        <p style={{ fontSize: '11px', color: '#444', marginTop: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>— Amir K., GCL Summer '25 · Now at Blackstone</p>
      </div>
    </div>
  );
}
