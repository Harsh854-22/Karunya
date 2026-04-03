"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, X, Image as ImageIcon, Loader2, Sparkles } from "lucide-react";

interface ImageUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export default function ImageUpload({ onUpload, isLoading }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Client-side image compression via canvas
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 1024;
        let { width, height } = img;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height / width) * maxDim;
            width = maxDim;
          } else {
            width = (width / height) * maxDim;
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
              });
              setSelectedFile(compressedFile);
              setPreview(canvas.toDataURL("image/jpeg", 0.85));
            }
          },
          "image/jpeg",
          0.85
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  const handleAnalyze = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-xl mx-auto px-3 sm:px-4"
    >
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div
              {...getRootProps()}
              className={`
                relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-dashed
                transition-all duration-300 cursor-pointer
                ${
                  isDragActive
                    ? "border-karunya-400 bg-karunya-50/50 scale-[1.02]"
                    : "border-karunya-300/40 hover:border-karunya-400/60 bg-white/40"
                }
              `}
            >
              <input {...getInputProps()} />

              <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-6 sm:px-8">
                <motion.div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-[32px] bg-karunya-900/5 flex items-center justify-center mb-8"
                  whileHover={{ scale: 1.05, rotate: isDragActive ? 0 : -5 }}
                  animate={isDragActive ? { scale: [1, 1.05, 1], rotate: [0, 5, 0] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {isDragActive ? (
                    <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-karunya-500" />
                  ) : (
                    <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                  )}
                </motion.div>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-karunya-900 mb-3">
                  {isDragActive ? "Drop to analyze" : "Drop it here."}
                </h3>

                <p className="text-gray-500 text-sm sm:text-base text-center mb-8 max-w-sm font-medium">
                  We support JPG, PNG, and WebP, instantly analyzed by AI.
                </p>

                <div className="flex gap-4 sm:gap-4">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-6 py-3.5 bg-karunya-900 text-white rounded-full
                      hover:bg-karunya-800 hover:scale-105 active:scale-95 transition-all text-sm sm:text-base font-semibold"
                  >
                    <Upload className="w-4 h-4" />
                    Browse
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.capture = "environment";
                      input.onchange = (ev) => {
                        const target = ev.target as HTMLInputElement;
                        if (target.files?.[0]) {
                          onDrop([target.files[0]]);
                        }
                      };
                      input.click();
                    }}
                    className="flex items-center gap-2 px-6 py-3.5 bg-gray-100 text-karunya-900 
                      rounded-full hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all text-sm sm:text-base font-semibold"
                  >
                    <Camera className="w-4 h-4" />
                    Camera
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Image Preview */}
            <div className="relative rounded-[32px] overflow-hidden bg-gray-100 shadow-2xl">
              <img
                src={preview}
                alt="Food preview"
                className="w-full h-64 sm:h-96 object-cover"
              />
              {!isLoading && (
                <button
                  onClick={clearPreview}
                  className="absolute top-4 right-4 w-10 h-10 bg-karunya-900/60 hover:bg-karunya-900/80 backdrop-blur-md 
                    rounded-full flex items-center justify-center transition-all scale-100 hover:scale-110"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              )}
            </div>

            {/* Analyze Button */}
            <motion.button
              onClick={handleAnalyze}
              disabled={isLoading}
              whileHover={isLoading ? {} : { scale: 1.02 }}
              whileTap={isLoading ? {} : { scale: 0.98 }}
              className={`
                w-full py-5 rounded-full font-bold text-lg transition-all duration-300 
                flex items-center justify-center gap-3 shadow-xl mb-12 shadow-karunya-500/20
                ${
                  isLoading
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-karunya-500 text-white hover:bg-karunya-600 hover:shadow-karunya-500/40"
                }
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-karunya-500" />
                  Analyzing image...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Analyze
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


