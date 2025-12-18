"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Digite um email valido");
      setIsLoading(false);
      return;
    }

    try {
      await api.auth.forgetPassword({
        email,
        redirectTo: "/redefinir-senha",
      });
      setSuccess(true);
    } catch {
      // mesmo se email nao existir, mostra sucesso (segurança)
      setSuccess(true);
    } finally {
      setIsLoading(false);
    }
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
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="font-medium text-[oklch(0.15_0.01_264)] hover:text-[oklch(0.55_0.22_240)] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/entrar"
              className="font-semibold text-[oklch(0.55_0.22_240)] hover:opacity-80 transition-opacity"
            >
              Entrar
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-24 md:py-32">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl shadow-[oklch(0.55_0.22_240)]/10 p-8 md:p-10">
            {success ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-[oklch(0.15_0.01_264)]">
                  Verifique seu email
                </h1>
                <p className="text-[oklch(0.4_0.02_264)]">
                  Se uma conta existir com o email <strong className="text-[oklch(0.15_0.01_264)]">{email}</strong>, 
                  você receberá um link para redefinir sua senha.
                </p>
                <Link
                  href="/entrar"
                  className="inline-block w-full py-4 bg-[oklch(0.55_0.22_240)] text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all text-center"
                >
                  Voltar ao login
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.15_0.01_264)] mb-3">
                    Recuperar senha
                  </h1>
                  <p className="text-[oklch(0.4_0.02_264)]">
                    Digite seu email e enviaremos um link para redefinir sua senha
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[oklch(0.25_0.01_264)] mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className={`w-full px-4 py-4 rounded-xl border-2 bg-[oklch(0.99_0.002_264)] text-[oklch(0.15_0.01_264)] placeholder:text-[oklch(0.6_0.01_264)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.22_240)]/20 focus:border-[oklch(0.55_0.22_240)] transition-all ${
                        error ? "border-red-400 bg-red-50/50" : "border-[oklch(0.9_0.01_264)]"
                      }`}
                    />
                    {error && (
                      <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-[oklch(0.55_0.22_240)] text-white rounded-xl font-bold text-lg hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-[oklch(0.55_0.22_240)]/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="12" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      "Enviar link de recuperacao"
                    )}
                  </button>

                  <Link
                    href="/entrar"
                    className="block text-center text-sm font-medium text-[oklch(0.55_0.22_240)] hover:underline"
                  >
                    Voltar ao login
                  </Link>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}