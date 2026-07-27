import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginBanner from "../../components/auth/LoginBanner";
import LoginCard from "../../components/auth/LoginCard";

import { login } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const handleLogin = async (
  e: React.FormEvent<HTMLFormElement>
) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await login({
        email,
        password,
      });

      if (res.data.success) {
        await refreshUser();
        navigate("/", {
          replace: true,
        });
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC]">
  <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">

    <LoginBanner />

    <LoginCard
      email={email}
      password={password}
      error={error}
      loading={loading}
      showPassword={showPassword}
      setEmail={setEmail}
      setPassword={setPassword}
      togglePassword={() => setShowPassword(!showPassword)}
      onSubmit={handleLogin}
    />

  </div>
</div>
  );
}