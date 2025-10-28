"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const singleWordRegex = /^\S+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateSingleWord = (value) => singleWordRegex.test(value.trim());
  const validateEmail = (value) => emailRegex.test(value.trim());

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validateSingleWord(trimmedPassword)) {
      setError("Password must be exactly one word without spaces.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to sign in with those credentials.");
      }

      sessionStorage.setItem("isAdminAuthenticated", "true");
      router.push("/admin");
    } catch (submitError) {
      setError(submitError.message || "Something went wrong while signing in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-50">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Admin Area</p>
          <h1 className="text-3xl font-semibold">Sign in to manage content</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium uppercase tracking-wide text-zinc-400">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              title="Enter a valid email address."
              placeholder="you@example.com"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-base text-zinc-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium uppercase tracking-wide text-zinc-400">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              title="Enter a single word without spaces."
              placeholder="Enter a single-word password"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-base text-zinc-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error ? (
            <p className="text-sm font-medium text-rose-400" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-500/50"
          >
            {isSubmitting ? "Signing in..." : "Enter Admin Panel"}
          </button>
        </form>
        <p className="text-center text-xs text-zinc-500">
          Passwords must be entered as a single word without spaces.
        </p>
      </div>
    </div>
  );
}
