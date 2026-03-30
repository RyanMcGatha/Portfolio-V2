import { AiFillMail } from "react-icons/ai";
import Link from "next/link";
import Reveal from "../util/Reveal";

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
            Looking for a web developer or AI developer in Greenville, SC? Shoot
            me an email and let&apos;s talk about your project. You can also
            find me on{" "}
            <Link
              href="https://www.linkedin.com/in/ryanmcgatha"
              target="_blank"
              className="text-foreground hover:text-muted-foreground underline underline-offset-2 font-heading transition-colors"
            >
              LinkedIn
            </Link>{" "}
            or{" "}
            <Link
              href="https://github.com/RyanMcGatha"
              target="_blank"
              className="text-foreground hover:text-muted-foreground underline underline-offset-2 font-heading transition-colors"
            >
              GitHub
            </Link>{" "}
            if that&apos;s more your speed.
          </p>
        </Reveal>
        <Reveal width="w-full">
          <address className="not-italic">
            <Link href="mailto:ryanmcgatha@gmail.com">
              <div className="flex items-center justify-center gap-2 w-fit text-lg md:text-2xl whitespace-normal mx-auto text-foreground hover:text-muted-foreground transition-colors font-code">
                <AiFillMail />
                <span>ryanmcgatha@gmail.com</span>
              </div>
            </Link>
            <p className="text-center text-sm text-muted-foreground mt-4 subheading">
              Based in Greenville, South Carolina &mdash; available for local
              and remote projects
            </p>
          </address>
        </Reveal>
      </div>
    </footer>
  );
};
