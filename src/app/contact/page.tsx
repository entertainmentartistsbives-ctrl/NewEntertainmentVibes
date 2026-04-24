'use client';

import { useState, useEffect, useRef } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaCheckCircle, FaPaperPlane, FaClock, FaHeadset } from 'react-icons/fa';
import styles from './contact.module.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone: form.phone, message: form.message }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const infoCards = [
    {
      icon: <FaPhoneAlt />,
      label: 'Call Us',
      value: '+91 72044 68429',
      sub: 'Mon – Sat, 10am – 8pm',
      href: 'tel:+917204468429',
      color: '#d4a843',
    },
    {
      icon: <FaWhatsapp />,
      label: 'WhatsApp',
      value: 'Chat Instantly',
      sub: 'Fastest response',
      href: 'https://wa.me/917204468429',
      color: '#25d366',
    },
    {
      icon: <FaEnvelope />,
      label: 'Email',
      value: 'artistmanager',
      sub: 'AhanaAurora@gmail.com',
      href: 'mailto:entertainment.artistsbives@gmail.com',
      color: '#6c63ff',
    },
    {
      icon: <FaMapMarkerAlt />,
      label: 'Office',
      value: 'Mumbai HQ',
      sub: 'Suite 405, Premium Park',
      href: 'https://maps.google.com/?q=Mumbai+Maharashtra+400001',
      color: '#ef4444',
    },
  ];

  return (
    <>
      <div className={styles.page}>
        {/* ── Animated Background ── */}
        <div className={styles.bgLayer}>
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.orb3} />
          <div className={styles.gridLines} />
        </div>

        {/* ── HERO ── */}
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <div className={`${styles.badge} ${visible ? styles.fadeIn : ''}`}>
              <FaHeadset className={styles.badgeIcon} />
              <span>We're here 7 days a week</span>
            </div>
            <h1 className={`${styles.heroTitle} ${visible ? styles.slideUp : ''}`}>
              Let's Create Something
              <span className={styles.titleGlow}> Extraordinary</span>
            </h1>
            <p className={`${styles.heroSub} ${visible ? styles.slideUp2 : ''}`}>
              Tell us about your event. Our booking specialists respond within 2 hours.
            </p>

            {/* Floating stat pills */}
            <div className={`${styles.stats} ${visible ? styles.slideUp3 : ''}`}>
              {[['500+', 'Events Booked'], ['200+', 'Artists'], ['4.9★', 'Rating']].map(([num, label]) => (
                <div key={label} className={styles.statPill}>
                  <span className={styles.statNum}>{num}</span>
                  <span className={styles.statLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className={styles.scrollIndicator}>
            <div className={styles.scrollDot} />
          </div>
        </section>

        {/* ── INFO CARDS ── */}
        <section className={styles.cardsSection}>
          <div className="container">
            <div className={styles.cardsGrid}>
              {infoCards.map((card, i) => (
                <a
                  key={card.label}
                  href={card.href}
                  target={card.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className={styles.infoCard}
                  style={{ '--card-color': card.color, '--delay': `${i * 0.1}s` } as React.CSSProperties}
                >
                  <div className={styles.infoCardGlow} />
                  <div className={styles.infoIconWrap}>
                    {card.icon}
                  </div>
                  <div className={styles.infoCardText}>
                    <span className={styles.infoLabel}>{card.label}</span>
                    <span className={styles.infoValue}>{card.value}</span>
                    <span className={styles.infoSub}>{card.sub}</span>
                  </div>
                  <div className={styles.infoArrow}>→</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT ── */}
        <section className={styles.mainSection} ref={sectionRef}>
          <div className="container">
            <div className={styles.mainGrid}>

              {/* LEFT — Details */}
              <div className={styles.leftCol}>
                <div className={styles.sectionLabel}>Our Office</div>
                <h2 className={styles.leftTitle}>Visit Us Anytime</h2>
                <p className={styles.leftDesc}>
                  Drop by our Mumbai headquarters or connect digitally — we're always just a message away.
                </p>

                <div className={styles.hoursCard}>
                  <FaClock className={styles.hoursIcon} />
                  <div>
                    <div className={styles.hoursTitle}>Business Hours</div>
                    <div className={styles.hoursRow}><span className={styles.day}>Mon – Fri</span><span className={styles.time}>10:00 AM – 8:00 PM</span></div>
                    <div className={styles.hoursRow}><span className={styles.day}>Saturday</span><span className={styles.time}>11:00 AM – 6:00 PM</span></div>
                    <div className={styles.hoursRow}><span className={styles.day}>Sunday</span><span className={`${styles.time} ${styles.closed}`}>By Appointment</span></div>
                  </div>
                </div>

                {/* Map */}
                <div className={styles.mapWrap}>
                  <div className={styles.mapOverlay}>
                    <a
                      href="https://maps.google.com/?q=Mumbai+Maharashtra+400001"
                      target="_blank"
                      rel="noreferrer"
                      className={`btn btn-secondary ${styles.mapBtn}`}
                    >
                      <FaMapMarkerAlt /> Open in Maps
                    </a>
                  </div>
                  <img
                    src="https://img.freepik.com/premium-photo/gateway-india-mumbai-india_78361-17139.jpg"
                    alt="Mumbai Office - Gateway of India"
                    className={styles.mapImg}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=600&auto=format&fit=crop';
                    }}
                  />
                  <div className={styles.mapPin}>
                    <FaMapMarkerAlt />
                    <span>Mumbai HQ</span>
                  </div>
                </div>
              </div>

              {/* RIGHT — Form */}
              <div className={styles.rightCol}>
                <div className={styles.formCard}>
                  <div className={styles.formGlow} />
                  <div className={styles.formCardTop}>
                    <div className={styles.formCardDots}>
                      <span /><span /><span />
                    </div>
                    <span className={styles.formCardTag}>Secure Contact Form</span>
                  </div>

                  {success ? (
                    <div className={styles.successState}>
                      <div className={styles.successRing}>
                        <FaCheckCircle className={styles.successIcon} />
                      </div>
                      <h3 className={styles.successTitle}>Message Sent! 🎉</h3>
                      <p className={styles.successText}>
                        Thank you for reaching out. Our team will get back to you within 2 hours.
                      </p>
                      <button onClick={() => setSuccess(false)} className={`btn btn-secondary ${styles.retryBtn}`}>
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                      <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Send a Message</h2>
                        <p className={styles.formSubtitle}>We reply within 2 hours on business days</p>
                      </div>

                      {error && <div className="alert alert-error">{error}</div>}

                      <div className={styles.formRow}>
                        <div className={`${styles.fieldWrap} ${focused === 'name' ? styles.fieldFocused : ''} ${form.name ? styles.fieldFilled : ''}`}>
                          <label className={styles.floatLabel}>Full Name</label>
                          <input
                            id="contact-name"
                            name="name"
                            className={styles.field}
                            value={form.name}
                            onChange={handleChange}
                            onFocus={() => setFocused('name')}
                            onBlur={() => setFocused(null)}
                            required
                            autoComplete="name"
                          />
                          <div className={styles.fieldBar} />
                        </div>

                        <div className={`${styles.fieldWrap} ${focused === 'phone' ? styles.fieldFocused : ''} ${form.phone ? styles.fieldFilled : ''}`}>
                          <label className={styles.floatLabel}>Phone Number</label>
                          <input
                            id="contact-phone"
                            name="phone"
                            className={styles.field}
                            value={form.phone}
                            onChange={handleChange}
                            onFocus={() => setFocused('phone')}
                            onBlur={() => setFocused(null)}
                            required
                            autoComplete="tel"
                          />
                          <div className={styles.fieldBar} />
                        </div>
                      </div>

                      <div className={`${styles.fieldWrap} ${focused === 'email' ? styles.fieldFocused : ''} ${form.email ? styles.fieldFilled : ''}`}>
                        <label className={styles.floatLabel}>Email Address</label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          className={styles.field}
                          value={form.email}
                          onChange={handleChange}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused(null)}
                          autoComplete="email"
                        />
                        <div className={styles.fieldBar} />
                      </div>

                      <div className={`${styles.fieldWrap} ${focused === 'message' ? styles.fieldFocused : ''} ${form.message ? styles.fieldFilled : ''}`}>
                        <label className={styles.floatLabel}>Your Inquiry</label>
                        <textarea
                          id="contact-message"
                          name="message"
                          className={`${styles.field} ${styles.textarea}`}
                          value={form.message}
                          onChange={handleChange}
                          onFocus={() => setFocused('message')}
                          onBlur={() => setFocused(null)}
                          rows={5}
                          required
                        />
                        <div className={styles.fieldBar} />
                      </div>

                      <button
                        type="submit"
                        id="contact-submit"
                        className={styles.submitBtn}
                        disabled={loading}
                      >
                        {loading ? (
                          <span className={styles.loadingDots}>
                            <span /><span /><span />
                          </span>
                        ) : (
                          <>
                            <FaPaperPlane className={styles.sendIcon} />
                            Send Message
                          </>
                        )}
                        <div className={styles.btnShine} />
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </>
  );
}
