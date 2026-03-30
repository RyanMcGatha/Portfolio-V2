"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "";
    }
    return () => {
      document.body.style.overflowY = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 px-4 py-12 bg-background/80 backdrop-blur overflow-y-scroll flex justify-center cursor-pointer subheading"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} project details`}
        >
          <button
            className="absolute top-4 md:top-6 text-xl right-4 hover:text-muted-foreground transition-colors text-foreground"
            onClick={handleClose}
            aria-label="Close dialog"
          >
            <MdClose size={24} />
          </button>

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
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
              <h3 className="text-3xl font-bold mb-2 text-card-foreground font-heading">
                {title}
              </h3>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                {tech.join(" - ")}
              </div>

              <div className="space-y-4 my-6 leading-relaxed text-sm text-muted-foreground">
                {modalContent}
              </div>

              <div>
                <p className="font-bold mb-2 text-xl text-card-foreground">
                  Project Links<span className="text-foreground">.</span>
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <Link
                    target="_blank"
                    rel="nofollow"
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    href={code}
                  >
                    <AiFillGithub /> Source Code
                  </Link>
                  <Link
                    target="_blank"
                    rel="nofollow"
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    href={projectLink}
                  >
                    <AiOutlineExport /> Live Project
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
