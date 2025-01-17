"use client";

import { Chip } from "../util/Chip";
import Reveal from "../util/Reveal";
import { AiFillCode } from "react-icons/ai";
import Image from "next/image";
import { motion } from "framer-motion";

const technologies = [
  { name: "JavaScript", logo: "/logos/javascript.svg" },
  { name: "TypeScript", logo: "/logos/typescript.svg" },
  { name: "React", logo: "/logos/react.svg" },
  { name: "Next.js", logo: "/logos/nextjs.svg" },
  { name: "Tailwind CSS", logo: "/logos/tailwind.svg" },
  { name: "Node.js", logo: "/logos/nodejs.svg" },
  { name: "Express.js", logo: "/logos/express.svg" },
  { name: "PostgreSQL", logo: "/logos/postgresql.svg" },
  { name: "MySQL", logo: "/logos/mysql.svg" },
  { name: "Prisma", logo: "/logos/prisma.svg" },
  { name: "Docker", logo: "/logos/docker.svg" },
  { name: "NGINX", logo: "/logos/nginx.svg" },
  { name: "Git/GitHub", logo: "/logos/github.svg" },
  { name: "JWT", logo: "/logos/jwt.svg" },
  { name: "FastAPI", logo: "/logos/fastapi.svg" },
  { name: "Zod", logo: "/logos/zod.svg" },
  { name: "Linux", logo: "/logos/linux.svg" },
  { name: "Python", logo: "/logos/python.svg" },
  { name: "React Query", logo: "/logos/react-query.svg" },
  { name: "React Hook Form", logo: "/logos/react.svg" },
  { name: "Anime.js", logo: "/logos/animejs.svg" },
  { name: "ESLint", logo: "/logos/eslint.svg" },
  { name: "PostCSS", logo: "/logos/postcss.svg" },
];

export const Stats = () => {
  return (
    <div className="relative space-y-10">
      <Reveal>
        <div>
          <h4 className="flex items-center mb-4 text-xl font-heading">
            <AiFillCode className="text-primary text-2xl mr-2" />
            <span className="text-foreground">Technologies I Work With</span>
          </h4>
          <motion.div
            className="flex flex-wrap gap-2"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="show"
          >
            {technologies.map((tech) => (
              <motion.div
                key={tech.name}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <Chip className="flex items-center gap-2 font-code">
                  <div className="relative w-5 h-5">
                    <Image
                      src={tech.logo || "/placeholder.svg"}
                      alt={`${tech.name} logo`}
                      fill
                      className="object-contain"
                      sizes="20px"
                    />
                  </div>
                  {tech.name}
                </Chip>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Reveal>
    </div>
  );
};
