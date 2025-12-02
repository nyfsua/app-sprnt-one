// src/features/auth/AuthPage.tsx
import React from "react";
import LoginForm from "./components/LoginForm";
import type { AuthMode, AuthPayload } from "./components/LoginForm";

type AuthPageProps = {
  mode: AuthMode;
  onAuthenticated?: (payload: AuthPayload) => void;
};

const AuthPage: React.FC<AuthPageProps> = ({ mode, onAuthenticated }) => {
  return (
    <div
      className="relative min-h-screen w-full bg-black text-[#E2E1DF]"
      style={{
        backgroundImage: "url(/assets/auth/one-login-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="flex h-[520px] w-full max-w-5xl overflow-hidden border border-[#303032]/80 bg-black/30 backdrop-blur-md">
          {/* LEFT: form */}
          <div className="w-full bg-black/70 md:w-[50%]">
            <LoginForm
              mode={mode}
              onSuccess={(payload) => {
                onAuthenticated?.(payload);
              }}
            />
          </div>

          {/* RIGHT: visual panel */}
          <div className="relative hidden w-[50%] md:block">
            <div className="absolute inset-0 bg-black/30" />
            <div
              className="absolute inset-6 rounded-sm bg-cover bg-center blur-[3px]"
              style={{
                backgroundImage: "url(/assets/auth/one-login-mac.jpg)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
