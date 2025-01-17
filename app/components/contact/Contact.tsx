import { AiFillMail } from "react-icons/ai";
import Link from "next/link";
import Reveal from "../util/Reveal";

export const Contact = () => {
  return (
    <section className="section-wrapper" id="contact">
      <div className="max-w-xl mx-auto bg-card px-8 py-12 rounded-[--radius] border">
        <Reveal width="w-full">
          <h4 className="text-4xl md:text-5xl text-center font-heading text-foreground">
            Contact<span className="text-accent">.</span>
          </h4>
        </Reveal>
        <Reveal width="w-full">
          <p className="text-center my-8 text-muted-foreground leading-relaxed font-body">
            Shoot me an email if you want to connect! You can also find me on{" "}
            <Link
              prefetch={true}
              href="https://www.linkedin.com/in/ryanmcgatha"
              target="_blank"
              className="text-foreground hover:text-accent hover:underline font-heading"
            >
              Linkedin
            </Link>{" "}
            or{" "}
            <Link
              prefetch={true}
              href="https://github.com/RyanMcGatha"
              target="_blank"
              className="text-foreground hover:text-accent hover:underline font-heading"
            >
              GitHub
            </Link>{" "}
            if that&apos;s more your speed.
          </p>
        </Reveal>
        <Reveal width="w-full">
          <Link
            prefetch={true}
            href="mailto:ryanmcgatha@gmail.com"
            target="_blank"
          >
            <div className="flex items-center justify-center gap-2 w-fit text-lg md:text-2xl whitespace-normal mx-auto text-muted-foreground hover:text-accent transition-colors font-code">
              <AiFillMail />
              <span>ryanmcgatha@gmail.com</span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};
