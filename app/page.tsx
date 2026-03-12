"use client";

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
      <main id="main-content">
        <Header />

        <div className="mx-auto px-4 md:px-8 space-y-32 pb-24 max-w-7xl">
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
                    "AI Developer",
                    "React Specialist",
                    "Node.js Engineer",
                    "Python Developer",
                    "Greenville, SC",
                  ]}
                />
              </>
            }
            description="Web developer and AI developer based in Greenville, SC. I build dynamic, responsive web applications using React, Node.js, Python, and modern AI technologies for businesses across the Upstate."
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
