import { useState } from "react";

export const useApiError = () => {
  const [error, setError] = useState(null);

  const handleError = (err) => {
    console.error(err);
    setError({
      message: err.message || "An unexpected error occurred",
      status: err.status || null,
    });
    setTimeout(() => setError(null), 5000);
  };

  return { error, handleError };
};

export const ErrorDisplay = ({ error }) =>
  error ? (
    <div
      className="error-message slide-up"
      style={{ color: "var(--highlight)", textAlign: "center" }}
    >
      {error.message} {error.status && `(${error.status})`}
    </div>
  ) : null;
