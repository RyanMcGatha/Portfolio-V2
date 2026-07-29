import Link from "next/link";
import Image from "next/image";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { ModeToggle } from "@/components/ui/theme-selector";
import { AiFillMail, AiFillPhone } from "react-icons/ai";
import { OutlineButton } from "../buttons/OutlineButton";
import { HamburgerNav } from "./HamburgerNav";

export const Header = () => {
  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md border-b border-border shadow-sm font-heading z-20">
      <div className="flex items-center gap-3 sm:gap-4">
        <Link href="/" aria-label="Go to homepage" data-nav="logo">
          <Image
            src="/favicon.ico"
            alt="Ryan McGatha"
            width={28}
            height={28}
            className="rounded-sm hover:opacity-75 transition-opacity"
          />
        </Link>
        <MyLinks />
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/projects"
          data-nav="header"
          className="text-sm font-heading text-muted-foreground hover:text-foreground transition-colors hidden lg:block"
        >
          Projects
        </Link>
        <Link
          href="/web-development"
          data-nav="header"
          className="text-sm font-heading text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
        >
          Web Development
        </Link>
        <Link
          href="/ai-services"
          data-nav="header"
          className="text-sm font-heading text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
        >
          AI Services
        </Link>
        <Link
          href="/contact"
          data-nav="header"
          className="text-sm font-heading text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
        >
          Contact
        </Link>
        <ModeToggle />
        <OutlineButton aria-label="Download my resume" className="hidden sm:flex">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="nofollow noopener"
            aria-label="Download my resume (PDF)"
            data-nav="header"
          >
            My Resume
          </a>
        </OutlineButton>
        <HamburgerNav />
      </div>
    </header>
  );
};

export const MyLinks = () => (
  <div className="flex items-center text-lg gap-2 sm:gap-4 font-heading" role="list">
    <SocialLink
      href="https://www.linkedin.com/in/ryanmcgatha"
      icon={<SiLinkedin />}
      label="LinkedIn profile"
    />
    <SocialLink
      href="https://www.github.com/RyanMcGatha"
      icon={<SiGithub />}
      label="GitHub profile"
    />
    <SocialLink
      href="mailto:ryanmcgatha@gmail.com"
      icon={<AiFillMail />}
      label="Send email"
      className="hidden sm:block"
    />
    <SocialLink
      href="tel:+18642016487"
      icon={<AiFillPhone />}
      label="Call phone"
      className="hidden sm:block"
    />
  </div>
);

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, label, className }) => (
  <Link
    className={`text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-[--radius] focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none${className ? ` ${className}` : ""}`}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    role="listitem"
  >
    <span className="block hover:scale-110 transition-transform text-xl">
      {icon}
    </span>
  </Link>
);
