import Link from "next/link";
import React from "react";
import { SiGithub, SiLinkedin } from "react-icons/si";

import { ModeToggle } from "@/components/ui/theme-selector";
import { AiFillMail, AiFillPhone } from "react-icons/ai";
import { OutlineButton } from "../buttons/OutlineButton";

export const Header = () => {
  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md border-b border-border shadow-sm font-heading z-20">
      <MyLinks />
      <div className="flex items-center gap-4">
        <ModeToggle />
        <OutlineButton>
          <Link
            href="/resume.pdf"
            target="_blank"
            prefetch={true}
            rel="nofollow"
            aria-label="My Resume"
          >
            My Resume
          </Link>
        </OutlineButton>
      </div>
    </header>
  );
};

export const MyLinks = () => (
  <div className="flex items-center text-lg gap-4 font-heading">
    <SocialLink
      href="https://www.linkedin.com/in/ryanmcgatha"
      icon={<SiLinkedin />}
      label="LinkedIn"
    />
    <SocialLink
      href="https://www.github.com/RyanMcGatha"
      icon={<SiGithub />}
      label="GitHub"
    />
    <SocialLink
      href="mailto:ryanmcgatha@gmail.com"
      icon={<AiFillMail />}
      label="Email"
    />
    <SocialLink href="tel:+18644346547" icon={<AiFillPhone />} label="Phone" />
  </div>
);

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, label }) => (
  <Link
    className="text-primary hover:text-muted-foreground transition-colors duration-200 rounded-[--radius]"
    href={href}
    target="_blank"
    prefetch={true}
    rel="nofollow"
    aria-label={label}
  >
    <span className="hover:scale-110 transition-transform">{icon}</span>
  </Link>
);
