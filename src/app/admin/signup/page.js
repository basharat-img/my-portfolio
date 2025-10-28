"use client";

import { useState } from "react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const signUpSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Email is required."),
  username: Yup.string()
    .matches(/^[^\s]+$/, "Username must be a single word without spaces.")
    .required("Username is required."),
  password: Yup.string()
    .matches(/^[^\s]+$/, "Password must be a single word without spaces.")
    .min(8, "Password must be at least 8 characters long.")
    .required("Password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match.")
    .required("Please confirm your password."),
});

export default function AdminSignUpPage() {
  const [formStatus, setFormStatus] = useState(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <Card className="w-full max-w-xl border-zinc-200 shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle>Create your admin account</CardTitle>
          <CardDescription>
            Fill out the details below to finish setting up your admin profile.
          </CardDescription>
        </CardHeader>
        <Formik
          initialValues={{
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={signUpSchema}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            setFormStatus(null);

            try {
              const payload = {
                email: values.email.trim(),
                username: values.username.trim(),
                password: values.password.trim(),
              };

              const response = await fetch("/api/admin/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });

              const result = await response.json();

              if (!response.ok) {
                throw new Error(result.message || "Unable to create admin account.");
              }

              setFormStatus({
                type: "success",
                message: result.message || "Admin account created successfully.",
              });
              resetForm();
            } catch (error) {
              setFormStatus({
                type: "error",
                message: error.message || "Failed to create admin account.",
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form noValidate className="space-y-6">
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Field name="email">
                    {({ field }) => (
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="admin@example.com"
                        {...field}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="email">
                    {(message) => (
                      <p className="text-sm text-red-500">{message}</p>
                    )}
                  </ErrorMessage>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Field name="username">
                    {({ field }) => (
                      <Input
                        id="username"
                        type="text"
                        autoComplete="username"
                        placeholder="admin_username"
                        {...field}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="username">
                    {(message) => (
                      <p className="text-sm text-red-500">{message}</p>
                    )}
                  </ErrorMessage>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Field name="password">
                      {({ field }) => (
                        <Input
                          id="password"
                          type="password"
                          autoComplete="new-password"
                          placeholder="Create a strong password"
                          {...field}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="password">
                      {(message) => (
                        <p className="text-sm text-red-500">{message}</p>
                      )}
                    </ErrorMessage>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Field name="confirmPassword">
                      {({ field }) => (
                        <Input
                          id="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          placeholder="Re-enter your password"
                          {...field}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="confirmPassword">
                      {(message) => (
                        <p className="text-sm text-red-500">{message}</p>
                      )}
                    </ErrorMessage>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch gap-4">
                <div className="flex flex-col gap-3">
                  {formStatus?.message ? (
                    <p
                      className={`text-sm ${
                        formStatus.type === "success"
                          ? "text-emerald-600"
                          : "text-red-500"
                      }`}
                      role="status"
                    >
                      {formStatus.message}
                    </p>
                  ) : null}
                  <Link
                    className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
                    href="/"
                  >
                    Return to homepage
                  </Link>
                </div>
                <Button type="submit" disabled={isSubmitting} className="h-11">
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}
