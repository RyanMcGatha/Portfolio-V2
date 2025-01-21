import React from "react";
import { SectionHeader } from "../util/SectionHeader";
import { Project } from "./Project";

export const Projects = () => {
  return (
    <section className="section-wrapper py-16 subheading" id="projects">
      <SectionHeader title="Projects" dir="r" />
      <div className="grid gap-8 md:gap-12 grid-cols-1 md:grid-cols-2 mt-8">
        {projects.map((project) => (
          <Project key={project.title} {...project} />
        ))}
      </div>
    </section>
  );
};

const projects = [
  {
    title: "Push It! Real-Time Messaging App",
    imgSrc: "/pushit.dev.png",
    code: "https://github.com/RyanMcGatha/Push-It---Messaging-App",
    projectLink: "https://push-it.netlify.app",
    tech: ["React.js", "PostgreSQL", "Node.js", "Express.js", "JWT"],
    description:
      "Created 'Push It!', a real-time messaging application offering secure user registration and dynamic messaging capabilities.",
    modalContent: (
      <>
        <p>
          {`"Push It! is a real-time messaging application developed with
          React.js, PostgreSQL, Node.js, Express.js, and JWT. It offers secure
          user registration and dynamic messaging features.`}
        </p>
        <p>
          This project showcases my ability to quickly learn and apply new
          technologies, demonstrating my skills in full-stack development.
        </p>
      </>
    ),
  },
  {
    title: "Internal Franchise Document Management System",
    imgSrc: "/steamyfiles.png",
    code: "https://github.com/RyanMcGatha/sullys-franchise-management-system",
    projectLink: "https://steamyfiles.com/",
    tech: ["React.js", "PostgreSQL", "Tailwind CSS", "Supabase"],
    description:
      "Developed a comprehensive document management system to enhance operational efficiency and support franchise expansion.",
    modalContent: (
      <>
        <p>
          The Internal Franchise Document Management System is designed to
          streamline operations and support franchise expansion.
        </p>
        <p>
          {`
          Utilizing React.js for the frontend, PostgreSQL for database
          management, Tailwind CSS for styling, and Supabase for backend
          services, this project significantly improved the company&apos;s
          operational efficiency.`}
        </p>
      </>
    ),
  },
  {
    title: "FastAPI Tutorial",
    imgSrc: "/fastapi.png",
    code: "https://github.com/RyanMcGatha/fast-api-tutorial",
    projectLink: "https://fastapi-tutorial.netlify.app/",
    tech: ["Python", "FastAPI", "PostgreSQL"],
    description:
      "Developed a tutorial project demonstrating the use of FastAPI with PostgreSQL, including a preset API route with customizable request parameters.",
    modalContent: (
      <>
        <p>
          The FastAPI Tutorial project demonstrates the use of FastAPI with
          PostgreSQL. It features a preset API route with drop-down menus to
          customize different parts of the API request.
        </p>
        <p>
          This project is designed to teach students how to build efficient and
          scalable backend services using FastAPI.
        </p>
      </>
    ),
  },
];
