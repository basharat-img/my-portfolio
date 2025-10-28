class ValidationError extends Error {
  constructor(message, path, inner = []) {
    super(message);
    this.name = "ValidationError";
    this.path = path;
    this.inner = inner;
  }
}

function normalizeValue(value) {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

class StringSchema {
  constructor() {
    this.tests = [];
  }

  required(message = "This field is required") {
    this.tests.push({
      name: "required",
      test: (value) => value !== undefined && value !== null && normalizeValue(value).trim() !== "",
      message,
    });
    return this;
  }

  email(message = "Enter a valid email address") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.tests.push({
      name: "email",
      test: (value) => {
        const normalized = normalizeValue(value);
        if (!normalized) return true;
        return emailRegex.test(normalized);
      },
      message,
    });
    return this;
  }

  min(minLength, message = `Must be at least ${minLength} characters`) {
    this.tests.push({
      name: "min",
      test: (value) => normalizeValue(value).length >= minLength,
      message,
    });
    return this;
  }

  matches(regex, message = "Invalid format") {
    this.tests.push({
      name: "matches",
      test: (value) => {
        const normalized = normalizeValue(value);
        if (!normalized) return true;
        return regex.test(normalized);
      },
      message,
    });
    return this;
  }

  oneOf(list, message = "Value must match") {
    this.tests.push({
      name: "oneOf",
      test: (value, context) => {
        const resolved = list.map((item) => resolveReference(item, context));
        return resolved.some((expected) => normalizeValue(expected) === normalizeValue(value));
      },
      message,
    });
    return this;
  }

  async validate(value, context) {
    for (const { test, message } of this.tests) {
      const result = test(value, context);
      const valid = result instanceof Promise ? await result : result;
      if (!valid) {
        throw new ValidationError(message, context?.path);
      }
    }
    return value;
  }
}

class ObjectSchema {
  constructor(shape) {
    this.shape = shape;
  }

  shape(nextShape) {
    return new ObjectSchema({ ...this.shape, ...nextShape });
  }

  async validate(values, options = {}) {
    const { abortEarly = true } = options;
    const errors = [];

    for (const [path, schema] of Object.entries(this.shape)) {
      try {
        const context = { ...values, path };
        await schema.validate(values[path], context);
      } catch (error) {
        const validationError = error instanceof ValidationError ? error : new ValidationError(error.message, path);
        validationError.path = path;
        errors.push(validationError);
        if (abortEarly) {
          throw validationError;
        }
      }
    }

    if (errors.length) {
      if (abortEarly) {
        throw errors[0];
      }
      throw new ValidationError("Validation failed", undefined, errors);
    }

    return values;
  }
}

export function string() {
  return new StringSchema();
}

export function object(shape) {
  return new ObjectSchema(shape);
}

export function ref(path) {
  return { __isYupRef: true, path };
}

function resolveReference(value, context) {
  if (value && value.__isYupRef) {
    return context?.[value.path];
  }
  return value;
}

const Yup = { string, object, ref, ValidationError };

export default Yup;
