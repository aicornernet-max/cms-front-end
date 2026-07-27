import { Loader2, Lock, Mail } from "lucide-react";
import LoginInput from "./LoginInput";

type Props = {
  email: string;
  password: string;

  error: string;

  loading: boolean;

  showPassword: boolean;

  setEmail: (v: string) => void;

  setPassword: (v: string) => void;

  togglePassword: () => void;

  onSubmit: React.FormEventHandler<HTMLFormElement>;
};

export default function LoginCard({
  email,
  password,
  error,
  loading,
  showPassword,
  setEmail,
  setPassword,
  togglePassword,
  onSubmit,
}: Props) {
  return (
    <div className="flex w-full items-center justify-center bg-slate-50 p-8">

      <form
        onSubmit={onSubmit}
        autoComplete="on"
        className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl border border-slate-200"
      >
        <h2 className="text-3xl font-bold text-slate-900">
          Welcome Back
        </h2>

        <p className="mt-2 mb-8 text-slate-500">
          Sign in to continue
        </p>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-6">

          <LoginInput
            label="Email Address"
            type="email"
            name="email"
            value={email}
            placeholder="admin@example.com"
            icon={Mail}
            onChange={setEmail}
          />

          <LoginInput
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            placeholder="Enter password"
            icon={Lock}
            onChange={setPassword}
            showPassword={showPassword}
            onTogglePassword={togglePassword}
          />

          <button
            disabled={loading}
            className="
            h-12
            w-full
            rounded-xl
            bg-blue-600
            text-white
            font-semibold
            hover:bg-blue-700
            transition
            disabled:opacity-70
            "
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="text-center text-xs text-slate-400">
            Protected Administrator Portal
          </p>

        </div>
      </form>
    </div>
  );
}