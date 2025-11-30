import React from "react";
import LoginForm from "./components/LoginForm";

/**
 * Fullscreen auth page.
 * Background image path assumes: public/assets/auth/one-login-bg.jpg
 * Update the URL if you store it differently.
 */
const LoginPage: React.FC = () => {
  return (
    <div
      className="relative min-h-screen w-full bg-black text-[#C6C6C8]"
      style={{
        backgroundImage: "url(/assets/auth/one-login-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Centered glass card */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="flex h-[520px] w-full max-w-5xl overflow-hidden border border-[#303032]/80 bg-[#151515]/10 backdrop-blur-md">
          {/* LEFT: form panel */}
          <div className="w-full bg-[#0A0A0C]/70 md:w-[40%]">
            <LoginForm mode="signup" />
          </div>

          {/* RIGHT: blurred visual panel (desktop only) */}
          <div className="relative hidden w-[60%] md:block">
            <div className="absolute inset-0 bg-[#C6C6C8]/1 backdrop-blur-md"/>
            <div
              className="absolute inset-6 rounded-sm bg-cover bg-center blur-[3px]"
              style={{
                backgroundImage:
                  "url(/assets/auth/one-login-mac.jpg)", // secondary crop; change or reuse same bg
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
