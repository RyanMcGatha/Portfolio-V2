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
                    "AI Developer",
                    "AI Agent Builder",
                    "Full Stack Developer",
                    "React Specialist",
                    "Python & AI Engineer",
                    "Greenville, SC",
                  ]}
                />
              </>
            }
            description="AI developer and full-stack web developer based in Greenville, SC. I build custom AI agents, chatbots, LLM integrations, and AI-powered web applications using React, Node.js, and Python for businesses across the Upstate."
            actions={[
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
