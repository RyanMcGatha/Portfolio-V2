"use client";

import { AiFillMail } from "react-icons/ai";
import Link from "next/link";
import Reveal from "../util/Reveal";
import { ContactForm } from "./ContactForm";

export const Contact = () => {
  return (
    <footer id="contact" className="section-wrapper" role="contentinfo">
      <div className="max-w-xl mx-auto bg-card/50 backdrop-blur-sm px-8 py-12 rounded-[--radius] border border-border hover:border-foreground/20 transition-colors duration-300">
        <Reveal width="w-full">
          <h2 className="text-4xl md:text-5xl text-center font-heading text-foreground">
            Contact<span className="text-foreground font-heading">.</span>
          </h2>
        </Reveal>
        <Reveal width="w-full">
          <p className="text-center my-8 text-muted-foreground leading-relaxed subheading">
            Looking for an AI developer or web developer in Greenville, SC?
            Whether you need a custom AI agent, chatbot, LLM integration, or
            a full-stack web application, fill out the form below and I&apos;ll
            get back to you quickly. You can also find me on{" "}
            <Link
              href="https://www.linkedin.com/in/ryanmcgatha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-muted-foreground underline underline-offset-2 font-heading transition-colors"
            >
              LinkedIn
            </Link>{" "}
            or{" "}
            <Link
              href="https://github.com/RyanMcGatha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-muted-foreground underline underline-offset-2 font-heading transition-colors"
            >
              GitHub
            </Link>
            .
          </p>
        </Reveal>
        <Reveal width="w-full">
          <ContactForm />
        </Reveal>
        <Reveal width="w-full">
          <div className="mt-8 pt-6 border-t border-border">
            <address className="not-italic">
              <Link href="mailto:ryanmcgatha@gmail.com">
                <div className="flex items-center justify-center gap-2 w-fit text-base md:text-lg whitespace-normal mx-auto text-muted-foreground hover:text-foreground transition-colors font-code">
                  <AiFillMail />
                  <span>ryanmcgatha@gmail.com</span>
                </div>
              </Link>
              <p className="text-center text-sm text-muted-foreground mt-3 subheading">
                AI developer based in Greenville, South Carolina &mdash; available
                for local and remote AI & web development projects
              </p>
            </address>
          </div>
        </Reveal>
      </div>
    </footer>
  );
};
