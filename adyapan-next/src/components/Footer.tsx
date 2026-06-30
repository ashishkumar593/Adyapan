import Link from "next/link";
import { FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-info">
            <Link href="/" className="logo">
              <span className="text-gradient">Adyapan AI</span>
            </Link>
            <p className="footer-desc">
              Your ultimate intelligent educational suite helping you navigate college, refine
              profiles, build portfolios, and match with recruiters.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" className="social-link" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="#" className="social-link" aria-label="GitHub"><FaGithub /></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><Link href="/#home">Home</Link></li>
              <li><Link href="/#features">Features</Link></li>
              <li><Link href="/#how-it-works">How It Works</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Tools</h4>
            <ul>
              <li><Link href="/dashboard/student">Study Assistant</Link></li>
              <li><Link href="/dashboard/student">Resume Builder</Link></li>
              <li><Link href="/dashboard/student">Interview Coach</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link href="/#faq">FAQ</Link></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Adyapan AI. All rights reserved.</p>
          <p>Built with ❤️ for students globally.</p>
        </div>
      </div>
    </footer>
  );
}
