"use client";

import { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { AiFillGithub, AiOutlineExport } from "react-icons/ai";
import { MdClose } from "react-icons/md";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  imgSrc: string;
  code: string;
  projectLink: string;
  tech: string[];
  modalContent: React.ReactNode;
}

export const ProjectModal = ({
  modalContent,
  projectLink,
  setIsOpen,
  imgSrc,
  isOpen,
  title,
  code,
  tech,
}: Props) => {
  useEffect(() => {
    const body = document.querySelector("body");

    if (isOpen) {
      body!.style.overflowY = "hidden";
    } else {
      body!.style.overflowY = "scroll";
    }
  }, [isOpen]);

  const content = (
    <div
      className="fixed inset-0 z-50 px-4 py-12 bg-background/80 backdrop-blur overflow-y-scroll flex justify-center cursor-pointer font-body"
      onClick={() => setIsOpen(false)}
    >
      <button className="absolute top-4 md:top-6 text-xl right-4 hover:text-primary transition-colors">
        <MdClose />
      </button>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl h-fit rounded-[var(--radius)] overflow-hidden bg-card border border-border shadow-lg cursor-auto"
      >
        <div className="relative w-full aspect-video">
          <Image
            className="object-cover"
            src={imgSrc}
            alt={`An image of the ${title} project.`}
            width={800}
            height={450}
            priority
          />
        </div>
        <div className="p-8">
          <h4 className="text-3xl font-bold mb-2 text-card-foreground font-heading">
            {title}
          </h4>
          <div className="flex flex-wrap gap-2 text-sm text-primary">
            {tech.join(" - ")}
          </div>

          <div className="space-y-4 my-6 leading-relaxed text-sm text-muted-foreground">
            {modalContent}
          </div>

          <div>
            <p className="font-bold mb-2 text-xl text-card-foreground">
              Project Links<span className="text-primary">.</span>
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link
                target="_blank"
                rel="nofollow"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                href={code}
              >
                <AiFillGithub /> Source Code
              </Link>
              <Link
                target="_blank"
                rel="nofollow"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                href={projectLink}
              >
                <AiOutlineExport /> Live Project
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (!isOpen) return <></>;

  return ReactDOM.createPortal(content, document.body);
};
