"use client";

import { useState, useEffect } from "react";

interface TypewriterEffectProps {
  texts: string[];
  typingSpeed?: number; // milliseconds between each new character
  deletingSpeed?: number; // milliseconds between each removed character
  pauseDuration?: number; // pause (in ms) when a word is fully typed
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
    // Grab the current word we want to animate
    const currentWord = texts[currentTextIndex];

    // Determine the correct speed based on whether we are adding or removing characters
    const speed = isDeleting ? deletingSpeed : typingSpeed;

    const handleTyping = () => {
      if (!isDeleting && currentText === currentWord) {
        // If we've just finished typing the word, pause before deleting
        setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      }

      if (isDeleting && currentText === "") {
        // Once we've deleted the whole word, move on to the next word
        setIsDeleting(false);
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        return;
      }

      // Determine the next text substring
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
    <span>
      {currentText}
      {/* This is the blinking cursor. You can style it via CSS if you prefer. */}
      <span className="animate-blink">|</span>
    </span>
  );
}
