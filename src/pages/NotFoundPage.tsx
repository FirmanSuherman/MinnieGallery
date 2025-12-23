import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <div className="flex-1 flex items-center justify-center bg-white p-4 sm:p-16 text-sky-500">
        <div className="text-center">
          <h2 className="font-bold text-2xl sm:text-3xl mb-4">404 - Page Not Found</h2>
          <Link to="/" className="inline-block px-4 py-2 border-sky-500 border rounded-sm text-base sm:text-lg">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
