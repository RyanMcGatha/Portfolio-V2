import { SideBar } from "./components/nav/SideBar";
import { Header } from "./components/nav/Header";
import { HeroSection } from "./components/hero/Hero";
import { TypewriterEffect } from "./components/hero/TypewriterEffect";
import { About } from "./components/about/About";
import { Projects } from "./components/projects/Projects";
import { Experience } from "./components/experience/Experience";
import { Contact } from "./components/contact/Contact";
import { BackgroundAnimationLazy } from "./components/util/BackgroundAnimationLazy";

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
                prefetch: false,
                rel: "nofollow noopener",
              },
            }}
            title={
              <>
                Ryan McGatha
                <br />
                <TypewriterEffect
                  texts={[
                    "Full-Stack Developer",
                    "Designer & Developer",
                    "React Specialist",
                    "WordPress Developer",
                    "AI Engineer",
                    "Greenville, SC",
                  ]}
                />
              </>
            }
            description="Full-stack developer and designer in Greenville, SC. I design and build modern websites, polished interfaces, and custom web apps in React, Node.js, and Python — including AI agents and LLM integrations when a project calls for it."
            actions={[
              {
                text: "View Projects",
                href: "/#projects",
                prefetch: false,
              },
              {
                text: "AI Services",
                href: "/ai-services",
                prefetch: true,
              },
              {
                text: "Contact Me",
                href: "/#contact",
                prefetch: false,
              },
            ]}
          />

          <About />
          <Projects />
          <Experience />
          <Contact />
        </div>
        <BackgroundAnimationLazy />
      </main>
    </div>
  );
}
