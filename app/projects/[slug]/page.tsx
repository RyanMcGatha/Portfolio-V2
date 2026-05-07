import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  GithubIcon,
} from "lucide-react";
import { Chip } from "@/app/components/util/Chip";
import { projects, getProject, isExternalLink } from "../data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }
  const url = `https://ryanm.info/projects/${project.slug}`;
  return {
    title: `${project.title} | Project by Ryan McGatha`,
    description: project.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      url,
      type: "article",
      images: [
        {
          url: project.imgSrc,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [project.imgSrc],
    },
  };
}

function ProjectBreadcrumbJsonLd({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://ryanm.info",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: "https://ryanm.info/projects",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `https://ryanm.info/projects/${slug}`,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function ProjectCreativeWorkJsonLd({
  title,
  description,
  imgSrc,
  slug,
  category,
  year,
}: {
  title: string;
  description: string;
  imgSrc: string;
  slug: string;
  category: string;
  year: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description,
    image: `https://ryanm.info${imgSrc}`,
    url: `https://ryanm.info/projects/${slug}`,
    genre: category,
    datePublished: year,
    creator: {
      "@type": "Person",
      name: "Ryan McGatha",
      url: "https://ryanm.info",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    notFound();
  }

  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const nextProject =
    projects[(currentIndex + 1) % projects.length] ?? null;
  const isExternalProjectLink = isExternalLink(project.projectLink);

  return (
    <>
      <ProjectBreadcrumbJsonLd title={project.title} slug={project.slug} />
      <ProjectCreativeWorkJsonLd
        title={project.title}
        description={project.description}
        imgSrc={project.imgSrc}
        slug={project.slug}
        category={project.category}
        year={project.year}
      />

      <div className="min-h-screen bg-background text-foreground">
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-black text-foreground hover:text-muted-foreground transition-colors"
            >
              R<span className="text-foreground">.</span>
            </Link>
            <div className="flex items-center gap-6 font-heading text-sm">
              <Link
                href="/#about"
                className="text-muted-foreground hover:text-foreground transition-colors hidden md:block"
              >
                About
              </Link>
              <Link
                href="/projects"
                className="text-foreground"
                aria-current="page"
              >
                Projects
              </Link>
              <Link
                href="/ai-services"
                className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                AI Services
              </Link>
              <Link
                href="/#experience"
                className="text-muted-foreground hover:text-foreground transition-colors hidden md:block"
              >
                Experience
              </Link>
              <Link
                href="/#contact"
                className="text-foreground border border-foreground/20 px-4 py-2 rounded-[--radius] hover:bg-foreground hover:text-background transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 md:px-8 pb-24">
          <article>
            <header className="pt-12 pb-10 sm:pt-20 sm:pb-12">
              <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center gap-2 text-xs font-heading uppercase tracking-widest text-muted-foreground">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-foreground transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href="/projects"
                      className="hover:text-foreground transition-colors"
                    >
                      Projects
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="text-foreground truncate max-w-[14ch] sm:max-w-none">
                    {project.title}
                  </li>
                </ol>
              </nav>

              <p className="text-sm font-heading tracking-widest uppercase text-muted-foreground mb-4">
                {project.category} &bull; {project.year}
              </p>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold leading-[1.1] text-foreground mb-6">
                {project.title}
              </h1>
              <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground max-w-2xl mb-8">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={project.projectLink}
                  target={isExternalProjectLink ? "_blank" : undefined}
                  rel={
                    isExternalProjectLink ? "noopener noreferrer" : undefined
                  }
                  className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-[--radius] font-heading text-sm hover:opacity-90 transition-opacity"
                >
                  {project.projectLinkLabel ?? "View Live Project"}
                  <ExternalLinkIcon className="h-4 w-4" />
                </Link>
                {project.code && (
                  <Link
                    href={project.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-foreground/20 px-6 py-3 rounded-[--radius] font-heading text-sm text-foreground hover:bg-foreground/5 transition-colors"
                  >
                    <GithubIcon className="h-4 w-4" />
                    Source Code
                  </Link>
                )}
              </div>
            </header>

            <div className="relative w-full aspect-video rounded-[var(--radius)] overflow-hidden bg-muted border border-border mb-12">
              <Image
                src={project.imgSrc}
                alt={`Screenshot of the ${project.title} project`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1024px"
                className="object-cover"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-10 md:gap-16">
              <div className="prose prose-lg max-w-none">
                <div className="space-y-6 text-lg leading-relaxed text-muted-foreground subheading">
                  {project.body}
                </div>
              </div>

              <aside className="md:sticky md:top-24 self-start">
                <div className="border-t border-border pt-6 md:border-0 md:pt-0">
                  <h2 className="text-xs font-heading uppercase tracking-widest text-muted-foreground mb-4">
                    Project Details
                  </h2>
                  <dl className="space-y-5 text-sm">
                    <div>
                      <dt className="font-heading uppercase text-xs tracking-widest text-muted-foreground mb-1">
                        Category
                      </dt>
                      <dd className="text-foreground">{project.category}</dd>
                    </div>
                    <div>
                      <dt className="font-heading uppercase text-xs tracking-widest text-muted-foreground mb-1">
                        Year
                      </dt>
                      <dd className="text-foreground">{project.year}</dd>
                    </div>
                    <div>
                      <dt className="font-heading uppercase text-xs tracking-widest text-muted-foreground mb-2">
                        Stack
                      </dt>
                      <dd className="flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <Chip
                            key={t}
                            className="text-xs px-2.5 py-1 subheading"
                          >
                            {t}
                          </Chip>
                        ))}
                      </dd>
                    </div>
                  </dl>
                </div>
              </aside>
            </div>
          </article>

          <section className="mt-20 pt-12 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-heading text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              All projects
            </Link>
            {nextProject && nextProject.slug !== project.slug && (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group inline-flex flex-col sm:items-end gap-1 text-left sm:text-right"
              >
                <span className="font-heading text-xs uppercase tracking-widest text-muted-foreground">
                  Next project
                </span>
                <span className="font-heading text-lg text-foreground inline-flex items-center gap-2 group-hover:text-muted-foreground transition-colors">
                  {nextProject.title}
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
