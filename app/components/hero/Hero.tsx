"use client";

import Reveal from "../util/Reveal";
import DotGrid from "./DotGrid";
import { OutlineButton } from "../buttons/OutlineButton";

const Hero = () => {
  return (
    <section className="overflow-hidden h-[60vh]">
      <div className="relative h-full flex items-center justify-center">
        <div className="pointer-events-none relative z-10">
          <Reveal>
            <h1 className="text-5xl font-heading text-foreground sm:text-6xl md:text-7xl lg:text-8xl mb-4 pointer-events-auto max-w-[70%]">
              Hi, I&apos;m Ryan McGatha
              <span className="text-primary font-heading">.</span>
            </h1>
          </Reveal>
          <Reveal>
            <h2 className="text-2xl font-heading text-muted-foreground sm:text-3xl md:text-4xl mb-6 pointer-events-auto">
              I&apos;m a{" "}
              <span className="text-primary font-heading">
                Full Stack Developer
              </span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground font-body mb-8 pointer-events-auto">
              I specialize in building dynamic and responsive web applications
              using technologies like Node.js, SQL, Python, and more! Explore my
              projects and get to know more about my work.
            </p>
          </Reveal>
          <Reveal>
            <OutlineButton
              onClick={() => {
                document.getElementById("contact")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="bg-primary text-primary-foreground border-primary hover:bg-background hover:border-primary/90 text-lg px-8 py-3 transition-all duration-300 ease-in-out transform  pointer-events-auto"
            >
              Contact Me
            </OutlineButton>
          </Reveal>
        </div>
        <DotGrid />
      </div>
    </section>
  );
};

export default Hero;
