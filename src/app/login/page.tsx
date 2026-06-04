"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const handleRequestOtp =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      const response = await fetch(
        "/api/auth/request-otp",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data =
        await response.json();

      alert(data.message);
    };

  return (
    <main>
      <h1>School ERP Login</h1>

      <form
        onSubmit={
          handleRequestOtp
        }
      >
        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          placeholder="Enter email"
        />

        <button type="submit">
          Request OTP
        </button>
      </form>
    </main>
  );
}