"use client"

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// Video URLs from Cloudinary
const videoUrls = [
  "https://res.cloudinary.com/dxqtbfwht/video/upload/v1761010967/video_1_an5eje.mp4",
  "https://res.cloudinary.com/dxqtbfwht/video/upload/v1761010980/video_2_u7ggpu.mp4",
  "https://res.cloudinary.com/dxqtbfwht/video/upload/v1761010987/video_3_wpueab.mp4",
  "https://res.cloudinary.com/dxqtbfwht/video/upload/v1761010989/video_4_syb4p1.mp4",
  "https://res.cloudinary.com/dxqtbfwht/video/upload/v1761010984/video_5_ujskcv.mp4",
];

// Stats data
const stats = [
  { value: "50K+", label: "Artistas Ativos" },
  { value: "2M+", label: "Recomendacoes" },
  { value: "500K+", label: "Ouvintes Engajados" },
  { value: "98%", label: "Satisfacao" },
];

// Artist benefits
const artistBenefits = [
  {
    title: "Audiencia Qualificada",
    description:
      "Sua musica chega para pessoas que realmente querem descobrir novos sons, nao para bots ou ouvintes passivos.",
  },
  {
    title: "Feedback Genuino",
    description:
      "Receba opinioes reais de pessoas apaixonadas por musica. Comentarios construtivos que ajudam voce a evoluir.",
  },
  {
    title: "Zero Algoritmo",
    description:
      "Sua musica nao compete com artistas mainstream. Aqui, qualidade e curadoria humana definem o sucesso.",
  },
  {
    title: "Comunidade Engajada",
    description:
      "Conecte-se com curadores influentes que podem amplificar seu trabalho para milhares de ouvintes.",
  },
  {
    title: "Analytics Reais",
    description:
      "Metricas que importam: quem ouviu, quem salvou, quem compartilhou. Sem numeros inflados.",
  },
  {
    title: "Visibilidade Organica",
    description:
      "Destaque-se pelo seu talento. Rankings baseados em votos reais da comunidade.",
  },
];

// Testimonials from artists
const testimonials = [
  {
    quote:
      "Finalmente uma plataforma onde minha musica e ouvida por pessoas que realmente se importam. Em 3 meses, ganhei mais fas genuinos do que em anos no Spotify.",
    name: "Marina Costa",
    role: "Cantora/Compositora",
    genre: "MPB Alternativo",
  },
  {
    quote:
      "O feedback que recebo aqui e ouro. Curadores que entendem de musica comentando faixa por faixa. Isso mudou completamente meu processo criativo.",
    name: "Lucas Ferreira",
    role: "Produtor",
    genre: "Electronica Experimental",
  },
  {
    quote:
      "Consegui meus primeiros shows atraves de conexoes feitas no BeMusicShare. A comunidade realmente apoia artistas independentes.",
    name: "Juliana Mendes",
    role: "Artista Solo",
    genre: "Indie Folk",
  },
];

// Features list
const features = [
  "Upload de Musicas",
  "Sistema de Votacao",
  "Comentarios e Discussao",
  "Ranking de Artistas",
  "Player Integrado",
  "Perfis Personalizaveis",
  "Sistema de Favoritos",
  "Notificacoes em Tempo Real",
];

export default function LandingPage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Video carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videoUrls.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[oklch(0.99_0.002_264)] text-[oklch(0.15_0.01_264)] font-['Nohemi',sans-serif]">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="index.html"
            className="text-2xl font-bold text-[oklch(0.55_0.22_240)] tracking-tight hover:opacity-80 transition-opacity"
          >
            BeMusicShare
          </a>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span
              className={`w-6 h-0.5 bg-current transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
            />
            <span
              className={`w-6 h-0.5 bg-current transition-all ${mobileMenuOpen ? "opacity-0" : ""
                }`}
            />
            <span
              className={`w-6 h-0.5 bg-current transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#home"
              className={`font-medium transition-colors ${scrolled
                ? "text-[oklch(0.15_0.01_264)] hover:text-[oklch(0.55_0.22_240)]"
                : "text-white hover:text-white/80"
                }`}
            >
              Inicio
            </a>
            <a
              href="#artistas"
              className={`font-medium transition-colors ${scrolled
                ? "text-[oklch(0.15_0.01_264)] hover:text-[oklch(0.55_0.22_240)]"
                : "text-white hover:text-white/80"
                }`}
            >
              Para Artistas
            </a>
            <a
              href="#como-funciona"
              className={`font-medium transition-colors ${scrolled
                ? "text-[oklch(0.15_0.01_264)] hover:text-[oklch(0.55_0.22_240)]"
                : "text-white hover:text-white/80"
                }`}
            >
              Como Funciona
            </a>
          </nav>

          {/* Header Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/entrar"
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${scrolled
                ? "text-[oklch(0.15_0.01_264)] hover:bg-[oklch(0.96_0.01_264)]"
                : "text-white hover:bg-white/10"
                }`}
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${scrolled
                ? "text-[oklch(0.15_0.01_264)] hover:bg-[oklch(0.96_0.01_264)]"
                : "text-white hover:bg-white/10"
                }`}
            >
              Cadastro
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg transition-all overflow-hidden ${mobileMenuOpen ? "max-h-96 py-4" : "max-h-0"
            }`}
        >
          <nav className="flex flex-col px-6 gap-4">
            <a
              href="#home"
              className="py-2 font-medium text-[oklch(0.15_0.01_264)]"
            >
              Inicio
            </a>
            <a
              href="#artistas"
              className="py-2 font-medium text-[oklch(0.15_0.01_264)]"
            >
              Para Artistas
            </a>
            <a
              href="#como-funciona"
              className="py-2 font-medium text-[oklch(0.15_0.01_264)]"
            >
              Como Funciona
            </a>
            <div className="flex flex-col gap-3 pt-4 border-t border-[oklch(0.9_0.01_264)]">
              <Link
                href="/entrar"
                className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${scrolled
                  ? "text-[oklch(0.15_0.01_264)] hover:bg-[oklch(0.96_0.01_264)]"
                  : "text-white hover:bg-white/10"
                  }`}
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${scrolled
                  ? "text-[oklch(0.15_0.01_264)] hover:bg-[oklch(0.96_0.01_264)]"
                  : "text-white hover:bg-white/10"
                  }`}
              >
                Cadastro
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section
          ref={heroRef}
          id="home"
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Video Background */}
          <div className="absolute inset-0">
            {videoUrls.map((url, index) => (
              <video
                key={url}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentVideoIndex ? "opacity-100" : "opacity-0"
                  }`}
                autoPlay
                muted
                loop
                playsInline
              >
                <source src={url} type="video/mp4" />
              </video>
            ))}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 animate-[fadeInUp_0.6s_ease-out]">
              <span className="w-2 h-2 bg-[oklch(0.65_0.18_200)] rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white/90">
                A nova plataforma para artistas independentes
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8 text-balance animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
              Sua Musica Merece
              <br />
              <span className="bg-gradient-to-r from-[oklch(0.65_0.18_200)] to-[oklch(0.55_0.22_240)] bg-clip-text text-transparent">
                Ser Ouvida
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
              Conecte-se com uma comunidade de curadores apaixonados que
              descobrem, compartilham e celebram musica independente.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
              <a
                href="cadastro.html"
                className="group px-8 py-4 bg-white text-[oklch(0.15_0.01_264)] rounded-xl font-bold text-lg hover:-translate-y-1 transition-all shadow-2xl shadow-black/20 flex items-center gap-3"
              >
                Enviar Minha Musica
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
              </a>
              <a
                href="#artistas"
                className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/10 hover:border-white/50 transition-all"
              >
                Como Funciona
              </a>
            </div>

            {/* Video Indicators */}
            <div className="flex justify-center gap-2 mt-16 animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
              {videoUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVideoIndex(index)}
                  className={`h-1 rounded-full transition-all ${index === currentVideoIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                  aria-label={`Video ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg
              className="w-6 h-6 text-white/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-[oklch(0.15_0.01_264)] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[oklch(0.55_0.22_240)]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[oklch(0.65_0.18_200)]/10 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[oklch(0.65_0.18_200)] to-[oklch(0.55_0.22_240)] bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/60 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Artist Benefits Section */}
        <section id="artistas" className="py-24 relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[oklch(0.55_0.22_240)]/5 to-transparent" />

          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-[oklch(0.55_0.22_240)]/10 text-[oklch(0.55_0.22_240)] rounded-full text-sm font-semibold mb-4">
                Para Artistas
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Por Que Artistas Escolhem
                <br />
                <span className="text-[oklch(0.55_0.22_240)]">BeMusicShare</span>
              </h2>
              <p className="text-xl text-[oklch(0.5_0.02_264)] max-w-2xl mx-auto">
                Uma plataforma construida para dar voz a quem cria. Sem
                algoritmos obscuros, sem pagar para aparecer.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artistBenefits.map((benefit, index) => (
                <article
                  key={benefit.title}
                  className="group p-8 bg-white rounded-2xl border border-[oklch(0.9_0.01_264)] hover:border-[oklch(0.55_0.22_240)]/30 hover:shadow-xl hover:shadow-[oklch(0.55_0.22_240)]/5 transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[oklch(0.55_0.22_240)] to-[oklch(0.65_0.18_200)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[oklch(0.15_0.01_264)]">
                    {benefit.title}
                  </h3>
                  <p className="text-[oklch(0.5_0.02_264)] leading-relaxed">
                    {benefit.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-[oklch(0.15_0.01_264)] relative overflow-hidden">
          {/* Decorative lines */}
          <div className="absolute inset-0 opacity-[0.03]">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute h-px bg-white"
                style={{
                  top: `${i * 5}%`,
                  left: 0,
                  right: 0,
                  transform: `rotate(${-2 + i * 0.2}deg)`,
                }}
              />
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-white/10 text-white/80 rounded-full text-sm font-semibold mb-4">
                Depoimentos
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                O Que Artistas Dizem
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <article
                  key={testimonial.name}
                  className="relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Quote mark */}
                  <svg
                    className="absolute top-6 right-6 w-12 h-12 text-white/5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  <p className="text-white/80 text-lg leading-relaxed mb-8 relative z-10">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[oklch(0.55_0.22_240)] to-[oklch(0.65_0.18_200)]" />
                    <div>
                      <div className="font-bold text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-white/50 text-sm">
                        {testimonial.role}
                      </div>
                      <div className="text-[oklch(0.65_0.18_200)] text-sm">
                        {testimonial.genre}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works / Features Section */}
        <section id="como-funciona" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Visual */}
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-[oklch(0.55_0.22_240)] to-[oklch(0.65_0.18_200)] rounded-3xl overflow-hidden shadow-2xl shadow-[oklch(0.55_0.22_240)]/20">
                  {/* Mock UI elements */}
                  <div className="absolute inset-4 bg-white/10 backdrop-blur-xl rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>

                    {/* Mock music cards */}
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 bg-white/10 rounded-xl mb-3"
                        style={{
                          opacity: 1 - i * 0.2,
                          transform: `translateY(${i * 2}px)`,
                        }}
                      >
                        <div className="w-14 h-14 bg-white/20 rounded-lg" />
                        <div className="flex-1">
                          <div className="h-3 w-32 bg-white/40 rounded mb-2" />
                          <div className="h-2 w-24 bg-white/20 rounded" />
                        </div>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full" />
                          <div className="w-8 h-8 bg-white/20 rounded-full" />
                        </div>
                      </div>
                    ))}

                    {/* Mock player bar */}
                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/20 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/30 rounded" />
                        <div className="flex-1">
                          <div className="h-2 w-full bg-white/20 rounded-full">
                            <div className="h-2 w-1/3 bg-white rounded-full" />
                          </div>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-[oklch(0.55_0.22_240)]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[oklch(0.65_0.18_200)] rounded-2xl flex items-center justify-center shadow-xl rotate-12 animate-pulse">
                  <span className="text-3xl font-bold text-white">#1</span>
                </div>
              </div>

              {/* Right: Content */}
              <div>
                <span className="inline-block px-4 py-1.5 bg-[oklch(0.55_0.22_240)]/10 text-[oklch(0.55_0.22_240)] rounded-full text-sm font-semibold mb-4">
                  Funcionalidades
                </span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                  Tudo Que Voce Precisa
                  <br />
                  <span className="text-[oklch(0.55_0.22_240)]">
                    Para Crescer
                  </span>
                </h2>
                <p className="text-xl text-[oklch(0.5_0.02_264)] mb-10">
                  Ferramentas poderosas para compartilhar sua musica, engajar
                  com a comunidade e acompanhar seu crescimento.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 p-4 bg-[oklch(0.96_0.01_264)] rounded-xl"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="w-8 h-8 bg-[oklch(0.55_0.22_240)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-[oklch(0.55_0.22_240)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-[oklch(0.15_0.01_264)]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.55_0.22_240)] to-[oklch(0.65_0.18_200)]" />

          {/* Decorative circles */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[32rem] h-[32rem] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 border border-white/10 rounded-full" />

          <div className="max-w-4xl mx-auto px-6 text-center relative">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Pronto Para Ser Descoberto?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Junte-se a milhares de artistas independentes que estao
              construindo audiencias genuinas no BeMusicShare.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="cadastro.html"
                className="group px-10 py-5 bg-white text-[oklch(0.15_0.01_264)] rounded-xl font-bold text-lg hover:-translate-y-1 transition-all shadow-2xl flex items-center gap-3"
              >
                Criar Conta Gratis
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
              </a>
            </div>

            <p className="mt-6 text-white/60 text-sm">
              Nenhum cartao de credito necessario. Comece em menos de 2 minutos.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[oklch(0.12_0.01_264)] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <a href="index.html" className="text-2xl font-bold mb-4 block">
                BeMusicShare
              </a>
              <p className="text-white/50 text-sm leading-relaxed">
                A plataforma onde artistas independentes encontram ouvintes que
                realmente se importam.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <nav className="flex flex-col gap-3">
                <a
                  href="#"
                  className="text-white/50 hover:text-white transition-colors text-sm"
                >
                  Recursos
                </a>
                <a
                  href="#como-funciona"
                  className="text-white/50 hover:text-white transition-colors text-sm"
                >
                  Como Funciona
                </a>
                <a
                  href="#"
                  className="text-white/50 hover:text-white transition-colors text-sm"
                >
                  Roadmap
                </a>
              </nav>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <nav className="flex flex-col gap-3">
                <a
                  href="#"
                  className="text-white/50 hover:text-white transition-colors text-sm"
                >
                  Termos de Uso
                </a>
                <a
                  href="#"
                  className="text-white/50 hover:text-white transition-colors text-sm"
                >
                  Politica de Privacidade
                </a>
                <a
                  href="#"
                  className="text-white/50 hover:text-white transition-colors text-sm"
                >
                  Cookies
                </a>
                <a
                  href="#"
                  className="text-white/50 hover:text-white transition-colors text-sm"
                >
                  Conformidade
                </a>
              </nav>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold mb-4">Redes Sociais</h3>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <span className="text-sm font-semibold">In</span>
                </a>
                <a
                  href="https://twitter.com"
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <span className="text-sm font-semibold">X</span>
                </a>
                <a
                  href="https://youtube.com"
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <span className="text-sm font-semibold">YT</span>
                </a>
                <a
                  href="https://discord.com"
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Discord"
                >
                  <span className="text-sm font-semibold">Dc</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-white/40 text-sm">2025 BeMusicShare.</p>
          </div>
        </div>
      </footer>

      {/* Global Styles for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}