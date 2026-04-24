import Link from 'next/link';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa';
import styles from './Footer.module.css';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/artists', label: 'Browse Artists' },
  { href: '/contact', label: 'Contact Us' },
];

const categories = [
  'DJ', 'Singer', 'Dancer', 'Comedian', 'Band',
  'Anchor', 'Musician', 'Magician', 'Stand-up Comic',
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.topBar} />
      <div className="container">
        <div className={styles.grid}>

          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <img src="/logo.png" alt="EntertainmentVibes" className={styles.logoImg} />
            </Link>
            <p className={styles.tagline}>
              India&apos;s premier 360° artist, celebrity &amp; live show management company — delivering curated talent and luxury entertainment experiences.
            </p>
            <div className={styles.socials}>
              <a href="https://instagram.com/artistvibes_entertainment" target="_blank" rel="noreferrer" aria-label="Instagram" className={styles.socialBtn}><FaInstagram /></a>
              <a href="https://facebook.com/ArtistvibesEntertainment" target="_blank" rel="noreferrer" aria-label="Facebook" className={styles.socialBtn}><FaFacebookF /></a>
              <a href="https://youtube.com/@ArtistvibesEntertainment" target="_blank" rel="noreferrer" aria-label="YouTube" className={styles.socialBtn}><FaYoutube /></a>
              <a href="https://wa.me/917204468429" target="_blank" rel="noreferrer" aria-label="WhatsApp" className={`${styles.socialBtn} ${styles.socialWhatsapp}`}><FaWhatsapp /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={styles.footerLink}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Artist Categories</h4>
            <ul className={styles.linkList}>
              {categories.map((c) => (
                <li key={c}>
                  <Link href={`/artists?category=${c}`} className={styles.footerLink}>{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Contact Us</h4>
            <ul className={styles.contactList}>
              <li>
                <FaMapMarkerAlt className={styles.contactIcon} />
                <span>Mumbai, Maharashtra, India</span>
              </li>
              <li>
                <FaPhoneAlt className={styles.contactIcon} />
                <a href="tel:+917204468429" className={styles.footerLink}>+91 72044 68429</a>
              </li>
              <li>
                <FaWhatsapp className={styles.contactIcon} />
                <a href="https://wa.me/917204468429" target="_blank" rel="noreferrer" className={styles.footerLink}>WhatsApp Us</a>
              </li>
              <li>
                <FaEnvelope className={styles.contactIcon} />
                <a href="mailto:entertainment.artistsbives@gmail.com" className={styles.footerLink}>AhanaAurora@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <p>© {year} EntertainmentVibes. All rights reserved.</p>
          <p>Made with ♥ in Mumbai, India</p>
        </div>
      </div>
    </footer>
  );
}
