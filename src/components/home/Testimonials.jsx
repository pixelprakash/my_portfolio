import { testimonials } from '../../data/testimonials';
import Reveal from '../common/Reveal';
import styles from './Testimonials.module.css';

function initialsOf(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function QuoteMark() {
  return (
    <svg
      className={styles.mark}
      width="44"
      height="33"
      viewBox="0 0 48 36"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M0 36V21.6C0 9.6 6.4 2.4 19.2 0l2.4 5.4C14.4 7.2 11.4 11.4 11.4 16.2H21V36H0zm27 0V21.6C27 9.6 33.4 2.4 46.2 0l2.4 5.4c-7.2 1.8-10.2 6-10.2 10.8H48V36H27z" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className={styles.section}
      aria-labelledby="testimonials-heading"
    >
      <div className="section-container">
        <Reveal className={styles.header}>
          <span className="kicker">Testimonials</span>
          <h2 id="testimonials-heading" className={styles.heading}>
            What people say about working together
          </h2>
        </Reveal>

        <ul className={styles.grid}>
          {testimonials.map((testimonial, index) => {
            const isBlue = testimonial.accent === 'blue';
            return (
              <Reveal
                as="li"
                key={`${testimonial.name}-${index}`}
                delay={Math.min(index, 3) * 90}
                className={`${styles.item} ${testimonial.featured ? styles.itemFeatured : ''}`}
              >
                <figure
                  className={`${styles.card} ${isBlue ? styles.cardBlue : styles.cardRed} ${
                    testimonial.featured ? styles.cardFeatured : ''
                  }`}
                >
                  <QuoteMark />
                  <blockquote className={styles.quote}>
                    <p>{testimonial.quote}</p>
                  </blockquote>
                  <figcaption className={styles.person}>
                    <span className={styles.avatar} aria-hidden="true">
                      {initialsOf(testimonial.name)}
                    </span>
                    <span className={styles.who}>
                      <span className={styles.name}>{testimonial.name}</span>
                      <span className={styles.role}>
                        {testimonial.role} · {testimonial.company}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
