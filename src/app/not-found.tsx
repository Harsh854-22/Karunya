import Link from "next/link";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-3xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-karunya-100 flex items-center justify-center mx-auto mb-4">
          <Leaf className="w-8 h-8 text-karunya-500" />
        </div>
        <h2 className="text-2xl font-display font-bold text-karunya-700 mb-2">
          Page Not Found
        </h2>
        <p className="text-karunya-500/70 text-sm mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-karunya-500 text-white 
            rounded-xl hover:bg-karunya-600 transition-colors font-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
