"use client";

import { Chip } from "../util/Chip";
import Reveal from "../util/Reveal";
import { AiFillCode } from "react-icons/ai";
import Image from "next/image";
import { motion } from "framer-motion";

const technologies = {
  frontend: [
    { name: "React", logo: "/logos/react.svg" },
    { name: "Next.js", logo: "/logos/nextjs.svg" },
    { name: "TypeScript", logo: "/logos/typescript.svg" },
    { name: "JavaScript", logo: "/logos/javascript.svg" },
    { name: "Tailwind CSS", logo: "/logos/tailwind.svg" },
    { name: "React Query", logo: "/logos/react-query.svg" },
    { name: "React Hook Form", logo: "/logos/react.svg" },
    { name: "Anime.js", logo: "/logos/animejs.svg" },
    { name: "PostCSS", logo: "/logos/postcss.svg" },
  ],
  backend: [
    { name: "Node.js", logo: "/logos/nodejs.svg" },
    { name: "Express.js", logo: "/logos/express.svg" },
    { name: "FastAPI", logo: "/logos/fastapi.svg" },
    { name: "Python", logo: "/logos/python.svg" },
  ],
  database: [
    { name: "PostgreSQL", logo: "/logos/postgresql.svg" },
    { name: "MySQL", logo: "/logos/mysql.svg" },
    { name: "Prisma", logo: "/logos/prisma.svg" },
  ],
  devops: [
    { name: "Docker", logo: "/logos/docker.svg" },
    { name: "NGINX", logo: "/logos/nginx.svg" },
    { name: "Linux", logo: "/logos/linux.svg" },
    { name: "Git/GitHub", logo: "/logos/github.svg" },
  ],
  tools: [
    { name: "ESLint", logo: "/logos/eslint.svg" },
    { name: "Zod", logo: "/logos/zod.svg" },
    { name: "JWT", logo: "/logos/jwt.svg" },
  ],
};

export const Stats = () => {
  return (
    <div className="relative space-y-10">
      <Reveal>
        <div>
          <h4 className="flex items-center mb-8 text-2xl font-heading">
            <AiFillCode className="text-primary text-3xl mr-2" />
            <span className="text-foreground">Skills & Technologies</span>
          </h4>
          <div className="space-y-8">
            {Object.entries(technologies).map(([category, techs]) => (
              <motion.div
                key={category}
                className="relative"
                initial="hidden"
                animate="show"
              >
                <div className="mb-4">
                  <h5 className="text-xl font-heading capitalize text-primary/90">
                    {category}
                  </h5>
                  <div className="h-1 w-20 bg-primary rounded mt-1" />
                </div>
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
                >
                  {techs.map((tech) => (
                    <motion.div
                      key={tech.name}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 },
                      }}
                    >
                      <Chip className="flex items-center gap-2 subheading hover:bg-primary/10 transition-colors">
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
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
};
