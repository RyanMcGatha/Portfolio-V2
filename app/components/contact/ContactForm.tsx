"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "../util/ConversionTracking";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      message: fd.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong.");
        trackEvent("contact_form_error", { page_path: window.location.pathname });
        return;
      }

      setStatus("success");
      formRef.current?.reset();
      // GA4 recommended event name — mark this as a key event in GA4 Admin so
      // the report can show leads instead of only pageviews.
      trackEvent("generate_lead", {
        form_name: "contact",
        page_path: window.location.pathname,
      });
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="text-center py-8"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-foreground/10 mb-4">
              <svg
                className="w-7 h-7 text-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-lg font-heading text-foreground mb-2">
              Message sent!
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              I&apos;ll get back to you as soon as possible.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="text-sm font-heading text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-heading text-foreground mb-1.5"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  placeholder="Your name"
                  disabled={status === "sending"}
                  className="w-full px-4 py-2.5 rounded-[--radius] border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-colors disabled:opacity-50 font-body text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-heading text-foreground mb-1.5"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  disabled={status === "sending"}
                  className="w-full px-4 py-2.5 rounded-[--radius] border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-colors disabled:opacity-50 font-body text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-heading text-foreground mb-1.5"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                minLength={10}
                rows={5}
                placeholder="Tell me about your project..."
                disabled={status === "sending"}
                className="w-full px-4 py-2.5 rounded-[--radius] border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-colors disabled:opacity-50 resize-y min-h-[120px] font-body text-sm"
              />
            </div>

            <AnimatePresence>
              {status === "error" && errorMsg && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-red-500 font-heading"
                >
                  {errorMsg}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full sm:w-auto px-8 py-2.5 bg-foreground text-background rounded-[--radius] font-heading text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "sending" ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
