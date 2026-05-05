import Link from "next/link";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { ModeToggle } from "@/components/ui/theme-selector";
import { AiFillMail, AiFillPhone } from "react-icons/ai";
import { OutlineButton } from "../buttons/OutlineButton";

export const Header = () => {
  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md border-b border-border shadow-sm font-heading z-20">
      <MyLinks />
      <div className="flex items-center gap-4">
        <Link
          href="/ai-services"
          className="text-sm font-heading text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
        >
          AI Services
        </Link>
        <ModeToggle />
        <OutlineButton aria-label="Download my resume">
          <Link
            href="/resume.pdf"
            target="_blank"
            rel="nofollow"
            aria-label="Download my resume (PDF)"
          >
            My Resume
          </Link>
        </OutlineButton>
      </div>
    </header>
  );
};

export const MyLinks = () => (
  <div className="flex items-center text-lg gap-4 font-heading" role="list">
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
    />
    <SocialLink
      href="tel:+18644346547"
      icon={<AiFillPhone />}
      label="Call phone"
    />
  </div>
);

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, label }) => (
  <Link
    className="text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-[--radius] focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none"
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
