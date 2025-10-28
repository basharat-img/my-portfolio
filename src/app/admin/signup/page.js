"use client";

import { useState } from "react";
import Link from "next/link";

const SINGLE_WORD_PATTERN = /^\S+$/;

export default function AdminSignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!SINGLE_WORD_PATTERN.test(username) || !SINGLE_WORD_PATTERN.test(password)) {
      setStatus({
        type: "error",
        message: "Both username and password must be a single word.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ type: "pending", message: "Creating admin account..." });

      const response = await fetch("/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to create admin account.");
      }

      setStatus({ type: "success", message: result.message });
      setUsername("");
      setPassword("");
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-zinc-900">Admin Sign Up</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Create a new administrator account for the portfolio dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-800" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value.replace(/\s+/g, ""))
              }
              required
              // pattern="^\S+$"
              title="Please enter a single word without spaces."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              placeholder="admin"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-800" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value.replace(/\s+/g, ""))
              }
              required
              // pattern="^\S+$"
              title="Please enter a single word without spaces."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              placeholder="••••••"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {isSubmitting ? "Creating..." : "Create Admin"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-600">
          <Link className="font-medium text-zinc-900 hover:underline" href="/">
            Return to homepage
          </Link>
        </div>

        {status.type !== "idle" && (
          <p
            className={`mt-6 rounded-lg px-4 py-3 text-sm font-medium ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : status.type === "error"
                ? "bg-rose-50 text-rose-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
}
