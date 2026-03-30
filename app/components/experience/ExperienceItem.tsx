"use client";

import { Chip } from "../util/Chip";
import { motion } from "framer-motion";
import { FaBriefcase, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import Image from "next/image";

interface Props {
  title: string;
  position: string;
  time: string;
  location: string;
  description: string;
  tech: string[];
  index: number;
  logo?: string;
}

export const ExperienceItem = ({
  title,
  position,
  time,
  location,
  description,
  tech,
  logo,
}: Props) => {
  return (
    <motion.div
      className="relative md:pl-16 group"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="absolute left-[17px] top-8 w-[18px] h-[18px] rounded-full border-[3px] border-foreground/30 bg-background z-10 hidden md:block group-hover:border-foreground transition-colors duration-300" />

      <div className="rounded-lg border border-border p-6 hover:border-foreground/20 hover:bg-card/50 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
          <div className="flex items-center mb-2 md:mb-0 gap-3">
            {logo ? (
              <Image
                src={logo}
                alt={`${title} logo`}
                className="w-10 h-10 object-contain rounded-md"
                width={40}
                height={40}
              />
            ) : (
              <FaBriefcase className="text-foreground text-xl" />
            )}
            <h3 className="font-heading text-xl text-foreground">
              {title}
            </h3>
          </div>
          <div className="flex items-center text-sm text-muted-foreground font-code">
            <FaClock className="mr-2 text-muted-foreground" />
            {time}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <span className="text-foreground font-heading text-base">
            {position}
          </span>
          <div className="flex items-center text-sm text-muted-foreground subheading mt-1 md:mt-0">
            <FaMapMarkerAlt className="mr-1.5 text-muted-foreground" />
            {location}
          </div>
        </div>

        <p className="mb-5 text-muted-foreground leading-relaxed subheading text-sm">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {tech.map((item) => (
            <Chip key={item} className="text-xs px-2.5 py-1 subheading">
              {item}
            </Chip>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
