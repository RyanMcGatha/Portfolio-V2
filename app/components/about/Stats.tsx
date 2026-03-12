"use client";

import { Chip } from "../util/Chip";
import Reveal from "../util/Reveal";
import { AiFillCode } from "react-icons/ai";
import Image from "next/image";
import { motion } from "framer-motion";

interface Tech {
  name: string;
  logo?: string;
}

const technologies: Record<string, Tech[]> = {
  frontend: [
    { name: "React" },
    { name: "Next.js", logo: "/logos/nextjs.svg" },
    { name: "TypeScript", logo: "/logos/typescript.svg" },
    { name: "JavaScript" },
    { name: "Tailwind CSS", logo: "/logos/tailwind.svg" },
    { name: "HTML/CSS" },
    { name: "Framer Motion", logo: "/logos/framer-motion.svg" },
    { name: "React Query", logo: "/logos/react-query.svg" },
  ],
  backend: [
    { name: "Node.js" },
    { name: "Express.js", logo: "/logos/express.svg" },
    { name: "Python" },
    { name: "FastAPI", logo: "/logos/fastapi.svg" },
    { name: "RESTful APIs", logo: "/logos/api.svg" },
    { name: "PHP" },
  ],
  "cms & builders": [
    { name: "WordPress" },
    { name: "Elementor" },
    { name: "Beaver Builder" },
  ],
  database: [
    { name: "PostgreSQL" },
    { name: "MySQL" },
    { name: "Supabase" },
    { name: "Prisma", logo: "/logos/prisma.svg" },
    { name: "SQLAlchemy", logo: "/logos/sqlalchemy.svg" },
  ],
  "devops & tools": [
    { name: "Git/GitHub" },
    { name: "Docker" },
    { name: "NGINX" },
    { name: "Linux" },
    { name: "JWT", logo: "/logos/jwt.svg" },
    { name: "ESLint" },
    { name: "Automation" },
  ],
};

export const Stats = () => {
  return (
    <div className="relative space-y-10">
      <Reveal>
        <div>
          <h4 className="flex items-center mb-8 text-2xl font-heading">
            <AiFillCode className="text-foreground text-3xl mr-2" />
            <span className="text-foreground">Skills & Technologies</span>
          </h4>
          <div className="space-y-8">
            {Object.entries(technologies).map(([category, techs]) => (
              <motion.div
                key={category}
                className="relative"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="mb-4">
                  <h5 className="text-xl font-heading capitalize text-foreground/80">
                    {category}
                  </h5>
                  <div className="h-1 w-20 rounded mt-1 bg-foreground/20" />
                </div>
                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05,
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
                      <Chip className="flex items-center gap-2 subheading hover:bg-foreground/5 transition-colors">
                        {tech.logo && (
                          <div className="relative w-5 h-5">
                            <Image
                              src={tech.logo}
                              alt={`${tech.name} logo`}
                              fill
                              className="object-contain"
                              sizes="20px"
                            />
                          </div>
                        )}
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
