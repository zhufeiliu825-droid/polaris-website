"use client";

// Catches errors in the root layout itself. Must render its own <html>/<body>
// because the normal layout failed. Kept dependency-free for resilience.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1635",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <p
          style={{
            color: "#dec39c",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          Polaris Consulting
        </p>
        <h1 style={{ fontWeight: 300, fontSize: 36, margin: "1rem 0 0.5rem" }}>
          Something went wrong.
        </h1>
        <p style={{ color: "#c2cce0", maxWidth: 420 }}>
          We hit an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: 24,
            height: 48,
            padding: "0 28px",
            borderRadius: 999,
            border: "none",
            background: "#ecdcc2",
            color: "#0a1635",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
