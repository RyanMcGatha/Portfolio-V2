"use client";

import { useState, useEffect } from "react";

interface TypewriterEffectProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function TypewriterEffect({
  texts,
  typingSpeed = 100,
  deletingSpeed = 75,
  pauseDuration = 3500,
}: TypewriterEffectProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = texts[currentTextIndex];
    const speed = isDeleting ? deletingSpeed : typingSpeed;

    const handleTyping = () => {
      if (!isDeleting && currentText === currentWord) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      }

      if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        return;
      }

      const nextText = isDeleting
        ? currentWord.slice(0, currentText.length - 1)
        : currentWord.slice(0, currentText.length + 1);

      setCurrentText(nextText);
    };

    const timeout = setTimeout(handleTyping, speed);
    return () => clearTimeout(timeout);
  }, [
    currentText,
    currentTextIndex,
    isDeleting,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return (
    <span className="text-foreground">
      {currentText}
      <span className="animate-blink ml-0.5">|</span>
    </span>
  );
}
