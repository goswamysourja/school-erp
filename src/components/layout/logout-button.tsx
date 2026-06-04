"use client";

export function LogoutButton() {
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
    <button
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}