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
                ey! I&apos;m Ryan McGatha, a full-stack web developer and AI
                developer based in Greenville, SC. Currently at Drum Creative, I
                manage over 200 client websites and build roughly one new site
                per week, while automating maintenance workflows to keep
                everything running smoothly. I specialize in integrating
                third-party APIs, managing data pipelines, and enhancing both
                front-end and back-end performance. I&apos;m passionate about
                writing clean code, streamlining workflows, and collaborating to
                create high-quality products for businesses across the
                Greenville, South Carolina area and beyond.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Previously, I served as a Software Engineering Intern at Chipp AI,
              where I led the development of dynamic URL crawlers, implemented
              third-party API integrations, and crafted tools to enable AI
              agents to perform real-time RESTful API calls with formless data
              capture and submission. This experience deepened my expertise in AI
              development and building intelligent, automated solutions. My
              skills lie in crafting scalable web applications using modern
              technologies such as React.js, Node.js, and PostgreSQL.
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
              Outside of coding, I enjoy fishing and diving into emerging
              technologies like AI and machine learning. I believe in continuous
              learning and am always seeking new challenges to grow my skill set.
              Whether it&apos;s building AI-powered solutions, developing custom
              web applications, or tackling complex problems for Greenville
              businesses, I&apos;m driven to develop solutions that make a
              meaningful impact.
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
