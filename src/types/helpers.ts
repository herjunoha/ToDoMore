/**
 * Helper types for common patterns used throughout the app
 */

export type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type AsyncFunction<TArgs, TReturn> = (
  args: TArgs,
) => Promise<TReturn>;

export type Callback<T = void> = () => T;

export type EventHandler<T = Event> = (event: T) => void;

export type FormValue = string | number | boolean | null | undefined;

export type FormValues = Record<string, FormValue | FormValue[]>;

export type ValidationError = {
  field: string;
  message: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};
