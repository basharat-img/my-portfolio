"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { publicApi } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

const signInSchema = Yup.object({
  email: Yup.string()
    .email("Please provide a valid email address.")
    .required("Email is required."),
  password: Yup.string()
    .matches(/^[^\s]+$/, "Password must be a single word without spaces.")
    .min(8, "Password must be at least 8 characters long.")
    .required("Password is required."),
});

export default function SignInPage() {
  const [formStatus, setFormStatus] = useState(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <Card className="w-full max-w-xl border-zinc-200 shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>
            Use your email and password combination to access your dashboard.
          </CardDescription>
        </CardHeader>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={signInSchema}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            setFormStatus(null);

            try {
              const { data } = await publicApi.post(API_ENDPOINTS.ADMIN_LOGIN, {
                email: values.email.trim(),
                password: values.password.trim(),
              });

              setFormStatus({
                type: "success",
                message: data?.message || "Signed in successfully.",
              });
              resetForm();
            } catch (error) {
              setFormStatus({
                type: "error",
                message:
                  error instanceof Error
                    ? error.message
                    : "Unable to sign in.",
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
                        placeholder="you@example.com"
                        {...field}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="email">
                    {(message) => <p className="text-sm text-red-500">{message}</p>}
                  </ErrorMessage>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Field name="password">
                    {({ field }) => (
                      <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="password">
                    {(message) => <p className="text-sm text-red-500">{message}</p>}
                  </ErrorMessage>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch gap-4">
                {formStatus?.message ? (
                  <p
                    className={`text-sm ${
                      formStatus.type === "success" ? "text-emerald-600" : "text-red-500"
                    }`}
                    role="status"
                  >
                    {formStatus.message}
                  </p>
                ) : null}
                <Button type="submit" disabled={isSubmitting} className="h-11">
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}
