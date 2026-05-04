import Link from "next/link";
import { FaStar, FaMusic, FaHandshake, FaHeart, FaGlobeAsia, FaGem, FaUsers, FaAward, FaArrowRight } from "react-icons/fa";
import styles from "./about.module.css";
import StatsBar from "./StatsBar";







/* ── Values data ─────────────────────────────────────── */
const values = [
  { icon: <FaGem />, title: "Premium Quality", desc: "We curate only the finest talent, ensuring every performance exceeds expectations and creates lasting memories." },
  { icon: <FaHandshake />, title: "Trust & Transparency", desc: "Clear communication, honest pricing, and reliable service form the foundation of every client relationship." },
  { icon: <FaHeart />, title: "Passion Driven", desc: "Our team is fueled by a genuine love for music and entertainment, delivering heartfelt experiences every time." },
  { icon: <FaGlobeAsia />, title: "Pan-India Reach", desc: "From intimate gatherings to grand celebrations, we deliver exceptional entertainment experiences across the nation." },
];

/* ── Founder data ────────────────────────────────────── */
const founder = {
  name: "Ahana Aura",
  role: "Founder & CEO",
  image: "/founder.jpg",
  bio: [
    "Ahana Aura is a leading name in the live entertainment and artist management industry, known for delivering exceptional musical experiences and professionally curated events. As the founder of EntertainmentVibes, he has established a strong presence in managing artists, organizing concerts, and executing high-impact events across India and internationally.",
    "With years of industry experience, Ahana specializes in artist bookings, live concerts, college shows, and corporate entertainment solutions. Her ability to understand audience preferences and match them with the right talent has made her a trusted partner for event organizers and brands.",
    "From managing national tours to international performances, Ahana has worked closely with renowned artists and emerging talents, ensuring smooth execution and memorable performances. Her strong network, attention to detail, and commitment to excellence set her apart in the entertainment space.",
  ],
  tags: ["Artist Management", "Event Production", "Pan-India Network"],
  social: {
    instagram: "https://www.instagram.com/auraahana/",
    facebook: "https://www.facebook.com/profile.php?id=100056046458184",
    linkedin: "https://www.linkedin.com/in/ahana-aura-109528271/",
  },
};

export default function AboutPage() {

  return (
    <>
      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <img
          src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop"
          alt="Concert stage"
          className={styles.heroBgImage}
        />
        <div className={`container ${styles.heroContent}`}>
          <span className={styles.heroTag}>About EntertainmentVibes</span>
          <h1 className={styles.heroTitle}>
            Crafting Unforgettable <br />
            <span className="text-gradient">Entertainment Experiences</span>
          </h1>
          <p className={styles.heroSubtitle}>
            India&apos;s most trusted 360° artist & celebrity management company.
            We connect extraordinary talent with extraordinary events — from
            intimate gatherings to grand celebrations.
          </p>
          <div className={styles.heroActions}>
            <Link href="/artists" className="btn btn-primary">
              Explore Artists <FaArrowRight />
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS BAR ═══════════════════ */}
      <StatsBar />

      {/* ═══════════════════ OUR STORY ═══════════════════ */}
      <section className={styles.storySection}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyImages}>
              <div className={styles.storyImagePrimary}>
                <img
                  src="https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=2070&auto=format&fit=crop"
                  alt="Live performance"
                />
              </div>
              <div className={styles.storyImageSecondary}>
                <img
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop"
                  alt="Concert crowd"
                />
              </div>
              <div className={styles.experienceBadge}>
                <span className={styles.expNumber}>10+</span>
                <span className={styles.expLabel}>Years Exp.</span>
              </div>
            </div>

            <div className={styles.storyContent}>
              <span className="section-tag">Our Story</span>
              <h2 className={styles.storyTitle}>
                From a Vision to India&apos;s Premier Entertainment Partner
              </h2>
              <p className={styles.storyText}>
                Founded with a passion for music and a commitment to excellence,
                EntertainmentVibes has grown from a small artist management
                firm into a full-spectrum entertainment powerhouse.
              </p>
              <p className={styles.storyText}>
                We believe every event deserves a touch of magic. Our curated
                roster of 200+ artists spans singers, live bands, DJs, comedians,
                dancers, anchors, and more — each handpicked for their talent,
                professionalism, and stage presence.
              </p>
              <div className={styles.storyHighlights}>
                <div className={styles.highlightItem}>
                  <FaStar className={styles.highlightIcon} />
                  <div>
                    <h4>Curated Excellence</h4>
                    <p>Every artist is vetted for quality and professionalism.</p>
                  </div>
                </div>
                <div className={styles.highlightItem}>
                  <FaMusic className={styles.highlightIcon} />
                  <div>
                    <h4>End-to-End Management</h4>
                    <p>From booking to stage setup, we handle everything seamlessly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ MISSION & VISION ═══════════════════ */}
      <section className={styles.missionSection}>
        <div className="container">
          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <div className={styles.missionIconWrap}>
                <FaAward className={styles.missionIcon} />
              </div>
              <h3 className={styles.missionTitle}>Our Mission</h3>
              <p className={styles.missionText}>
                To democratize access to premium entertainment by connecting
                world-class artists with event organizers seamlessly — making
                every celebration unforgettable, regardless of scale.
              </p>
            </div>
            <div className={styles.missionCard}>
              <div className={styles.missionIconWrap}>
                <FaGlobeAsia className={styles.missionIcon} />
              </div>
              <h3 className={styles.missionTitle}>Our Vision</h3>
              <p className={styles.missionText}>
                To become India&apos;s most trusted entertainment ecosystem —
                where talent meets opportunity, and every stage tells a story
                that resonates with audiences across the globe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ OUR VALUES ═══════════════════ */}
      <section className={styles.valuesSection}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Choose Us</span>
            <h2 className="section-title">What Sets Us Apart</h2>
            <p className="section-subtitle">
              We go beyond booking — delivering premium, end-to-end entertainment
              experiences built on trust and passion.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            {values.map((v, i) => (
              <div key={i} className={styles.valueCard}>
                <div className={styles.valueIconWrap}>{v.icon}</div>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ═══════════════════ TEAM SECTION ═══════════════════ */}
      <section className={styles.teamSection}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Team</span>
            <h2 className="section-title">The Visionary Behind It All</h2>
            <p className="section-subtitle">
              Meet the passionate mind who built EntertainmentVibes from
              the ground up.
            </p>
          </div>

          {/* Founder Spotlight — Horizontal Layout */}
          <div className={styles.founderWrap}>
            <div className={styles.founderCard}>
              {/* Decorative orbs */}
              <div className={styles.founderRingOuter} />
              <div className={styles.founderRingInner} />

              {/* LEFT: Photo + Social Links */}
              <div className={styles.founderLeft}>
                <div className={styles.founderAvatarWrap}>
                  <div className={styles.founderAvatarRing}>
                    <div className={styles.founderAvatarInner}>
                      <img
                        src={founder.image}
                        alt={founder.name}
                        className={styles.founderAvatar}
                      />
                    </div>
                  </div>
                  <div className={styles.founderBadge}>Founder</div>
                </div>

                {/* Social Links */}
                <div className={styles.founderSocial}>
                  <a href={founder.social.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    Instagram
                  </a>
                  <a href={founder.social.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </a>
                  <a href={founder.social.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>

              {/* RIGHT: Name, Bio, Tags */}
              <div className={styles.founderRight}>
                <h3 className={styles.founderName}>{founder.name}</h3>
                <span className={styles.founderRole}>{founder.role}</span>
                <div className={styles.founderBioWrap}>
                  {founder.bio.map((para, i) => (
                    <p key={i} className={styles.founderBio}>{para}</p>
                  ))}
                </div>
                <div className={styles.founderTags}>
                  {founder.tags.map((tag) => (
                    <span key={tag} className={styles.founderTag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA SECTION ═══════════════════ */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to Create Something <span className="text-gradient">Extraordinary?</span>
            </h2>
            <p className={styles.ctaSubtitle}>
              Let&apos;s discuss how we can make your next event unforgettable with
              world-class entertainment.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/contact" className="btn btn-primary btn-lg">
                Contact Us <FaArrowRight />
              </Link>
              <Link href="/artists" className="btn btn-secondary btn-lg">
                Browse Artists
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


