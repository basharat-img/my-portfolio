"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const singleWordRegex = /^\S+$/;

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthorised, setIsAuthorised] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [tagName, setTagName] = useState("");
  const [tagFeedback, setTagFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    const isAuthenticated =
      typeof window !== "undefined" && sessionStorage.getItem("isAdminAuthenticated");

    if (!isAuthenticated) {
      setIsAuthorised(false);
      setIsCheckingAuth(false);
      router.replace("/admin/login");
      return;
    }

    setIsAuthorised(true);
    setIsCheckingAuth(false);
  }, [router]);

  const analytics = useMemo(
    () => [
      { label: "New Leads", value: 24 },
      { label: "Active Projects", value: 5 },
      { label: "Pending Approvals", value: 3 },
    ],
    []
  );

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminAuthenticated");
    router.push("/admin/login");
  };

  const handleTagSubmit = (event) => {
    event.preventDefault();
    const trimmedTag = tagName.trim();

    if (!singleWordRegex.test(trimmedTag)) {
      setTagFeedback({ type: "error", message: "Tags must contain exactly one word." });
      return;
    }

    setTagFeedback({ type: "success", message: `Tag “${trimmedTag}” saved successfully.` });
    setTagName("");
  };

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Verifying access…</p>
      </div>
    );
  }

  if (!isAuthorised) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-10 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Dashboard</p>
            <h1 className="text-3xl font-semibold">Welcome back, Admin</h1>
            <p className="max-w-xl text-sm text-slate-400">
              Review high-level metrics and manage portfolio content in one unified workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="self-start rounded-xl border border-slate-700 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-indigo-400 hover:text-white"
          >
            Log out
          </button>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {analytics.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg transition hover:border-indigo-500"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
              <p className="mt-4 text-3xl font-semibold">{stat.value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <article className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/40 p-8 shadow-lg">
            <header className="space-y-1">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Content tags</p>
              <h2 className="text-2xl font-semibold">Create a featured tag</h2>
              <p className="text-sm text-slate-400">
                Single-word tags keep your admin taxonomy tidy. Use the form below to add a new highlight tag for upcoming projects.
              </p>
            </header>
            <form onSubmit={handleTagSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="tag" className="block text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
                  Tag name
                </label>
                <input
                  id="tag"
                  name="tag"
                  type="text"
                  pattern="\\S+"
                  title="Enter a single descriptive word without spaces."
                  placeholder="e.g. Spotlight"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  value={tagName}
                  onChange={(event) => {
                    setTagName(event.target.value);
                    if (tagFeedback.message) {
                      setTagFeedback({ type: "", message: "" });
                    }
                  }}
                />
              </div>
              {tagFeedback.message ? (
                <p
                  className={`text-sm ${tagFeedback.type === "success" ? "text-emerald-400" : "text-rose-400"}`}
                  role="status"
                >
                  {tagFeedback.message}
                </p>
              ) : null}
              <button
                type="submit"
                className="rounded-xl bg-indigo-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-indigo-400"
              >
                Save tag
              </button>
            </form>
          </article>

          <article className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/40 p-8 shadow-lg">
            <header className="space-y-1">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Quick tips</p>
              <h2 className="text-xl font-semibold">Stay organised</h2>
            </header>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>Use single-word categories for faster filtering.</li>
              <li>Review drafts weekly to keep your portfolio fresh.</li>
              <li>Archive outdated assets to focus on upcoming launches.</li>
            </ul>
          </article>
        </section>
      </div>
    </div>
  );
}
