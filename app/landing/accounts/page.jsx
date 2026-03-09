"use client"

import { signIn } from "next-auth/react"

export default function Accounts() {
  return (
    <>
      <button
        onClick={() => signIn("google", { callbackUrl: "/app" })}
        className="rounded-4xl p-2 bg-amber-100"
      >
        Sign In
      </button>
    </>
  );
}