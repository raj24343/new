// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg space-y-4 w-80 text-center border border-green-200">
        <h1 className="text-2xl font-bold text-green-700 mb-6">Navigation Page</h1>

        <Link href="/classes">
          <button className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition">
            classes
          </button>
        </Link>

        <Link href="/students">
          <button className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition">
            students
          </button>
        </Link>

        <Link href="/teachers">
          <button className="w-full py-3 rounded-xl bg-green-400 text-white font-semibold hover:bg-green-500 transition">
            teachers
          </button>
        </Link>
      </div>
    </div>
  );
}
