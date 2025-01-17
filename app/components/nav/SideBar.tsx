"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SideBarLink } from "./SideBarLink";
import {
  AiOutlineHome,
  AiOutlineProject,
  AiOutlineExperiment,
  AiOutlineContacts,
} from "react-icons/ai";
import Image from "next/image";
export const SideBar = () => {
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const sections = document.querySelectorAll(".section-wrapper");

    const options = {
      threshold: 0.3,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setSelected(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ x: -70 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="no-scrollbar bg-background h-screen sticky top-0 left-0 z-30 flex flex-col items-center  border-r border-border w-16 md:w-20 font-body"
    >
      <div className="shrink-0 leading-[1] size-16 flex items-center justify-center p-2 my-2">
        <Image
          src="/headshot.jpeg"
          alt="Logo"
          width={200}
          height={200}
          className="rounded-[--radius] border-2 border-primary"
        />
      </div>
      <SideBarLink
        selected={selected}
        setSelected={setSelected}
        value="about"
        href="#about"
        icon={<AiOutlineHome />}
      >
        About
      </SideBarLink>
      <SideBarLink
        selected={selected}
        setSelected={setSelected}
        value="projects"
        href="#projects"
        icon={<AiOutlineProject />}
      >
        Projects
      </SideBarLink>
      <SideBarLink
        selected={selected}
        setSelected={setSelected}
        value="experience"
        href="#experience"
        icon={<AiOutlineExperiment />}
      >
        Exp.
      </SideBarLink>
      <SideBarLink
        selected={selected}
        setSelected={setSelected}
        value="contact"
        href="#contact"
        icon={<AiOutlineContacts />}
      >
        Contact
      </SideBarLink>
    </motion.nav>
  );
};
