// src/features/auth/SignUpPage.tsx
import React from "react";
import AuthPage from "./AuthPage";
import type { AuthPayload } from "./components/LoginForm";

type SignUpPageProps = {
  onAuthenticated?: (payload: AuthPayload) => void;
};

const SignUpPage: React.FC<SignUpPageProps> = ({ onAuthenticated }) => {
  return <AuthPage mode="signup" onAuthenticated={onAuthenticated} />;
};

export default SignUpPage;
