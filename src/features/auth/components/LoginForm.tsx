import React from "react";

export interface LoginFormProps {
  mode?: "signup" | "login";
}

const LoginForm: React.FC<LoginFormProps> = ({ mode = "signup" }) => {
  const isSignup = mode === "signup";

  return (
    <div className="flex h-full flex-col justify-between py-10 px-10 text-[#C6C6C8]">
      {/* Logo placeholder */}
      <div className="mb-10">
        <img src="public/logo.svg" alt="One." className="h-8 w-8  flex items-center justify-center text-[10px] font-ocr tracking-[0.2em] uppercase text-[#B74735]" />
        
      </div>

      {/* Copy + form */}
      <div>
        <div className="mb-6">
          <h1 className="text-[28px] leading-none font-pp font-semibold">
            {isSignup ? "Sign up" : "Log in"}
          </h1>
          <p className="mt-3 text-[12px] leading-tight text-[#8F8F92] max-w-xs font-pp">
            {isSignup
              ? "Create your One account and get unfiltered access to Planetary Intelligence."
              : "Log into your One account to continue your session with Planetary Intelligence."}
          </p>
        </div>

        <form className="space-y-3 text-[10px] font-ocr">
          <div>
            <input
              type="email"
              placeholder="ENTER YOUR EMAIL"
              className="w-full bg-[#151515]/80 border border-[#303032] px-3 py-2 outline-none text-[10px] placeholder:text-[#5C5C5E] focus:border-[#B74735] transition tracking-tight uppercase"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder={isSignup ? "CREATE A PASSWORD" : "ENTER YOUR PASSWORD"}
              className="w-full bg-[#151515]/80 border border-[#303032] px-3 py-2 outline-none text-[10px] placeholder:text-[#5C5C5E] focus:border-[#B74735] transition tracking-tight uppercase"
            />
          </div>

          {isSignup && (
            <label className="flex pt-1 items-center gap-2 text-[8px] text-[#8F8F92]">
              <input
                type="checkbox"
                className="h-[10px] w-[10px] border border-[#606062] bg-transparent appearance-none checked:bg-[#B74735] checked:border-[#B74735]"
              />
              <span className="leading-tight tracking-tight uppercase">
                I agree to the Terms &amp; Privacy Policy.
              </span>
            </label>
          )}

          <button
            type="submit"
            className="mt-2 w-full bg-[#C6C6C8] text-[#151515] text-[12px] font-ocr tracking-tight uppercase py-2 border border-[#C6C6C8] hover:bg-[#B74735] hover:border-[#B74735] hover:text-[#151515] transition"
          >
            {isSignup ? "Create Account" : "Continue"}
          </button>

          <div className="pb-2 pt-2 text-center text-[8px] font-ocr text-[#8F8F92] uppercase tracking-tight">
            or sign {isSignup ? "up" : "in"} with
          </div>

          {/* Social buttons */}
          <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
            <button
              type="button"
              className="border border-[#303032] bg-[#151515]/70 py-[6px] font-ocr tracking-tight uppercase text-[#8F8F92] hover:border-[#B74735] hover:text-[#B74735] transition"
            >
              Google
            </button>
            <button
              type="button"
              className="border border-[#303032] bg-[#151515]/70 py-[6px] font-ocr tracking-tight uppercase text-[#8F8F92] hover:border-[#B74735] hover:text-[#B74735] transition"
            >
              Apple
            </button>
            <button
              type="button"
              className="border border-[#303032] bg-[#151515]/70 py-[6px] font-ocr tracking-tight uppercase text-[#8F8F92] hover:border-[#B74735] hover:text-[#B74735] transition"
            >
              GitHub
            </button>
          </div>
        </form>
      </div>

      {/* Footer link */}
      <div className="mt-6 text-center text-[10px] text-[#8F8F92] font-ocr uppercase tracking-tight">
        <span>
          {isSignup ? "Already have an account? " : "Don’t have an account yet? "}
        </span>
        <button
          type="button"
          className="text-[#B74735] hover:underline ml-1 uppercase tracking-tight"
        >
          {isSignup ? "Login" : "Sign up"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
