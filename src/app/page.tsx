"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import LoadingState from "@/components/LoadingState";
import AnalysisResult from "@/components/AnalysisResult";
import Footer from "@/components/Footer";
import type { AnalysisResponse } from "@/lib/types";

type AppState = "idle" | "analyzing" | "result" | "error";

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<AnalysisResponse["data"] | null>(null);
  const [error, setError] = useState<string>("");

  const handleUpload = async (file: File) => {
    setState("analyzing");
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data: AnalysisResponse = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data.data);
      setState("result");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setState("error");
    }
  };

  const handleReset = () => {
    setState("idle");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-start py-2 sm:py-4">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <ImageUpload
              onUpload={handleUpload}
              isLoading={false}
            />
          )}

          {state === "analyzing" && <LoadingState />}

          {state === "result" && result && (
            <AnalysisResult
              data={result}
              onReset={handleReset}
            />
          )}

          {state === "error" && (
            <div
              className="w-full max-w-xl mx-auto px-3 sm:px-4 py-8 sm:py-12 text-center"
            >
              <div className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-8">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-karunya-700 mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-gray-500 mb-8 text-base">{error}</p>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-karunya-700 text-white 
                    rounded-full hover:bg-karunya-800 hover:scale-105 active:scale-95 transition-all font-semibold"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
