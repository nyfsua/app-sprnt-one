// src/features/auth/LoginPage.tsx
import React from "react";
import AuthPage from "./AuthPage";
import type { AuthPayload } from "./components/LoginForm";

type LoginPageProps = {
  onAuthenticated?: (payload: AuthPayload) => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onAuthenticated }) => {
  return <AuthPage mode="login" onAuthenticated={onAuthenticated} />;
};

export default LoginPage;
