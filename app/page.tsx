"use client";

import dynamic from "next/dynamic";
import { SideBar } from "./components/nav/SideBar";
import { Header } from "./components/nav/Header";
import { HeroSection } from "./components/hero/Hero";
import BackgroundAnimation from "./components/util/BackgroundAnimation";
import { TypewriterEffect } from "./components/hero/TypewriterEffect";

const About = dynamic(
  () => import("./components/about/About").then((mod) => mod.About),
);
const Projects = dynamic(
  () => import("./components/projects/Projects").then((mod) => mod.Projects),
);
const Experience = dynamic(
  () =>
    import("./components/experience/Experience").then((mod) => mod.Experience),
);
const Contact = dynamic(
  () => import("./components/contact/Contact").then((mod) => mod.Contact),
);

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
