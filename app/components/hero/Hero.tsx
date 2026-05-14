import Reveal from "../util/Reveal";
import { OutlineButton } from "../buttons/OutlineButton";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface HeroAction {
  text: string;
  href: string;
  icon?: React.ReactNode;
  target?: string;
  prefetch?: boolean;
  rel?: string;
}

interface HeroProps {
  badge?: {
    text: string;
    action: {
      text: string;
      href: string;
      target?: string;
      prefetch?: boolean;
      rel?: string;
    };
  };
  title: string | React.ReactNode;
  description: string;
  actions: HeroAction[];
}

export function HeroSection({ badge, title, description, actions }: HeroProps) {
  return (
    <section
      className={cn(
        "text-foreground",
        "overflow-hidden flex items-center justify-center relative",
      )}
    >
      <div className="mx-auto flex max-w-container flex-col gap-12 pt-16 sm:gap-24 min-h-[924px] min-[420px]:min-h-[841px] min-[440px]:min-h-[740px] min-[470px]:min-h-[685px] min-[510px]:min-h-[655px] min-[600px]:min-h-[626px]">
        <div className="flex flex-col items-center gap-8 text-center sm:gap-14">
          <Reveal>
            {badge && (
              <Badge
                variant="outline"
                className="animate-appear gap-2 text-sm py-2 px-4 bg-background border-foreground/20"
              >
                <span className="text-muted-foreground">{badge.text}</span>
                <a
                  href={badge.action.href}
                  target={badge.action.target}
                  rel={badge.action.rel}
                  className="flex items-center gap-1 text-foreground hover:underline"
                >
                  {badge.action.text}
                  <ArrowRightIcon className="h-4 w-4" />
                </a>
              </Badge>
            )}
          </Reveal>

          <Reveal>
            <h1 className="relative z-10 inline-block font-heading text-5xl font-bold leading-[1.15] text-foreground drop-shadow sm:text-6xl sm:leading-[1.15] md:text-8xl md:leading-[1.15]">
              {title}
            </h1>
          </Reveal>

          <Reveal>
            <p className="text-lg relative z-10 max-w-[570px] leading-relaxed text-muted-foreground sm:text-xl">
              {description}
            </p>
          </Reveal>

          <Reveal>
            <div className="relative z-10 flex flex-wrap justify-center gap-4 mt-4">
            {actions.map((action, index) => (
              <OutlineButton
                key={index}
                className="text-lg py-3 px-6 border-2 bg-background"
              >
                <Link
                  href={action.href}
                  target={action.target}
                  rel={action.rel}
                  prefetch={action.prefetch}
                >
                  {action.icon}
                  {action.text}
                </Link>
              </OutlineButton>
            ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
