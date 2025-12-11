"use client";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) return <p>Please login</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Welcome, {session.user?.name || "User"}!
      </h1>
      <p className="text-gray-600">Role: {session.user?.role}</p>
    </div>
  );
}
