"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UserType = "artista" | "curador" | "explorador" | "";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  userType?: string;
  terms?: string;
}

const userTypes = [
  {
    id: "artista",
    title: "Artista",
    description: "Quero compartilhar minha musica e receber feedback",
    icon: (
      <svg
        className="w-6 h-6"
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
    ),
  },
  {
    id: "curador",
    title: "Curador",
    description: "Quero descobrir e recomendar novas musicas",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
  },
  {
    id: "explorador",
    title: "Explorador",
    description: "Quero descobrir musicas atraves de recomendacoes",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
];

export default function CadastroPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<UserType>("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateStep1 = () => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Nome e obrigatorio";
    } else if (name.trim().length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!email) {
      newErrors.email = "Email e obrigatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Digite um email valido";
    }

    if (!password) {
      newErrors.password = "Senha e obrigatoria";
    } else if (password.length < 8) {
      newErrors.password = "Senha deve ter pelo menos 8 caracteres";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password =
        "Senha deve conter maiuscula, minuscula e numero";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirme sua senha";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas nao coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: FormErrors = {};

    if (!userType) {
      newErrors.userType = "Selecione um tipo de perfil";
    }

    if (!acceptTerms) {
      newErrors.terms = "Voce deve aceitar os termos de uso";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Redirect to dashboard or onboarding
    router.push("/dashboard");
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: "Fraca", color: "bg-red-400" };
    if (strength <= 3)
      return { strength, label: "Media", color: "bg-yellow-400" };
    if (strength <= 4) return { strength, label: "Forte", color: "bg-green-400" };
    return { strength, label: "Muito Forte", color: "bg-emerald-500" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-[oklch(0.99_0.002_264)] font-['Nohemi',sans-serif] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[oklch(0.9_0.01_264)]">
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
              href="/#sobre"
              className="font-medium text-[oklch(0.15_0.01_264)] hover:text-[oklch(0.55_0.22_240)] transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="/#como-funciona"
              className="font-medium text-[oklch(0.15_0.01_264)] hover:text-[oklch(0.55_0.22_240)] transition-colors"
            >
              Como Funciona
            </Link>
          </nav>

          <div className="hidden md:block">
            <Link
              href="/entrar"
              className="px-5 py-2.5 border-2 border-[oklch(0.55_0.22_240)] text-[oklch(0.55_0.22_240)] rounded-lg font-semibold hover:bg-[oklch(0.55_0.22_240)] hover:text-white transition-all"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= 1
                  ? "bg-[oklch(0.55_0.22_240)] text-white"
                  : "bg-[oklch(0.9_0.01_264)] text-[oklch(0.5_0.02_264)]"
              }`}
            >
              1
            </div>
            <div
              className={`w-16 h-1 rounded-full transition-all ${
                step >= 2
                  ? "bg-[oklch(0.55_0.22_240)]"
                  : "bg-[oklch(0.9_0.01_264)]"
              }`}
            />
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= 2
                  ? "bg-[oklch(0.55_0.22_240)] text-white"
                  : "bg-[oklch(0.9_0.01_264)] text-[oklch(0.5_0.02_264)]"
              }`}
            >
              2
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-[oklch(0.9_0.01_264)] p-8 md:p-10">
            {/* Step 1: Account Info */}
            {step === 1 && (
              <>
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
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.15_0.01_264)] mb-2">
                    Crie Sua Conta
                  </h1>
                  <p className="text-[oklch(0.5_0.02_264)]">
                    Junte-se a comunidade BeMusicShare
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-5">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-[oklch(0.15_0.01_264)] mb-2"
                    >
                      Nome Completo
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name)
                            setErrors({ ...errors, name: undefined });
                        }}
                        placeholder="Seu nome completo"
                        autoComplete="name"
                        className={`w-full pl-12 pr-4 py-3.5 bg-[oklch(0.98_0.002_264)] border rounded-xl font-medium text-[oklch(0.15_0.01_264)] placeholder:text-[oklch(0.6_0.02_264)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.22_240)]/20 focus:border-[oklch(0.55_0.22_240)] transition-all ${
                          errors.name
                            ? "border-red-400 bg-red-50/50"
                            : "border-[oklch(0.9_0.01_264)]"
                        }`}
                      />
                    </div>
                    {errors.name && (
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
                        {errors.name}
                      </p>
                    )}
                  </div>

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
                        placeholder="Minimo 8 caracteres"
                        autoComplete="new-password"
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

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-3">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1.5 flex-1 rounded-full transition-all ${
                                level <= passwordStrength.strength
                                  ? passwordStrength.color
                                  : "bg-[oklch(0.9_0.01_264)]"
                              }`}
                            />
                          ))}
                        </div>
                        <p
                          className={`text-xs font-medium ${
                            passwordStrength.strength <= 2
                              ? "text-red-500"
                              : passwordStrength.strength <= 3
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          Forca: {passwordStrength.label}
                        </p>
                      </div>
                    )}

                    {errors.password && (
                      <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
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

                  {/* Confirm Password Field */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-[oklch(0.15_0.01_264)] mb-2"
                    >
                      Confirmar Senha
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
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword)
                            setErrors({ ...errors, confirmPassword: undefined });
                        }}
                        placeholder="Digite a senha novamente"
                        autoComplete="new-password"
                        className={`w-full pl-12 pr-12 py-3.5 bg-[oklch(0.98_0.002_264)] border rounded-xl font-medium text-[oklch(0.15_0.01_264)] placeholder:text-[oklch(0.6_0.02_264)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.22_240)]/20 focus:border-[oklch(0.55_0.22_240)] transition-all ${
                          errors.confirmPassword
                            ? "border-red-400 bg-red-50/50"
                            : confirmPassword && password === confirmPassword
                            ? "border-green-400 bg-green-50/50"
                            : "border-[oklch(0.9_0.01_264)]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-[oklch(0.5_0.02_264)] hover:text-[oklch(0.55_0.22_240)] transition-colors"
                      >
                        {showConfirmPassword ? (
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
                    {errors.confirmPassword && (
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
                        {errors.confirmPassword}
                      </p>
                    )}
                    {confirmPassword && password === confirmPassword && (
                      <p className="mt-2 text-sm text-green-600 flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Senhas coincidem
                      </p>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full py-4 bg-[oklch(0.55_0.22_240)] text-white rounded-xl font-bold text-lg hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-[oklch(0.55_0.22_240)]/30 flex items-center justify-center gap-2"
                  >
                    Continuar
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Profile Type */}
            {step === 2 && (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.15_0.01_264)] mb-2">
                    Escolha Seu Perfil
                  </h1>
                  <p className="text-[oklch(0.5_0.02_264)]">
                    Como voce quer usar o BeMusicShare?
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* User Type Selection */}
                  <div className="space-y-3">
                    {userTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          setUserType(type.id as UserType);
                          if (errors.userType)
                            setErrors({ ...errors, userType: undefined });
                        }}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4 ${
                          userType === type.id
                            ? "border-[oklch(0.55_0.22_240)] bg-[oklch(0.55_0.22_240)]/5"
                            : "border-[oklch(0.9_0.01_264)] hover:border-[oklch(0.55_0.22_240)]/30"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                            userType === type.id
                              ? "bg-[oklch(0.55_0.22_240)] text-white"
                              : "bg-[oklch(0.96_0.01_264)] text-[oklch(0.5_0.02_264)]"
                          }`}
                        >
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-[oklch(0.15_0.01_264)]">
                            {type.title}
                          </div>
                          <div className="text-sm text-[oklch(0.5_0.02_264)]">
                            {type.description}
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            userType === type.id
                              ? "border-[oklch(0.55_0.22_240)] bg-[oklch(0.55_0.22_240)]"
                              : "border-[oklch(0.8_0.01_264)]"
                          }`}
                        >
                          {userType === type.id && (
                            <svg
                              className="w-4 h-4 text-white"
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
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.userType && (
                    <p className="text-sm text-red-500 flex items-center gap-1.5">
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
                      {errors.userType}
                    </p>
                  )}

                  {/* Terms Checkbox */}
                  <div className="pt-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative mt-0.5">
                        <input
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => {
                            setAcceptTerms(e.target.checked);
                            if (errors.terms)
                              setErrors({ ...errors, terms: undefined });
                          }}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-5 h-5 border-2 rounded-md peer-checked:bg-[oklch(0.55_0.22_240)] peer-checked:border-[oklch(0.55_0.22_240)] transition-all group-hover:border-[oklch(0.55_0.22_240)] ${
                            errors.terms
                              ? "border-red-400"
                              : "border-[oklch(0.8_0.01_264)]"
                          }`}
                        />
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
                        Li e aceito os{" "}
                        <Link
                          href="/termos"
                          className="text-[oklch(0.55_0.22_240)] hover:underline"
                        >
                          Termos de Uso
                        </Link>{" "}
                        e a{" "}
                        <Link
                          href="/privacidade"
                          className="text-[oklch(0.55_0.22_240)] hover:underline"
                        >
                          Politica de Privacidade
                        </Link>
                      </span>
                    </label>
                    {errors.terms && (
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
                        {errors.terms}
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 py-4 border-2 border-[oklch(0.9_0.01_264)] text-[oklch(0.15_0.01_264)] rounded-xl font-bold text-lg hover:border-[oklch(0.55_0.22_240)] hover:text-[oklch(0.55_0.22_240)] transition-all flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
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
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-4 bg-[oklch(0.55_0.22_240)] text-white rounded-xl font-bold text-lg hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-[oklch(0.55_0.22_240)]/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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
                          Criando...
                        </>
                      ) : (
                        "Criar Conta"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[oklch(0.9_0.01_264)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[oklch(0.5_0.02_264)]">
                  Ja tem conta?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              href="/entrar"
              className="block w-full py-3.5 border-2 border-[oklch(0.9_0.01_264)] text-[oklch(0.15_0.01_264)] rounded-xl font-semibold text-center hover:border-[oklch(0.55_0.22_240)] hover:text-[oklch(0.55_0.22_240)] transition-all"
            >
              Fazer Login
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