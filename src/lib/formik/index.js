"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const FormikContext = createContext(null);

function formatErrors(error) {
  if (!error) return {};
  const formatted = {};
  if (Array.isArray(error.inner) && error.inner.length > 0) {
    for (const item of error.inner) {
      if (item?.path && !formatted[item.path]) {
        formatted[item.path] = item.message;
      }
    }
  }
  if (error?.path && !formatted[error.path]) {
    formatted[error.path] = error.message;
  }
  if (!Object.keys(formatted).length && error?.message) {
    formatted._error = error.message;
  }
  return formatted;
}

function useValidationRunner(validationSchema) {
  return useCallback(
    async (values) => {
      if (!validationSchema?.validate) {
        return {};
      }
      try {
        await validationSchema.validate(values, { abortEarly: false });
        return {};
      } catch (validationError) {
        return formatErrors(validationError);
      }
    },
    [validationSchema],
  );
}

export function useFormik({ initialValues = {}, validationSchema, onSubmit }) {
  const [values, setValues] = useState(() => ({ ...initialValues }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const initialValuesRef = useRef(initialValues);

  const runValidation = useValidationRunner(validationSchema);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFieldTouched = useCallback((name, touchedValue = true) => {
    setTouched((prev) => ({ ...prev, [name]: touchedValue }));
  }, []);

  const handleChange = useCallback(
    (eventOrName, maybeValue) => {
      if (typeof eventOrName === "string") {
        setFieldValue(eventOrName, maybeValue);
        return;
      }
      const event = eventOrName;
      const name = event?.target?.name;
      if (!name) return;
      const { value, type, checked } = event.target;
      setFieldValue(name, type === "checkbox" ? checked : value);
    },
    [setFieldValue],
  );

  const handleBlur = useCallback(
    (eventOrName) => {
      if (typeof eventOrName === "string") {
        setFieldTouched(eventOrName, true);
        return;
      }
      const event = eventOrName;
      const name = event?.target?.name;
      if (!name) return;
      setFieldTouched(name, true);
    },
    [setFieldTouched],
  );

  const resetForm = useCallback(
    (nextState = {}) => {
      const nextValues = nextState.values ?? initialValuesRef.current;
      setValues({ ...nextValues });
      setErrors(nextState.errors ?? {});
      setTouched(nextState.touched ?? {});
      setStatus(nextState.status ?? null);
    },
    [],
  );

  const submitForm = useCallback(async () => {
    const validationErrors = await runValidation(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      const touchedAll = {};
      for (const key of Object.keys(values)) {
        touchedAll[key] = true;
      }
      setTouched((prev) => ({ ...prev, ...touchedAll }));
      throw validationErrors;
    }
    if (typeof onSubmit !== "function") {
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(values, { resetForm, setErrors, setStatus, setFieldValue, setFieldTouched, submitForm });
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, resetForm, runValidation, setFieldTouched, setFieldValue, values]);

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault?.();
      try {
        await submitForm();
      } catch (error) {
        return error;
      }
      return undefined;
    },
    [submitForm],
  );

  const contextValue = useMemo(
    () => ({
      values,
      errors,
      touched,
      isSubmitting,
      status,
      initialValues: initialValuesRef.current,
      handleChange,
      handleBlur,
      handleSubmit,
      setFieldValue,
      setFieldTouched,
      setErrors,
      setStatus,
      resetForm,
      submitForm,
    }),
    [errors, handleBlur, handleChange, handleSubmit, isSubmitting, resetForm, setFieldTouched, setFieldValue, status, submitForm, touched, values],
  );

  return contextValue;
}

export function useFormikContext() {
  const context = useContext(FormikContext);
  if (!context) {
    throw new Error("useFormikContext must be used within a <Formik> component");
  }
  return context;
}

export function Formik({ children, ...config }) {
  const formik = useFormik(config);
  return (
    <FormikContext.Provider value={formik}>
      {typeof children === "function" ? children(formik) : children}
    </FormikContext.Provider>
  );
}

export function Form({ children, ...props }) {
  const formik = useFormikContext();
  return (
    <form onSubmit={formik.handleSubmit} {...props}>
      {children}
    </form>
  );
}

export function Field({ name, as: Component = "input", children, ...props }) {
  const formik = useFormikContext();
  const fieldValue = formik.values[name] ?? "";
  const fieldProps = {
    name,
    value: fieldValue,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
  };

  if (typeof children === "function") {
    return children({
      field: fieldProps,
      meta: {
        value: fieldValue,
        error: formik.errors[name],
        touched: formik.touched[name],
        initialValue: formik.initialValues[name],
      },
      form: formik,
    });
  }

  return <Component {...fieldProps} {...props} />;
}

export function ErrorMessage({ name, component: Component = "div", children, ...props }) {
  const formik = useFormikContext();
  const error = formik.errors[name];
  const touched = formik.touched[name];

  if (!error || !touched) {
    return null;
  }

  if (typeof children === "function") {
    return children(error);
  }

  return (
    <Component {...props}>
      {error}
    </Component>
  );
}

export const FormikProvider = FormikContext.Provider;

const FormikModule = {
  Formik,
  Form,
  Field,
  ErrorMessage,
  useFormik,
  useFormikContext,
  FormikProvider,
};

export default FormikModule;
