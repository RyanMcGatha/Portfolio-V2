"use client";

import React from "react";
import { SideBar } from "./components/nav/SideBar";
import { Header } from "./components/nav/Header";

import { About } from "./components/about/About";
import { Experience } from "./components/experience/Experience";
import { Contact } from "./components/contact/Contact";
import { Projects } from "./components/projects/Projects";
import { HeroSection } from "./components/hero/Hero";
import BackgroundAnimation from "./components/util/BackgroundAnimation";
import { TypewriterEffect } from "./components/hero/TypewriterEffect";

export default function Home() {
  return (
    <div className="grid grid-cols-[54px_1fr]">
      <SideBar />
      <main>
        <Header />

        <div className="mx-auto px-4 md:px-8 space-y-32 pb-24 max-w-7xl ">
          <HeroSection
            badge={{
              text: "Check out my resume",
              action: {
                text: "View here",
                href: "/resume.pdf",
                target: "_blank",
                prefetch: true,
                rel: "nofollow",
              },
            }}
            title={
              <>
                Ryan McGatha
                <br />
                <TypewriterEffect
                  texts={[
                    "Full Stack Developer",
                    "JavaScript Junkie",
                    "Code Craftsman",
                    "Bug Bounty Hunter",
                    "Python Professional",
                    "React Wrangler",
                    "CSS Sorcerer",
                    "Git Wizard",
                    "API Alchemist",
                    "Node Ninja",
                  ]}
                />
              </>
            }
            description={{
              line1:
                "I specialize in building dynamic and responsive web applications",
              line2: "using technologies like Node.js, SQL, Python, and more!",
              line3: "Explore my projects and get to know more about my work.",
            }}
            actions={[
              {
                text: "Contact Me",
                href: "/#contact",
                prefetch: true,
              },
            ]}
          />

          <About />
          <Projects />
          <Experience />
          <Contact />
        </div>
        <BackgroundAnimation />
      </main>
    </div>
  );
}
