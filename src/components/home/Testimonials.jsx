import { testimonials } from '../../data/testimonials';
import styles from './Testimonials.module.css';

function initialsOf(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className={styles.section}
      aria-labelledby="testimonials-heading"
    >
      <div className="section-container">
        <div className={styles.header}>
          <span className="kicker">Testimonials</span>
          <h2 id="testimonials-heading" className={styles.heading}>
            What people say about working together
          </h2>
        </div>

        <ul className={styles.grid}>
          {testimonials.map((testimonial) => {
            const isBlue = testimonial.accent === 'blue';
            return (
              <li
                className={styles.card}
                key={`${testimonial.name}-${testimonial.company}`}
              >
                <p className={styles.quote}>{testimonial.quote}</p>
                <div className={styles.person}>
                  <span
                    className={`${styles.avatar} ${isBlue ? styles.avatarBlue : styles.avatarRed}`}
                    aria-hidden="true"
                  >
                    {initialsOf(testimonial.name)}
                  </span>
                  <div>
                    <p className={styles.name}>{testimonial.name}</p>
                    <p className={styles.role}>
                      {testimonial.role} · {testimonial.company}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
