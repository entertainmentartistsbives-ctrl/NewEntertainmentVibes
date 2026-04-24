'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa';
import styles from './Header.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/artists', label: 'Book Artists' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      {/* TOP BAR */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.socialWrap}>
            <div className={styles.socialIcons}>
              <a href="https://instagram.com/artistvibes_entertainment" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://facebook.com/ArtistvibesEntertainment" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://youtube.com/@ArtistvibesEntertainment" target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>
          <Link href="/" className={styles.logo}>
            <img src="/logo.png" alt="EntertainmentVibes" className={styles.logoImg} />
          </Link>
          <div className={styles.topRight}>
            <Link href="/contact" className={styles.contactBtn}>Contact Us</Link>
          </div>
        </div>
      </div>

      {/* MAIN NAV BAR */}
      <nav className={styles.navBar}>
        <div className={styles.navInner}>
          {/* Mobile: show logo in navbar */}
          <Link href="/" className={styles.mobileLogo}>
            <img src="/logo.png" alt="EntertainmentVibes" className={styles.mobileLogoImg} />
          </Link>

          <div className={styles.navLinks}>
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            suppressHydrationWarning
            className={styles.hamburger}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className={`${styles.mobileLink} ${pathname === link.href ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
