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

              <div className="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
                <motion.div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-karunya-100 flex items-center justify-center mb-4 sm:mb-6"
                  animate={isDragActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  {isDragActive ? (
                    <Upload className="w-7 h-7 sm:w-9 sm:h-9 text-karunya-500" />
                  ) : (
                    <ImageIcon className="w-7 h-7 sm:w-9 sm:h-9 text-karunya-500" />
                  )}
                </motion.div>

                <h3 className="text-lg sm:text-xl font-semibold text-karunya-700 mb-2">
                  {isDragActive ? "Drop your food photo here" : "Upload Food Photo"}
                </h3>

                <p className="text-karunya-500/70 text-xs sm:text-sm text-center mb-4 sm:mb-6 max-w-xs">
                  Drag & drop an image of your food, or click to browse. We support JPG, PNG, WebP.
                </p>

                <div className="flex gap-2 sm:gap-3">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-karunya-500 text-white rounded-xl
                      hover:bg-karunya-600 transition-colors text-xs sm:text-sm font-medium shadow-lg shadow-karunya-500/20"
                  >
                    <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Browse Files
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Trigger camera on mobile
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
                    className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 border border-karunya-300/50 text-karunya-600 
                      rounded-xl hover:bg-karunya-50 transition-colors text-xs sm:text-sm font-medium"
                  >
                    <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white/60 shadow-xl shadow-karunya-900/5">
              <img
                src={preview}
                alt="Food preview"
                className="w-full h-48 sm:h-64 md:h-80 object-cover"
              />
              {!isLoading && (
                <button
                  onClick={clearPreview}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm 
                    rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
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
                w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 
                flex items-center justify-center gap-3 shadow-lg
                ${
                  isLoading
                    ? "bg-karunya-400 text-white/80 cursor-not-allowed shadow-karunya-400/20"
                    : "bg-karunya-500 text-white hover:bg-karunya-600 shadow-karunya-500/30"
                }
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing your food...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze with AI
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


