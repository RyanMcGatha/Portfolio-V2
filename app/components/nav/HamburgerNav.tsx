"use client";

import { SiGithub, SiLinkedin } from "react-icons/si";
import { AiFillMail } from "react-icons/ai";
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";

const LINKS = [
  { title: "home", href: "/" },
  { title: "projects", href: "/projects" },
  { title: "ai services", href: "/ai-services" },
  { title: "contact", href: "/contact" },
];

const SOCIAL_CTAS = [
  { Component: SiLinkedin, href: "https://www.linkedin.com/in/ryanmcgatha", label: "LinkedIn" },
  { Component: SiGithub, href: "https://www.github.com/RyanMcGatha", label: "GitHub" },
  { Component: AiFillMail, href: "mailto:ryanmcgatha@gmail.com", label: "Email" },
];

export const HamburgerNav = () => {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  return (
    <>
      {/* Inline button — sits naturally inside the Header's flex row */}
      <motion.button
        initial={false}
        animate={active ? "open" : "closed"}
        onClick={() => setActive((pv) => !pv)}
        aria-label={active ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={active}
        className="relative flex h-10 w-10 flex-col items-center justify-center gap-[6px] rounded-lg transition-colors hover:bg-foreground/10"
      >
        <motion.span
          variants={HAMBURGER_VARIANTS.top}
          className={`block h-[2px] w-6 origin-center transition-colors ${active ? "bg-background" : "bg-foreground"}`}
        />
        <motion.span
          variants={HAMBURGER_VARIANTS.middle}
          className={`block h-[2px] w-6 origin-center transition-colors ${active ? "bg-background" : "bg-foreground"}`}
        />
        <motion.span
          variants={HAMBURGER_VARIANTS.bottom}
          className={`block h-[2px] origin-right transition-colors ${active ? "bg-background" : "bg-foreground"}`}
        />
      </motion.button>

      {/* Portal — renders underlay + overlay directly on document.body,
          escaping any stacking context created by the header's backdrop-filter */}
      {mounted &&
        createPortal(
          <>
            <motion.div
              initial={false}
              animate={active ? "open" : "closed"}
              variants={UNDERLAY_VARIANTS}
              className="fixed top-0 right-0 z-[100] bg-foreground"
            />
            <AnimatePresence>
              {active && <LinksOverlay setActive={setActive} />}
            </AnimatePresence>
          </>,
          document.body
        )}
    </>
  );
};

const LinksOverlay = ({ setActive }: { setActive: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <nav className="fixed inset-0 z-[110] overflow-hidden bg-foreground">
      <div className="flex items-start justify-between">
        <Logo />
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.35, duration: 0.3 } }}
          exit={{ opacity: 0 }}
          onClick={() => setActive(false)}
          aria-label="Close navigation menu"
          className="m-4 flex h-12 w-12 items-center justify-center rounded-lg text-background/70 transition-colors hover:bg-background/10 hover:text-background"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </motion.button>
      </div>
      <LinksContainer setActive={setActive} />
      <FooterCTAs />
    </nav>
  );
};

const LinksContainer = ({ setActive }: { setActive: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <motion.div className="space-y-4 px-6 pb-12 pt-4 md:px-20">
      {LINKS.map((l, idx) => (
        <NavLink key={l.title} href={l.href} idx={idx} onClick={() => setActive(false)}>
          {l.title}
        </NavLink>
      ))}
    </motion.div>
  );
};

const NavLink = ({
  children,
  href,
  idx,
  onClick,
}: {
  children: ReactNode;
  href: string;
  idx: number;
  onClick: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: 0.45 + idx * 0.1, duration: 0.4, ease: "easeInOut" },
      }}
      exit={{ opacity: 0, y: -8 }}
    >
      <Link
        href={href}
        onClick={onClick}
        className="block text-5xl font-heading font-semibold text-background/70 transition-colors hover:text-background md:text-7xl"
      >
        {children}.
      </Link>
    </motion.div>
  );
};

const Logo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: 0.35, duration: 0.4, ease: "easeInOut" },
      }}
      exit={{ opacity: 0, y: -12 }}
      className="m-4 grid h-12 w-12 place-content-center rounded-lg bg-background transition-colors hover:bg-accent"
    >
      <span className="text-xl font-heading font-black text-foreground leading-none">R.</span>
    </motion.div>
  );
};

const FooterCTAs = () => {
  return (
    <>
      <div className="absolute bottom-6 left-6 flex gap-4 md:flex-col">
        {SOCIAL_CTAS.map((l, idx) => (
          <motion.a
            key={idx}
            href={l.href}
            aria-label={l.label}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: -8 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.6 + idx * 0.1, duration: 0.4, ease: "easeInOut" },
            }}
            exit={{ opacity: 0, y: -8 }}
          >
            <l.Component className="text-xl text-background/70 transition-colors hover:text-background" />
          </motion.a>
        ))}
      </div>

      <motion.a
        href="/contact"
        initial={{ opacity: 0, y: 8 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.65, duration: 0.4, ease: "easeInOut" },
        }}
        exit={{ opacity: 0, y: 8 }}
        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm uppercase text-foreground font-heading transition-colors hover:bg-accent md:text-base md:px-6 md:py-3"
      >
        <span>contact me</span> <FiArrowRight />
      </motion.a>
    </>
  );
};

const UNDERLAY_VARIANTS = {
  open: {
    width: "100vw",
    height: "100vh",
    transition: { type: "spring", mass: 2.5, stiffness: 450, damping: 48 },
  },
  closed: {
    width: "0px",
    height: "0px",
    transition: {
      delay: 0.5,
      type: "spring",
      mass: 2.5,
      stiffness: 450,
      damping: 48,
    },
  },
};

const HAMBURGER_VARIANTS = {
  top: {
    open: { rotate: 45, y: 8, transition: { duration: 0.3 } },
    closed: { rotate: 0, y: 0, transition: { duration: 0.3 } },
  },
  middle: {
    open: { opacity: 0, x: -8, transition: { duration: 0.2 } },
    closed: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  },
  bottom: {
    open: { rotate: -45, y: -8, width: "24px", transition: { duration: 0.3 } },
    closed: { rotate: 0, y: 0, width: "16px", transition: { duration: 0.3 } },
  },
};
