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
  index,
  logo,
}: Props) => {
  return (
    <motion.div
      className="mb-6 border-b pb-6 border-border hover:bg-muted/50 rounded-lg p-6 transition-all duration-300"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <motion.div
          className="flex items-center mb-2 md:mb-0 gap-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 * index }}
        >
          {logo ? (
            <Image
              src={logo}
              alt={`${title} logo`}
              className="w-12 h-12 object-contain"
              width={100}
              height={100}
            />
          ) : (
            <FaBriefcase className="text-primary mr-2" />
          )}
          <span className="font-heading text-2xl text-foreground whitespace-nowrap">
            {title}
          </span>
        </motion.div>
        <motion.div
          className="flex items-center text-muted-foreground font-code"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 * index + 0.1 }}
        >
          <FaClock className="mr-2" />
          {time}
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <motion.div
          className="flex items-center mb-2 md:mb-0"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 * index + 0.2 }}
        >
          <span className="text-primary font-heading text-lg">{position}</span>
        </motion.div>
        <motion.div
          className="flex items-center text-muted-foreground subheading"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 * index + 0.3 }}
        >
          <FaMapMarkerAlt className="mr-2" />
          {location}
        </motion.div>
      </div>
      <motion.p
        className="mb-6 text-muted-foreground leading-relaxed subheading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 * index + 0.4 }}
      >
        {description}
      </motion.p>
      <motion.div
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 * index + 0.5 }}
      >
        {tech.map((item) => (
          <Chip key={item} className="subheading">
            {item}
          </Chip>
        ))}
      </motion.div>
    </motion.div>
  );
};
