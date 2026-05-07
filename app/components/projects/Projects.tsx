import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { SectionHeader } from "../util/SectionHeader";
import { Project } from "./Project";
import { projects } from "@/app/projects/data";

export const Projects = () => {
  return (
    <section className="section-wrapper py-16 subheading" id="projects">
      <SectionHeader title="Projects" dir="r" />
      <div className="grid gap-8 md:gap-12 grid-cols-1 md:grid-cols-2 mt-8">
        {projects.map((project) => (
          <Project
            key={project.slug}
            slug={project.slug}
            title={project.title}
            description={project.description}
            imgSrc={project.imgSrc}
            tech={project.tech}
            code={project.code}
            projectLink={project.projectLink}
          />
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-heading text-sm text-foreground border-b-2 border-foreground/30 hover:border-foreground pb-1 transition-colors"
        >
          View all projects
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};
