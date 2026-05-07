"use client";

import Image from "next/image";
import { Chip } from "../util/Chip";
import Reveal from "../util/Reveal";
import { AiFillCode } from "react-icons/ai";
import { motion } from "framer-motion";

interface Tech {
  name: string;
  logo?: string;
  darkInvert?: boolean;
}

const technologies: Record<string, Tech[]> = {
  "design & ui": [
    { name: "Figma" },
    { name: "UI Design" },
    { name: "UX Design" },
    { name: "Wireframing" },
    { name: "Prototyping" },
    { name: "Design Systems" },
    { name: "Responsive Design" },
    { name: "Motion Design" },
    { name: "Web Design" },
  ],
  frontend: [
    { name: "React" },
    { name: "Next.js", logo: "/logos/nextjs.svg", darkInvert: true },
    { name: "TypeScript", logo: "/logos/typescript.svg" },
    { name: "JavaScript" },
    { name: "Tailwind CSS", logo: "/logos/tailwind.svg" },
    { name: "HTML/CSS" },
    { name: "Framer Motion", logo: "/logos/framer-motion.svg", darkInvert: true },
    { name: "React Query", logo: "/logos/react-query.svg" },
  ],
  backend: [
    { name: "Node.js" },
    { name: "Express.js", logo: "/logos/express.svg", darkInvert: true },
    { name: "Python" },
    { name: "FastAPI", logo: "/logos/fastapi.svg", darkInvert: true },
    { name: "RESTful APIs", logo: "/logos/api.svg", darkInvert: true },
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
    { name: "Prisma", logo: "/logos/prisma.svg", darkInvert: true },
    { name: "SQLAlchemy", logo: "/logos/sqlalchemy.svg", darkInvert: true },
  ],
  "ai & machine learning": [
    { name: "OpenAI / GPT-4" },
    { name: "Anthropic Claude" },
    { name: "LangChain" },
    { name: "LlamaIndex" },
    { name: "RAG Pipelines" },
    { name: "AI Agents" },
    { name: "Vector Databases" },
    { name: "Hugging Face" },
    { name: "Prompt Engineering" },
    { name: "Vercel AI SDK" },
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
          <h3 className="flex items-center mb-8 text-2xl font-heading">
            <AiFillCode className="text-foreground text-3xl mr-2" />
            <span className="text-foreground">Skills & Technologies</span>
          </h3>
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
                  <h4 className="text-xl font-heading capitalize text-foreground/80">
                    {category}
                  </h4>
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
                          <Image
                            src={tech.logo}
                            alt=""
                            aria-hidden="true"
                            width={20}
                            height={20}
                            sizes="20px"
                            loading="lazy"
                            unoptimized
                            className={`w-5 h-5 object-contain ${tech.darkInvert ? "dark:invert" : ""}`}
                          />
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
