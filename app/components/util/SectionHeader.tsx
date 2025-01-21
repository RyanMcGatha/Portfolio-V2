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
      <div className="w-full h-[2px] bg-primary" />
      <h2 className="font-body">
        <Reveal>
          <span className="text-4xl md:text-5xl font-heading text-foreground">
            {title}
            <span className="text-primary font-heading">.</span>
          </span>
        </Reveal>
      </h2>
    </div>
  );
};
