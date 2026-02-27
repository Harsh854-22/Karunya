import { Leaf } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-karunya-200 border-t-karunya-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf className="w-7 h-7 text-karunya-500" />
          </div>
        </div>
        <p className="text-karunya-500 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
