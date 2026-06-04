"use client";

import {
  useEffect,
  useState,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [user, setUser] =
    useState<User | null>(
      null
    );

  useEffect(() => {
    async function loadUser() {
      const response =
        await fetch(
          "/api/auth/me"
        );

      const data =
        await response.json();

      if (data.success) {
        setUser(data.user);
      }
    }

    loadUser();
  }, []);

  const handleLogout =
    async () => {
      await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      window.location.href =
        "/login";
    };

  return (
    <main>
      <h1>Dashboard</h1>

      {user && (
        <>
          <p>
            Welcome {user.name}
          </p>

          <p>
            Email:
            {" "}
            {user.email}
          </p>

          <p>
            Role:
            {" "}
            {user.role}
          </p>
        </>
      )}

      <button
        onClick={
          handleLogout
        }
      >
        Logout
      </button>
    </main>
  );
}