"use client";

import { AiOutlineArrowRight } from "react-icons/ai";
import { SectionHeader } from "../util/SectionHeader";
import Reveal from "../util/Reveal";
import { MyLinks } from "../nav/Header";
import { Stats } from "./Stats";

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
                ey! I&apos;m Ryan McGatha, an AI developer and full-stack web
                developer based in Greenville, SC. I build custom AI agents,
                chatbots, LLM integrations, and AI-powered web applications for
                businesses in Greenville, South Carolina and beyond. Currently
                at Drum Creative, I manage over 200 client websites and build
                roughly one new site per week, while automating maintenance
                workflows with intelligent tooling. I specialize in integrating
                AI and third-party APIs, managing data pipelines, and building
                production-ready applications that leverage artificial
                intelligence to solve real business problems for companies
                across the Greenville, South Carolina area.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <p className="text-lg leading-relaxed text-muted-foreground">
              My AI development experience runs deep. At Chipp AI, I built the
              core infrastructure for an AI SaaS platform — developing dynamic
              URL crawlers, implementing AI agent tooling that enabled real-time
              RESTful API calls with autonomous data capture and submission, and
              integrating third-party APIs (Fireflies, Notion, Calendly) into
              AI-driven workflows. I shipped production AI features used by real
              customers, giving me hands-on expertise in building AI agents,
              LLM integrations, and intelligent automation systems that go
              beyond proof-of-concept.
            </p>
          </Reveal>
          <Reveal>
            <p className="text-lg leading-relaxed text-muted-foreground">
              I also worked as a Contract Software Developer for Sully&apos;s
              Steamers in Greenville, SC, creating a comprehensive Franchise
              Document Management System that streamlined their operations. My
              background in full-stack web development, combined with my training
              at Carolina Code School in Greenville, provides me with a strong
              foundation in modern web technologies and best practices.
            </p>
          </Reveal>
          <Reveal>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Outside of coding, I enjoy fishing and staying on the cutting edge
              of artificial intelligence and machine learning. I continuously
              experiment with new AI models, frameworks like LangChain and
              LlamaIndex, and emerging patterns like RAG pipelines and
              multi-agent systems. Whether it&apos;s building custom AI agents,
              deploying chatbots, developing AI-powered web applications, or
              tackling complex automation challenges for Greenville businesses,
              I&apos;m driven to deliver AI solutions that make a measurable
              impact.
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
