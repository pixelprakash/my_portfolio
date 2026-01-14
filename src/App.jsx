import { useEffect, useRef } from 'react';

function MatrixRain({ color = '#00ff00', opacity = 0.4, speed = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += speed * 0.5;
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: opacity
      }}
    />
  );
}

export default function App() {
  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100vh',
      backgroundColor: '#000000',
      margin: 0,
      padding: 0,
      fontFamily: '"Michroma", sans-serif',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Split Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          zIndex: 1
        }}>
          {/* Blue (Designer) Side */}
          <div style={{
            flex: 1,
            background: 'linear-gradient(135deg, #001f3f 0%, #003d7a 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <MatrixRain color="#00d4ff" opacity={0.5} speed={1.2} />
          </div>
          
          {/* Red (Developer) Side */}
          <div style={{
            flex: 1,
            background: 'linear-gradient(135deg, #4a0000 0%, #8b0000 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <MatrixRain color="#ff0033" opacity={0.5} speed={1.2} />
          </div>
        </div>

        {/* Content Container */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: '1400px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3rem'
        }}>
          {/* Center Name - Top */}
          <div style={{
            textAlign: 'center',
            padding: '2rem 3rem',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
            width: '100%',
            maxWidth: '600px'
          }}>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 700,
              margin: '0 0 0.5rem 0',
              background: 'linear-gradient(90deg, #00d4ff, #ffffff, #ff0033)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '1px'
            }}>
              Surya Prakash Musunuri
            </h1>
            <p style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              color: '#888',
              margin: '0.5rem 0',
              fontFamily: 'system-ui, sans-serif'
            }}>
              Working at DIC, Design Department
            </p>
            <p style={{
              fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
              color: '#666',
              margin: 0,
              fontFamily: 'system-ui, sans-serif'
            }}>
              IIT Hyderabad
            </p>
          </div>

          {/* Pills Container */}
          <div className="pills-container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            width: '100%',
            maxWidth: '1000px'
          }}>
            {/* Designer Side (Blue Pill) */}
            <div style={{
              textAlign: 'center',
              padding: '3rem 2rem',
              background: 'rgba(0, 100, 200, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '2px solid rgba(0, 212, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 212, 255, 0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 212, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 212, 255, 0.2)';
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #00d4ff, #0066cc)',
                boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                💊
              </div>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 700,
                color: '#00d4ff',
                margin: '0 0 1rem 0',
                textShadow: '0 0 20px rgba(0, 212, 255, 0.8)',
                letterSpacing: '2px'
              }}>
                Designer
              </h2>
              <div style={{
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
                margin: '1rem auto',
                boxShadow: '0 0 10px #00d4ff'
              }} />
              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: '#a0d8f0',
                margin: '1rem 0',
                fontFamily: 'system-ui, sans-serif'
              }}>
                UX/UI Designer
              </p>
              <p style={{
                fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                color: '#6da8c8',
                margin: '0.5rem 0',
                fontFamily: 'system-ui, sans-serif',
                fontStyle: 'italic'
              }}>
                "The blue pill"
              </p>
            </div>

            {/* Developer Side (Red Pill) */}
            <div style={{
              textAlign: 'center',
              padding: '3rem 2rem',
              background: 'rgba(200, 0, 0, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '2px solid rgba(255, 0, 51, 0.3)',
              boxShadow: '0 8px 32px rgba(255, 0, 51, 0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 12px 48px rgba(255, 0, 51, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 0, 51, 0.2)';
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #ff0033, #cc0000)',
                boxShadow: '0 0 40px rgba(255, 0, 51, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                💊
              </div>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 700,
                color: '#ff0033',
                margin: '0 0 1rem 0',
                textShadow: '0 0 20px rgba(255, 0, 51, 0.8)',
                letterSpacing: '2px'
              }}>
                Developer
              </h2>
              <div style={{
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, transparent, #ff0033, transparent)',
                margin: '1rem auto',
                boxShadow: '0 0 10px #ff0033'
              }} />
              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: '#f0a0a8',
                margin: '1rem 0',
                fontFamily: 'system-ui, sans-serif'
              }}>
                Full Stack Developer
              </p>
              <p style={{
                fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                color: '#c86870',
                margin: '0.5rem 0',
                fontFamily: 'system-ui, sans-serif',
                fontStyle: 'italic'
              }}>
                "The red pill"
              </p>
            </div>
          </div>
        </div>

        {/* Responsive Styles */}
        <style>{`
          @media (max-width: 768px) {
            .pills-container {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}