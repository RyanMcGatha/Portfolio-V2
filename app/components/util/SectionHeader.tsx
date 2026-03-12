import { Reveal } from "./Reveal";

interface Props {
  title: string;
  dir?: "l" | "r";
}

export const SectionHeader = ({ title, dir = "r" }: Props) => {
  return (
    <div
      className="flex items-center gap-8 mb-12"
      style={{ flexDirection: dir === "r" ? "row" : "row-reverse" }}
    >
      <div className="w-full h-[1px] bg-border" />
      <h2 className="shrink-0">
        <Reveal>
          <span className="text-4xl md:text-5xl font-heading text-foreground whitespace-nowrap">
            {title}
            <span className="text-foreground font-heading">.</span>
          </span>
        </Reveal>
      </h2>
      {dir === "r" && (
        <div className="w-full h-[1px] bg-border hidden md:block" />
      )}
    </div>
  );
};
