"use client";

import { useMemo, useState } from "react";

const initialPortfolio = {
  hero: {
    name: "Basharat Khan",
    role: "MERN Stack Developer",
    location: "Mumbai, India",
    tagline: "Full-stack developer crafting scalable MERN applications.",
    intro:
      "Hi, I’m Basharat — a MERN stack developer building modern web apps with clean architecture and great UX.",
    profileImage:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
    github: "https://github.com/basharat-dev",
    linkedin: "https://linkedin.com/in/basharat-dev",
    email: "mailto:basharat@example.com",
    resume: "https://example.com/resume.pdf",
  },
  about: {
    background:
      "I am a computer science graduate with 4+ years of experience designing and delivering end-to-end web products.",
    drives:
      "I thrive on solving complex problems, collaborating with UX teams, and building scalable systems.",
    interests:
      "Away from the laptop I mentor bootcamp students, experiment with indie SaaS ideas, and explore UI animations.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
  },
  skills: {
    frontend: ["React", "Next.js", "Redux", "TailwindCSS"],
    backend: ["Node.js", "Express", "REST APIs", "GraphQL", "JWT auth"],
    database: ["MongoDB", "Mongoose", "PostgreSQL"],
    tools: ["Git", "GitHub", "Docker", "Postman", "VS Code"],
    others: ["Firebase", "AWS", "CI/CD"],
  },
};

const skillGroups = [
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "database", label: "Database" },
  { key: "tools", label: "Dev Tools" },
  { key: "others", label: "Others" },
];

const contactLinks = [
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "email", label: "Email" },
];

function hasSingleWordOrMore(value) {
  return value.trim().split(/\s+/).filter(Boolean).length >= 1;
}

export default function Home() {
  const [portfolioData, setPortfolioData] = useState(initialPortfolio);
  const [heroForm, setHeroForm] = useState(initialPortfolio.hero);
  const [aboutForm, setAboutForm] = useState({
    background: initialPortfolio.about.background,
    drives: initialPortfolio.about.drives,
    interests: initialPortfolio.about.interests,
    tech: initialPortfolio.about.tech.join(", "),
  });
  const [skillsForm, setSkillsForm] = useState(
    Object.fromEntries(
      skillGroups.map(({ key }) => [key, initialPortfolio.skills[key].join(", ")])
    )
  );
  const [errors, setErrors] = useState({ hero: "", about: "", skills: "" });
  const [status, setStatus] = useState({ hero: "", about: "", skills: "" });

  const heroContacts = useMemo(
    () =>
      contactLinks
        .map(({ key, label }) => ({ label, value: portfolioData.hero[key] }))
        .filter((item) => item.value),
    [portfolioData.hero]
  );

  const handleHeroSubmit = (event) => {
    event.preventDefault();
    const requiredFields = [
      "name",
      "role",
      "location",
      "tagline",
      "intro",
      "profileImage",
      "github",
      "linkedin",
      "email",
    ];

    const invalid = requiredFields.some((field) => !hasSingleWordOrMore(heroForm[field] || ""));

    if (invalid) {
      setErrors((prev) => ({
        ...prev,
        hero: "Please ensure every required hero field contains at least one word.",
      }));
      setStatus((prev) => ({ ...prev, hero: "" }));
      return;
    }

    setPortfolioData((prev) => ({
      ...prev,
      hero: { ...heroForm },
    }));
    setErrors((prev) => ({ ...prev, hero: "" }));
    setStatus((prev) => ({ ...prev, hero: "Hero section updated." }));
  };

  const handleAboutSubmit = (event) => {
    event.preventDefault();
    const { background, drives, interests, tech } = aboutForm;
    const requiredFields = [background, drives, interests];
    const invalid = requiredFields.some((value) => !hasSingleWordOrMore(value || ""));

    if (invalid) {
      setErrors((prev) => ({
        ...prev,
        about: "Please fill in each about field with at least one word.",
      }));
      setStatus((prev) => ({ ...prev, about: "" }));
      return;
    }

    const techList = tech
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    setPortfolioData((prev) => ({
      ...prev,
      about: {
        background,
        drives,
        interests,
        tech: techList,
      },
    }));
    setErrors((prev) => ({ ...prev, about: "" }));
    setStatus((prev) => ({ ...prev, about: "About section updated." }));
  };

  const handleSkillsSubmit = (event) => {
    event.preventDefault();
    const invalid = skillGroups.some(({ key }) => !hasSingleWordOrMore(skillsForm[key] || ""));

    if (invalid) {
      setErrors((prev) => ({
        ...prev,
        skills: "Add at least one word to every skills field before saving.",
      }));
      setStatus((prev) => ({ ...prev, skills: "" }));
      return;
    }

    const formattedSkills = Object.fromEntries(
      skillGroups.map(({ key }) => [
        key,
        skillsForm[key]
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0),
      ])
    );

    setPortfolioData((prev) => ({
      ...prev,
      skills: formattedSkills,
    }));
    setErrors((prev) => ({ ...prev, skills: "" }));
    setStatus((prev) => ({ ...prev, skills: "Skills section updated." }));
  };

  return (
    <main className="px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <section className="rounded-3xl border border-slate-800/60 bg-slate-900/60 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur">
          <header className="flex flex-col gap-6 border-b border-slate-800/70 pb-6 lg:flex-row lg:items-center">
            <div className="h-28 w-28 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
              <img
                src={portfolioData.hero.profileImage}
                alt={`${portfolioData.hero.name} avatar`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-sky-400">Hero / Introduction</p>
              <h1 className="text-3xl font-semibold text-slate-50">
                {portfolioData.hero.name}
              </h1>
              <p className="text-lg font-medium text-sky-300">
                {portfolioData.hero.role} · {portfolioData.hero.location}
              </p>
              <p className="text-base text-slate-300">{portfolioData.hero.tagline}</p>
              <p className="text-sm text-slate-400">{portfolioData.hero.intro}</p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {heroContacts.map(({ label, value }) => (
                  <a
                    key={label}
                    href={value}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-400/80 hover:text-sky-300"
                  >
                    <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden />
                    {label}
                  </a>
                ))}
                {portfolioData.hero.resume && (
                  <a
                    href={portfolioData.hero.resume}
                    className="inline-flex items-center gap-2 rounded-full bg-sky-500/90 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                  >
                    <span aria-hidden>⬇️</span>
                    Download Resume
                  </a>
                )}
              </div>
            </div>
          </header>

          <section className="mt-8 space-y-8">
            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6">
              <h2 className="text-xl font-semibold text-slate-100">About Me</h2>
              <p className="mt-3 text-slate-300">{portfolioData.about.background}</p>
              <p className="mt-3 text-slate-300">{portfolioData.about.drives}</p>
              <p className="mt-3 text-slate-300">{portfolioData.about.interests}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {portfolioData.about.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-slate-700/80 bg-slate-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6">
              <h2 className="text-xl font-semibold text-slate-100">Skills</h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {skillGroups.map(({ key, label }) => (
                  <div key={key} className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                      {label}
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-200">
                      {portfolioData.skills[key].map((item) => (
                        <li key={item} className="rounded-lg bg-slate-900/80 px-3 py-2">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>

        <aside className="space-y-8 lg:sticky lg:top-12">
          <div className="rounded-3xl border border-slate-800/60 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-slate-100">Hero Admin</h3>
            <p className="text-sm text-slate-400">
              Update your introduction, contact links, and hero visuals.
            </p>
            <form onSubmit={handleHeroSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="text-slate-300">Name</span>
                  <input
                    type="text"
                    value={heroForm.name}
                    onChange={(event) =>
                      setHeroForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="text-slate-300">Role</span>
                  <input
                    type="text"
                    value={heroForm.role}
                    onChange={(event) =>
                      setHeroForm((prev) => ({ ...prev, role: event.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
                    required
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Location</span>
                <input
                  type="text"
                  value={heroForm.location}
                  onChange={(event) =>
                    setHeroForm((prev) => ({ ...prev, location: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
                  required
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Professional Tagline</span>
                <input
                  type="text"
                  value={heroForm.tagline}
                  onChange={(event) =>
                    setHeroForm((prev) => ({ ...prev, tagline: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
                  required
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Short Introduction</span>
                <textarea
                  value={heroForm.intro}
                  onChange={(event) =>
                    setHeroForm((prev) => ({ ...prev, intro: event.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                  required
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Profile Image URL</span>
                <input
                  type="url"
                  value={heroForm.profileImage}
                  onChange={(event) =>
                    setHeroForm((prev) => ({ ...prev, profileImage: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
                  required
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="text-slate-300">GitHub URL</span>
                  <input
                    type="url"
                    value={heroForm.github}
                    onChange={(event) =>
                      setHeroForm((prev) => ({ ...prev, github: event.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="text-slate-300">LinkedIn URL</span>
                  <input
                    type="url"
                    value={heroForm.linkedin}
                    onChange={(event) =>
                      setHeroForm((prev) => ({ ...prev, linkedin: event.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
                    required
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Email Link</span>
                <input
                  type="email"
                  value={heroForm.email.replace(/^mailto:/, "")}
                  onChange={(event) =>
                    setHeroForm((prev) => ({
                      ...prev,
                      email: `mailto:${event.target.value.replace(/\s+/g, "")}`,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
                  required
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Resume URL (optional)</span>
                <input
                  type="url"
                  value={heroForm.resume}
                  onChange={(event) =>
                    setHeroForm((prev) => ({ ...prev, resume: event.target.value }))
                  }
                  placeholder="https://example.com/resume.pdf"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
                />
              </label>
              {errors.hero && <p className="text-sm text-rose-400">{errors.hero}</p>}
              {status.hero && <p className="text-sm text-emerald-400">{status.hero}</p>}
              <button
                type="submit"
                className="w-full rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Save Hero Section
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-800/60 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-slate-100">About Admin</h3>
            <p className="text-sm text-slate-400">
              Share your story and the technologies you love working with.
            </p>
            <form onSubmit={handleAboutSubmit} className="mt-6 space-y-4">
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Background</span>
                <textarea
                  value={aboutForm.background}
                  onChange={(event) =>
                    setAboutForm((prev) => ({ ...prev, background: event.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                  required
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">What drives you?</span>
                <textarea
                  value={aboutForm.drives}
                  onChange={(event) =>
                    setAboutForm((prev) => ({ ...prev, drives: event.target.value }))
                  }
                  rows={2}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                  required
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Personal touches</span>
                <textarea
                  value={aboutForm.interests}
                  onChange={(event) =>
                    setAboutForm((prev) => ({ ...prev, interests: event.target.value }))
                  }
                  rows={2}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                  required
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Tech stack (comma separated)</span>
                <input
                  type="text"
                  value={aboutForm.tech}
                  onChange={(event) =>
                    setAboutForm((prev) => ({ ...prev, tech: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                  required
                />
              </label>
              {errors.about && <p className="text-sm text-rose-400">{errors.about}</p>}
              {status.about && <p className="text-sm text-emerald-400">{status.about}</p>}
              <button
                type="submit"
                className="w-full rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Save About Section
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-800/60 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-slate-100">Skills Admin</h3>
            <p className="text-sm text-slate-400">
              Organise your stack into clear capability groups.
            </p>
            <form onSubmit={handleSkillsSubmit} className="mt-6 space-y-4">
              {skillGroups.map(({ key, label }) => (
                <label key={key} className="space-y-2 text-sm">
                  <span className="text-slate-300">{label} (comma separated)</span>
                  <input
                    type="text"
                    value={skillsForm[key]}
                    onChange={(event) =>
                      setSkillsForm((prev) => ({ ...prev, [key]: event.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                    required
                  />
                </label>
              ))}
              {errors.skills && <p className="text-sm text-rose-400">{errors.skills}</p>}
              {status.skills && <p className="text-sm text-emerald-400">{status.skills}</p>}
              <button
                type="submit"
                className="w-full rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Save Skills Section
              </button>
            </form>
          </div>
        </aside>
      </div>
    </main>
  );
}
