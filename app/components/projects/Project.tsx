"use client";

import { useAnimation, useInView, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AiFillGithub, AiOutlineExport } from "react-icons/ai";
import { ProjectModal } from "./ProjectModal";
import Reveal from "../util/Reveal";
import { Chip } from "../util/Chip";

interface Props {
  modalContent: React.ReactNode;
  description: string;
  projectLink: string;
  imgSrc: string;
  tech: string[];
  title: string;
  code: string;
}

export const Project = ({
  modalContent,
  projectLink,
  description,
  imgSrc,
  title,
  code,
  tech,
}: Props) => {
  const [hovered, setHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  return (
    <>
      <motion.article
        ref={ref}
        variants={{
          hidden: { opacity: 0, y: 100 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.75 }}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen(true);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`View details for ${title}`}
          className="w-full aspect-video bg-muted cursor-pointer relative rounded-[var(--radius)] overflow-hidden group focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none"
        >
          <Image
            src={imgSrc}
            alt={`Screenshot of the ${title} project`}
            style={{
              width: hovered ? "90%" : "85%",
              rotate: hovered ? "2deg" : "0deg",
            }}
            width={800}
            height={450}
            className="w-[85%] absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 transition-all duration-300 rounded-[var(--radius)]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="mt-6">
          <Reveal width="w-full">
            <div className="flex items-center gap-2 w-full">
              <h3 className="text-lg shrink-0 max-w-[calc(100%_-_150px)] text-foreground font-heading">
                {title}
              </h3>
              <div className="w-full h-[1px] bg-border" />

              <Link
                href={code}
                target="_blank"
                rel="nofollow"
                aria-label={`${title} source code on GitHub`}
              >
                <AiFillGithub className="text-xl text-muted-foreground hover:text-foreground transition-colors duration-300" />
              </Link>

              <Link
                href={projectLink}
                target="_blank"
                rel="nofollow"
                aria-label={`${title} live project`}
              >
                <AiOutlineExport className="text-xl text-muted-foreground hover:text-foreground transition-colors duration-300" />
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <div className="flex flex-wrap gap-2 my-3">
              {tech.map((item) => (
                <Chip key={item} className="text-xs px-2.5 py-1 subheading">
                  {item}
                </Chip>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <p className="text-muted-foreground leading-relaxed subheading">
              {description}{" "}
              <span
                className="inline-block text-sm text-foreground cursor-pointer hover:text-muted-foreground transition-colors duration-300 underline underline-offset-2"
                onClick={() => setIsOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsOpen(true);
                  }
                }}
                tabIndex={0}
                role="button"
              >
                Learn more
              </span>
            </p>
          </Reveal>
        </div>
      </motion.article>
      <ProjectModal
        modalContent={modalContent}
        projectLink={projectLink}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        imgSrc={imgSrc}
        title={title}
        code={code}
        tech={tech}
      />
    </>
  );
};
