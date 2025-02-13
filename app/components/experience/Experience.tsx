"use client";

import { SectionHeader } from "../util/SectionHeader";
import { ExperienceItem } from "./ExperienceItem";
import { motion } from "framer-motion";

export const Experience = () => {
  return (
    <section
      className="section-wrapper text-foreground border-border subheading py-16"
      id="experience"
    >
      <SectionHeader title="Experience" dir="l" />
      <motion.div
        className="space-y-12"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.3,
            },
          },
        }}
      >
        {experience.map((item, index) => (
          <ExperienceItem key={item.title} {...item} index={index} />
        ))}
      </motion.div>
    </section>
  );
};

const experience = [
  {
    title: "Drum Creative",
    logo: "/drum.jpeg",
    position: "Web Developer",
    time: "Feb 2025 - Present",
    location: "Greenville, SC",
    description:
      "Web Developer focused on creating modern, responsive websites and web applications for clients across various industries.",
    tech: [
      "WordPress",
      "Elementor",
      "PHP",
      "JavaScript",
      "HTML",
      "CSS",
      "Git",
      "SQL",
    ],
  },
  {
    title: "Chipp AI",
    logo: "/chipp.png",
    position: "Software Engineering Intern",
    time: "Aug 2024 - Jan 2025",
    location: "Remote",
    description:
      "Contributed to a fast-paced SaaS platform by building advanced features such as dynamic URL crawlers, third-party API integrations (Fireflies, Notion, Calendly), and enhanced user management systems. Implemented tools enabling Ai agents to preform real-time RESTful API calls with formless data capture and submission. Streamlined assistant setup and cloning, and delivered polished creator profiles for users to display their custom Ai agents.",
    tech: [
      "React.js",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Express.js",
      "RESTful APIs",
      "Tailwind CSS",
      "Framer Motion",
      "Shadcn/UI",
      "Git",
      "GitHub",
      "Docker",
    ],
  },
  {
    title: "Sully's Steamers",
    logo: "/sullys.png",
    position: "Contract Software Developer",
    time: "Mar 2024",
    location: "Greenville, SC",
    description:
      "Developed a comprehensive Franchise Document Management System to optimize operations through secure uploading, managing, and sharing of critical documents. Leveraged real-time data handling and a modern UI to improve overall efficiency and user engagement.",
    tech: ["React.js", "PostgreSQL", "Tailwind CSS", "Supabase", "GitHub"],
  },
  {
    title: "Carolina Code School",
    logo: "/ccs.png",
    position: "Full Stack Web Development",
    time: "2024",
    location: "Greenville, SC",
    description:
      "Completed a rigorous full-stack program, mastering practical skills in React, PostgreSQL, Node.js, Express.js, and Tailwind CSS. Engaged in real-world projects and gained hands-on experience with best practices for modern web development.",
    tech: [
      "React.js",
      "PostgreSQL",
      "Node.js",
      "Express.js",
      "Tailwind CSS",
      "JavaScript",
      "Git",
      "GitHub",
      "Python",
      "SQLAlchemy",
      "FastAPI",
    ],
  },
];
