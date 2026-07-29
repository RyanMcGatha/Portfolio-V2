"use client";

import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";
import { SectionHeader } from "../util/SectionHeader";
import Reveal from "../util/Reveal";
import { MyLinks } from "../nav/Header";
import { Stats } from "./Stats";

/** Inline link styling for contextual links inside body copy. */
const inlineLink =
  "text-foreground border-b border-foreground/40 hover:border-foreground transition-colors";

export const About = () => {
  return (
    <section id="about" className="section-wrapper">
      <SectionHeader title="About Me" dir="l" />
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 mt-8">
        <div className="space-y-6 subheading">
          <Reveal>
            <div className="relative">
              <p className="text-lg leading-relaxed text-muted-foreground">
                <span className="float-left mr-3 mt-1">
                  <span className="bg-foreground text-background w-14 h-14 rounded-[--radius] flex items-center justify-center text-3xl font-heading">
                    H
                  </span>
                </span>
                ey! I&apos;m Ryan McGatha, a full-stack web developer and
                designer based in Greenville, SC. I design and build{" "}
                <Link href="/web-development" className={inlineLink}>
                  modern websites, polished user interfaces, and custom web apps
                </Link>{" "}
                for businesses across the Upstate — and I bring AI into the
                picture when it actually moves the needle. Currently at Drum
                Creative, I manage over 200 client websites and build roughly
                one new site per week, handling everything from design and
                layout to development, integrations, and ongoing maintenance.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <p className="text-lg leading-relaxed text-muted-foreground">
              My day-to-day is design and full-stack development. I work in
              Figma to wireframe and design sites and apps, then build them out
              with React, Next.js, TypeScript, and Tailwind on the front end,
              and Node.js, Express, FastAPI, and PostgreSQL on the back end. I
              care a lot about typography, motion, and the small interaction
              details that make a product feel finished — not just functional.
            </p>
          </Reveal>
          <Reveal>
            <p className="text-lg leading-relaxed text-muted-foreground">
              I also have deep experience shipping AI into real products. At
              Chipp AI, I built core infrastructure for an AI SaaS platform —
              dynamic URL crawlers, AI agent tooling that performed real-time
              RESTful API calls with autonomous data capture, and third-party
              integrations with Fireflies, Notion, and Calendly. So when a
              project benefits from{" "}
              <Link href="/ai-services" className={inlineLink}>
                a custom AI agent, chatbot, or LLM integration
              </Link>
              , that&apos;s a tool in the box too — not the only one.
            </p>
          </Reveal>
          <Reveal>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Earlier, I worked as a Contract Software Developer for
              Sully&apos;s Steamers in Greenville, SC, building a Franchise
              Document Management System that streamlined their operations. My
              foundation in modern full-stack web development comes from
              Carolina Code School in Greenville, and I&apos;ve been building
              and shipping ever since.
            </p>
          </Reveal>
          <Reveal>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Outside of work I enjoy fishing, designing side projects, and
              keeping up with what&apos;s new in both web and AI — from
              framework releases to LangChain, RAG pipelines, and multi-agent
              systems. Whether it&apos;s a brand-new marketing site, a
              redesigned web app, a WordPress build, or a custom AI integration,
              I&apos;m focused on shipping work that looks great, performs
              well, and actually solves the problem.
            </p>
          </Reveal>
          <Reveal>
            <div className="flex flex-col subheading sm:flex-row items-start sm:items-center gap-6 border-t border-border pt-6 mt-8">
              <span className="text-foreground">My links</span>
              <AiOutlineArrowRight className="text-foreground hidden sm:block" />
              <MyLinks />
            </div>
          </Reveal>
        </div>

        <Stats />
      </div>
    </section>
  );
};
