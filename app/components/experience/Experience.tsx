"use client";

import { SectionHeader } from "../util/SectionHeader";
import { ExperienceItem } from "./ExperienceItem";
import { motion } from "framer-motion";

export const Experience = () => {
  return (
    <section
      className="section-wrapper text-foreground subheading py-16"
      id="experience"
    >
      <SectionHeader title="Experience" dir="l" />
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-foreground/30 via-foreground/10 to-transparent hidden md:block" />
        <motion.div
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {experience.map((item, index) => (
            <ExperienceItem key={item.title} {...item} index={index} />
          ))}
        </motion.div>
      </div>
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
      "Managing a portfolio of 200+ client websites while building approximately one new site per week for a Greenville, SC creative agency. Automated recurring development tasks including weekly site maintenance, plugin updates, and security audits to improve team efficiency. Building modern, responsive websites using WordPress, Elementor, and Beaver Builder for clients across various industries in the Upstate South Carolina area.",
    tech: [
      "WordPress",
      "Elementor",
      "Beaver Builder",
      "PHP",
      "JavaScript",
      "HTML",
      "CSS",
      "Git",
      "SQL",
      "Automation",
    ],
  },
  {
    title: "Chipp AI",
    logo: "/chipp.png",
    position: "Software Engineering Intern",
    time: "Aug 2024 - Jan 2025",
    location: "Remote",
    description:
      "Contributed to a fast-paced SaaS platform by building advanced features such as dynamic URL crawlers, third-party API integrations (Fireflies, Notion, Calendly), and enhanced user management systems. Implemented tools enabling AI agents to perform real-time RESTful API calls with formless data capture and submission. Streamlined assistant setup and cloning, and delivered polished creator profiles for users to display their custom AI agents.",
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
