"use client";

export default function Error({
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
