"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email e obrigatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Digite um email valido";
    }

    if (!password) {
      newErrors.password = "Senha e obrigatoria";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[oklch(0.99_0.002_264)] font-['Nohemi',sans-serif] flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[oklch(0.9_0.01_264)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-[oklch(0.55_0.22_240)] tracking-tight hover:opacity-80 transition-opacity"
          >
            BeMusicShare
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="font-medium text-[oklch(0.15_0.01_264)] hover:text-[oklch(0.55_0.22_240)] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#artistas"
              className="font-medium text-[oklch(0.15_0.01_264)] hover:text-[oklch(0.55_0.22_240)] transition-colors"
            >
              Para Artistas
            </Link>
            <Link
              href="/#como-funciona"
              className="font-medium text-[oklch(0.15_0.01_264)] hover:text-[oklch(0.55_0.22_240)] transition-colors"
            >
              Como Funciona
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/entrar"
              className="px-5 py-2.5 rounded-lg font-semibold text-[oklch(0.15_0.01_264)] hover:bg-[oklch(0.96_0.01_264)] transition-all"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="px-5 py-2.5 bg-[oklch(0.55_0.22_240)] text-white rounded-lg font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-[oklch(0.55_0.22_240)]/30"
            >
              Cadastro
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-[oklch(0.9_0.01_264)] p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[oklch(0.55_0.22_240)] to-[oklch(0.65_0.18_200)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[oklch(0.55_0.22_240)]/20">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.15_0.01_264)] mb-2">
                Bem-vindo de Volta
              </h1>
              <p className="text-[oklch(0.5_0.02_264)]">
                Faca login para continuar explorando
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[oklch(0.15_0.01_264)] mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-[oklch(0.5_0.02_264)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email)
                        setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="seu@email.com"
                    autoComplete="email"
                    className={`w-full pl-12 pr-4 py-3.5 bg-[oklch(0.98_0.002_264)] border rounded-xl font-medium text-[oklch(0.15_0.01_264)] placeholder:text-[oklch(0.6_0.02_264)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.22_240)]/20 focus:border-[oklch(0.55_0.22_240)] transition-all ${
                      errors.email
                        ? "border-red-400 bg-red-50/50"
                        : "border-[oklch(0.9_0.01_264)]"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[oklch(0.15_0.01_264)] mb-2"
                >
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-[oklch(0.5_0.02_264)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors({ ...errors, password: undefined });
                    }}
                    placeholder="Sua senha"
                    autoComplete="current-password"
                    className={`w-full pl-12 pr-12 py-3.5 bg-[oklch(0.98_0.002_264)] border rounded-xl font-medium text-[oklch(0.15_0.01_264)] placeholder:text-[oklch(0.6_0.02_264)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.22_240)]/20 focus:border-[oklch(0.55_0.22_240)] transition-all ${
                      errors.password
                        ? "border-red-400 bg-red-50/50"
                        : "border-[oklch(0.9_0.01_264)]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[oklch(0.5_0.02_264)] hover:text-[oklch(0.55_0.22_240)] transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-[oklch(0.8_0.01_264)] rounded-md peer-checked:bg-[oklch(0.55_0.22_240)] peer-checked:border-[oklch(0.55_0.22_240)] transition-all group-hover:border-[oklch(0.55_0.22_240)]" />
                    <svg
                      className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-[oklch(0.4_0.02_264)]">
                    Lembrar-me
                  </span>
                </label>

                <Link
                  href="/recuperar-senha"
                  className="text-sm font-medium text-[oklch(0.55_0.22_240)] hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[oklch(0.55_0.22_240)] text-white rounded-xl font-bold text-lg hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-[oklch(0.55_0.22_240)]/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[oklch(0.9_0.01_264)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[oklch(0.5_0.02_264)]">
                  Nao tem conta?
                </span>
              </div>
            </div>

            {/* Create Account Link */}
            <Link
              href="/cadastro"
              className="block w-full py-3.5 border-2 border-[oklch(0.9_0.01_264)] text-[oklch(0.15_0.01_264)] rounded-xl font-semibold text-center hover:border-[oklch(0.55_0.22_240)] hover:text-[oklch(0.55_0.22_240)] transition-all"
            >
              Criar Conta Gratis
            </Link>

            {/* Continue as Guest */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-[oklch(0.55_0.22_240)] hover:underline inline-flex items-center gap-1.5"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Continuar visitando
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[oklch(0.98_0.002_264)] border-t border-[oklch(0.9_0.01_264)] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-[oklch(0.5_0.02_264)]">
              <Link
                href="/termos"
                className="hover:text-[oklch(0.15_0.01_264)] transition-colors"
              >
                Termos de Uso
              </Link>
              <Link
                href="/privacidade"
                className="hover:text-[oklch(0.15_0.01_264)] transition-colors"
              >
                Privacidade
              </Link>
              <Link
                href="/contato"
                className="hover:text-[oklch(0.15_0.01_264)] transition-colors"
              >
                Contato
              </Link>
            </div>
            <p className="text-sm text-[oklch(0.5_0.02_264)]">
              2025 BeMusicShare
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}