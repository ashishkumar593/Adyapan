"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleCanvas from "@/components/ParticleCanvas";
import { features, workflowSteps, testimonials, faqItems } from "@/data/mockData";

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="faq-accordion">
      {faqItems.map((item, i) => (
        <div key={i} className="faq-item glass">
          <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
            <span>{item.question}</span>
            <i className={`faq-icon fas ${open === i ? "fa-minus" : "fa-plus"}`} />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="faq-answer overflow-hidden"
              >
                <div className="faq-answer-inner">{item.answer}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function TestimonialSlider() {
  const [idx, setIdx] = useState(0);
  const t = testimonials[idx];
  return (
    <div className="testimonial-container glass">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          className="testimonial-slide"
        >
          <p className="testimonial-text">{t.text}</p>
          <div className="testimonial-avatar">
            <Image src={t.avatar} alt={t.author} width={80} height={80} className="rounded-full object-cover" />
          </div>
          <div className="testimonial-author">
            <h4>{t.author}</h4>
            <p>{t.role}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="testimonial-dots">
        {testimonials.map((_, i) => (
          <button key={i} className={`dot ${i === idx ? "active" : ""}`} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <section id="home" className="hero">
        <div className="hero-glow hero-glow-1" />
        <ParticleCanvas />
        <div className="container">
          <div className="hero-grid">
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            >
              <div className="badge">✨ Powered by Advanced AI</div>
              <h1 className="hero-title">
                Master Your Future with <span className="text-gradient">Adyapan AI</span>
              </h1>
              <p className="hero-desc">
                Learn, Prepare, Build Your Career, and Get Hired. Adyapan AI is your intelligent
                dashboard companion tracking stats, building resumes, and offering direct career coaching.
              </p>
              <div className="hero-actions">
                <Link href="/login" className="btn btn-primary">
                  Get Started <FaArrowRight />
                </Link>
                <a href="#features" className="btn btn-secondary">Explore Features</a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="container">
          <div className="section-header">
            <h2>AI-Powered Features</h2>
            <p>Our tailored algorithms guide you through every stage of your college and career journey.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="feature-card glass"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div className="feature-icon-wrapper">
                  <Image src={f.image} alt={f.title} width={64} height={64} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
                <Link href={f.link} className="feature-link">Explore Tool <FaArrowRight /></Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Your Journey with Adyapan AI</h2>
            <p>A simple step-by-step pathway to supercharge your skills and land your dream job.</p>
          </div>
          <div className="workflow-timeline">
            {workflowSteps.map((step, i) => (
              <motion.div
                key={step.num}
                className="workflow-step"
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              >
                <div className="workflow-dot" />
                <div className="workflow-content glass">
                  <div className="workflow-num">{step.num}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>What Students Say</h2>
            <p>Hear from users who boosted their GPA, structured their portfolios, and secured roles.</p>
          </div>
          <TestimonialSlider />
        </div>
      </section>

      <section id="faq" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common questions about our platform and AI capabilities.</p>
          </div>
          <FaqAccordion />
        </div>
      </section>

      <Footer />
    </>
  );
}
