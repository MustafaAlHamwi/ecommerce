"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <>
      <p>Some thing wrong</p>
      <h1>{error.message || "Some thing wrong"}</h1>
      <button onClick={() => reset()}>Tray Again</button>
    </>
  );
}
