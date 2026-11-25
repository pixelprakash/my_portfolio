// A "years of experience" mark: a large numeral beside a year-by-year scale.
//
// The numeral is lit from within and ribbed like the hero's glass. It can also
// take on a pill's world: `look="design"` prints it as a halftone layer with
// selection handles, `look="code"` fills it with falling characters.
// Every mark is drawn on the same scale (`outOf`), so 2 and 6 compare fairly.
import styles from './Years.module.css';

// A small tile of characters, drawn as an SVG, that repeats inside the numeral.
function codeTile() {
  const characters = Array.from('ア0イ1{ウ}エ<オ>カ=キ;ク/ケ*コ');
  let cells = '';
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 8; col++) {
      // fixed arithmetic, not random: the tile is the same on every render
      const glyph = characters[(col * 7 + row * 11) % characters.length];
      const head = (row + col * 3) % 9 === 0;
      const strength = head ? 1 : 0.35 + (((row * 5 + col * 3) % 7) / 7) * 0.65;
      const safe = glyph === '<' ? '&lt;' : glyph === '>' ? '&gt;' : glyph;
      cells += `<text x="${col * 8 + 4}" y="${row * 11.2 + 9}" fill="${head ? '#ffe6dd' : '#ff6a4a'}" fill-opacity="${strength.toFixed(2)}">${safe}</text>`;
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="112" font-family="monospace" font-size="9" font-weight="700" text-anchor="middle">${cells}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const CODE_TILE = codeTile();

export default function Years({ value, outOf, tone, look = 'light' }) {
  return (
    <p
      className={styles.years}
      data-tone={tone}
      data-look={look}
      style={{ '--code': CODE_TILE }}
    >
      <span className={styles.numeral}>
        <span className={styles.glow} aria-hidden="true">
          {value}
        </span>
        <span className={`${styles.face} ${styles.lit}`}>{value}</span>
        <span
          className={`${styles.face} ${tone === 'warm' ? styles.code : styles.print}`}
          aria-hidden="true"
        >
          {value}
        </span>
        {tone !== 'warm' && (
          <span className={styles.handles} aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        )}
      </span>

      <span className={styles.side}>
        <span className={styles.unit}>Years</span>
        <span className={styles.scale} aria-hidden="true">
          {Array.from({ length: outOf }, (_, i) => (
            <i key={i} className={i < value ? styles.on : undefined} style={{ '--i': i }} />
          ))}
        </span>
      </span>
    </p>
  );
}
