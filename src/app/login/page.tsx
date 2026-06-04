"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

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

      if (data.success) {
        setOtpRequested(true);
        alert(
          "OTP generated successfully. Check terminal."
        );
      } else {
        alert(data.message);
      }
    } catch {
      alert("Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data =
        await response.json();

      if (data.success) {
        window.location.href =
          "/dashboard";
      } else {
        alert(data.message);
      }
    } catch {
      alert("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>School ERP Login</h1>

      <form
        onSubmit={handleRequestOtp}
      >
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : "Request OTP"}
        </button>
      </form>

      {otpRequested && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value
              )
            }
          />

          <button
            type="button"
            onClick={
              handleVerifyOtp
            }
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Verify OTP"}
          </button>
        </div>
      )}
    </main>
  );
}