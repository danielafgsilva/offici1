// The two helpers every form needs: the ARIA attributes for a field (invalid, and which messages describe it) and the
// error message under it. `hint` is the id of a help text that also describes the field.
export function fieldErrors<K extends string>(errors: Partial<Record<K, string>>) {
  const describe = (name: K, hint?: string) => {
    const ids = [errors[name] && `${name}-error`, hint].filter(Boolean).join(" ");
    return { ...(errors[name] ? { "aria-invalid": true } : {}), ...(ids ? { "aria-describedby": ids } : {}) };
  };
  const error = (name: K) =>
    errors[name] && (
      <p id={`${name}-error`} className="mt-1.5 text-sm font-medium text-error">
        {errors[name]}
      </p>
    );
  return { describe, error };
}
