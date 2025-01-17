import React from "react";
import { SideBar } from "./components/nav/SideBar";
import { Header } from "./components/nav/Header";
import Hero from "./components/hero/Hero";
import { About } from "./components/about/About";
import { Experience } from "./components/experience/Experience";
import { Contact } from "./components/contact/Contact";
import { Projects } from "./components/projects/Projects";

export default function Home() {
  return (
    <div className="grid grid-cols-[64px_1fr] md:grid-cols-[80px_1fr]">
      <SideBar />
      <main>
        <Header />

        <div className="mx-auto px-4 md:px-8 space-y-32 pb-24 max-w-7xl">
          <Hero />
          <About />
          <Projects />
          <Experience />
          <Contact />
        </div>
      </main>
    </div>
  );
}
