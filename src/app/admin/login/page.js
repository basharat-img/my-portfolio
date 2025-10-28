"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { publicApi } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Email is required."),
  password: Yup.string()
    .required("Password is required.")
    .matches(/^\S+$/, "Password must be exactly one word without spaces."),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isActive = true;

    const checkSession = async () => {
      try {
        await publicApi.get(API_ENDPOINTS.ADMIN_SESSION);
        if (!isActive) {
          return;
        }
        router.replace("/admin");
      } catch (error) {
        if (!isActive) {
          return;
        }
        setIsCheckingAuth(false);
      }
    };

    checkSession();

    return () => {
      isActive = false;
    };
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-50">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Preparing admin access…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-50">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Admin Area</p>
          <h1 className="text-3xl font-semibold">Sign in to manage content</h1>
          <p className="text-sm text-zinc-400">
            Default credentials: <span className="font-semibold">admin@example.com / secret</span>
          </p>
        </div>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            try {
              setStatus(null);

              const trimmedValues = {
                email: values.email.trim(),
                password: values.password.trim(),
              };

              const { data } = await publicApi.post(
                API_ENDPOINTS.ADMIN_LOGIN,
                trimmedValues,
              );

              setStatus({ success: data?.message || "Signed in successfully." });
              router.push("/admin");
            } catch (error) {
              setStatus({ error: error.message || "Something went wrong while signing in." });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ status, isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium uppercase tracking-wide text-zinc-400"
                >
                  Email
                </Label>
                <Field name="email">
                  {({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="admin@example.com"
                      title="Enter a valid email address without spaces."
                      className="h-12 rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-base text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-indigo-500 focus-visible:ring-offset-0"
                    />
                  )}
                </Field>
                {touched.email && errors.email ? (
                  <p className="text-sm font-medium text-rose-400" role="alert">
                    {errors.email}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium uppercase tracking-wide text-zinc-400"
                >
                  Password
                </Label>
                <Field name="password">
                  {({ field }) => (
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter a single-word password"
                      title="Enter a single word without spaces."
                      className="h-12 rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-base text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-indigo-500 focus-visible:ring-offset-0"
                    />
                  )}
                </Field>
                {touched.password && errors.password ? (
                  <p className="text-sm font-medium text-rose-400" role="alert">
                    {errors.password}
                  </p>
                ) : null}
              </div>
              {status?.error ? (
                <p className="text-sm font-medium text-rose-400" role="alert">
                  {status.error}
                </p>
              ) : null}
              {status?.success ? (
                <p className="text-sm font-medium text-emerald-400" role="status">
                  {status.success}
                </p>
              ) : null}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-500/50"
              >
                {isSubmitting ? "Signing in..." : "Enter Admin Panel"}
              </Button>
            </Form>
          )}
        </Formik>
        <p className="text-center text-xs text-zinc-500">
          Single-word credentials are required for access.
        </p>
      </div>
    </div>
  );
}
