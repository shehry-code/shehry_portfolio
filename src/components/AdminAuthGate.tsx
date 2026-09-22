import { useEffect, useState, type ReactNode } from "react";

interface AdminAuthGateProps {
  children: ReactNode;
}

type AuthState = "loading" | "authenticated" | "unauthenticated" | "error";

export default function AdminAuthGate({ children }: AdminAuthGateProps) {
  const [authState, setAuthState] = useState<AuthState>("loading");

  const checkSession = async () => {
    setAuthState("loading");
    try {
      const response = await fetch("/api/auth/session", { credentials: "include" });
      if (!response.ok) throw new Error("Session check failed.");
      const payload = await response.json();
      setAuthState(payload.authenticated === true ? "authenticated" : "unauthenticated");
    } catch {
      setAuthState("error");
    }
  };

  useEffect(() => {
    void checkSession();
  }, []);

  if (authState === "authenticated") return <>{children}</>;

  return (
    <div className="min-h-screen bg-bg-primary pt-20 text-text-primary">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center px-4 py-12 sm:px-6">
        <section className="w-full rounded-xl border border-border bg-bg-card p-6 shadow-sm sm:p-8">
          <p className="mb-2 text-xs font-mono uppercase tracking-[0.16em] text-accent">Admin access</p>
          <h1 className="text-2xl font-semibold text-text-primary">Authentication required</h1>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Sign in with the authorized GitHub account to access the portfolio administration area.
          </p>

          {authState === "loading" ? (
            <p className="mt-6 text-sm text-text-muted">Checking session...</p>
          ) : (
            <div className="mt-6 space-y-3">
              {authState === "error" ? (
                <p className="rounded-md border border-red/35 bg-red/10 p-3 text-sm text-red">
                  The authentication service is unavailable.
                </p>
              ) : null}
              <a
                href="/api/auth/github"
                className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg-primary transition-colors hover:bg-accent/90"
              >
                Login with GitHub
              </a>
              {authState === "error" ? (
                <button
                  type="button"
                  onClick={() => void checkSession()}
                  className="ml-3 text-sm text-text-muted transition-colors hover:text-accent"
                >
                  Retry
                </button>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
