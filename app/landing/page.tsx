"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  CheckCircle2,
  TrendingDown,
  Users,
  Target,
  Smartphone,
  Heart,
  Activity,
  Wallet,
  Camera,
  Lock,
  ArrowRight,
  Zap,
  Award,
} from "lucide-react";

export default function LandingPage() {
  const [hoveredPilar, setHoveredPilar] = useState<number | null>(null);

  const pilares = [
    {
      icone: "🏃",
      titulo: "Movimento",
      descricao: "Passos e atividade física via Health Connect, sem editar dados.",
    },
    {
      icone: "🌙",
      titulo: "Sono",
      descricao: "Verificação automática de horas e qualidade do sono.",
    },
    {
      icone: "🥗",
      titulo: "Nutrição",
      descricao: "Foto da refeição + análise por IA. Sem digitar nada.",
    },
    {
      icone: "⚖️",
      titulo: "Peso",
      descricao: "Foto da balança com OCR. Evolução real, não autorrelato.",
    },
    {
      icone: "📱",
      titulo: "Bem-estar Digital",
      descricao: "Tempo de tela e desconexão — exigência da NR-1.",
    },
    {
      icone: "💚",
      titulo: "Bem-estar Emocional",
      descricao: "Escala WHO-5 validada e check-ins periódicos.",
    },
    {
      icone: "💰",
      titulo: "Saúde Financeira",
      descricao: "Estresse financeiro é risco psicossocial — NR-1.",
    },
  ];

  const diferenciais = [
    {
      icone: Shield,
      titulo: "Compliance NR-1",
      descricao: "Relatório PGR pronto para fiscalização. Evite a multa de R$ 6.708 por funcionário.",
    },
    {
      icone: Lock,
      titulo: "LGPD by design",
      descricao: "Dados ficam no celular do funcionário. Empresa só vê agregado.",
    },
    {
      icone: Zap,
      titulo: "Anti-fraude 5 camadas",
      descricao: "Health Connect, OCR, IA, geolocalização e checagem cruzada.",
    },
    {
      icone: Award,
      titulo: "Funciona com qualquer operadora",
      descricao: "Sulamérica, Bradesco, Amil, Hapvida, Unimed — todas.",
    },
  ];

  const comparativo = [
    { recurso: "Compliance NR-1", saluflow: "✅", gympass: "❌", apps: "❌" },
    { recurso: "Anti-fraude 5 camadas", saluflow: "✅", gympass: "❌", apps: "❌" },
    { recurso: "Funciona com qualquer operadora", saluflow: "✅", gympass: "❌", apps: "❌" },
    { recurso: "Dados locais (LGPD)", saluflow: "✅", gympass: "❌", apps: "⚠️" },
    { recurso: "Foco em plano de saúde", saluflow: "✅", gympass: "⚠️", apps: "❌" },
    { recurso: "Preço", saluflow: "Sob consulta", gympass: "R$ 30-150/func", apps: "Grátis" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#202124]">
      {/* 1. HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #FFFFFF 0%, #E8F0FE 100%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <img
            src="/logo.png"
            alt="SaluFlow"
            className="w-64 mx-auto mb-8"
          />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-[#202124]">
            Cuidar é simples. Provar é poderoso.
          </h1>
          <p className="text-lg md:text-xl text-[#5F6368] mb-10 max-w-2xl mx-auto leading-relaxed">
            A primeira plataforma de saúde corporativa com compliance NR-1 verificado
            e bonificação legal pelo plano de saúde.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <a
              href="mailto:jose@saluflow.com.br"
              className="bg-[#1A73E8] hover:bg-[#1557b0] text-white font-semibold px-8 py-4 rounded-full transition-all shadow-sm hover:shadow-md flex items-center gap-2"
            >
              Falar com vendas
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              href="/"
              className="text-[#1A73E8] font-semibold px-6 py-4 hover:underline"
            >
              Baixar o app
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 2. O PROBLEMA */}
      <section className="py-16 px-6 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#202124]">
              R$ 6.708 por funcionário.
            </h2>
            <p className="text-lg md:text-xl text-[#5F6368] max-w-2xl mx-auto">
              Esse é o tamanho da multa NR-1 a partir de maio de 2026.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                numero: "530.000",
                texto: "afastamentos por transtornos mentais em 2025",
              },
              {
                numero: "70%",
                texto: "das doenças que custam plano de saúde são preveníveis",
              },
              {
                numero: "85%",
                texto: "de sinistralidade média no mercado de planos",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm p-8 text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#1A73E8] mb-3">
                  {item.numero}
                </div>
                <p className="text-[#5F6368] leading-relaxed">{item.texto}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. A SOLUÇÃO */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#202124]">
              7 pilares. Tudo verificado. Tudo legal.
            </h2>
            <p className="text-lg text-[#5F6368] max-w-2xl mx-auto">
              Cada pilar com mecanismo anti-fraude próprio. Nada de autorrelato.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pilares.map((pilar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                onHoverStart={() => setHoveredPilar(i)}
                onHoverEnd={() => setHoveredPilar(null)}
                className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm p-6 hover:shadow-md transition-all"
              >
                <div className="text-5xl mb-4">{pilar.icone}</div>
                <h3 className="text-xl font-semibold text-[#202124] mb-2">
                  {pilar.titulo}
                </h3>
                <p className="text-sm text-[#5F6368] mb-4 leading-relaxed">
                  {pilar.descricao}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-[#E6F4EA] text-[#137333] px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  verificado
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DIFERENCIAL */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#202124]">
              O que NÓS temos que ninguém mais tem.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {diferenciais.map((d, i) => {
              const Icon = d.icone;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm p-8 flex gap-4"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-[#E8F0FE] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#1A73E8]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#202124] mb-2">
                      {d.titulo}
                    </h3>
                    <p className="text-[#5F6368] leading-relaxed">{d.descricao}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. COMO FUNCIONA */}
      <section className="py-16 px-6 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#202124]">
              Como funciona
            </h2>
            <p className="text-lg text-[#5F6368]">3 passos. Simples assim.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                numero: "1",
                titulo: "Funcionário usa o app",
                descricao: "Gratuito. Dados ficam no celular dele.",
                icone: Smartphone,
              },
              {
                numero: "2",
                titulo: "Empresa recebe relatório",
                descricao: "Dashboard agregado e anônimo de bem-estar.",
                icone: Users,
              },
              {
                numero: "3",
                titulo: "Compliance + Bônus",
                descricao: "NR-1 ok e bonificação legal pelo plano de saúde.",
                icone: Award,
              },
            ].map((step, i) => {
              const Icon = step.icone;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm p-8 text-center relative"
                >
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#1A73E8] text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {step.numero}
                  </div>
                  <div className="w-16 h-16 mx-auto mt-4 mb-4 rounded-2xl bg-[#E8F0FE] flex items-center justify-center">
                    <Icon className="w-8 h-8 text-[#1A73E8]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#202124] mb-2">
                    {step.titulo}
                  </h3>
                  <p className="text-[#5F6368] leading-relaxed">
                    {step.descricao}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. PARA QUEM É */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#202124]">
              Para quem é
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                titulo: "Empresa",
                icone: Target,
                cor: "#1A73E8",
                bullets: [
                  "Evita a multa NR-1 (R$ 6.708/func)",
                  "Reduz sinistralidade do plano de saúde",
                  "Bonificação legal pela operadora",
                ],
              },
              {
                titulo: "RH",
                icone: Users,
                cor: "#34A853",
                bullets: [
                  "Dashboard agregado de bem-estar",
                  "Relatório PGR pronto para auditoria",
                  "Indicadores reais, não autorrelato",
                ],
              },
              {
                titulo: "Funcionário",
                icone: Heart,
                cor: "#EA4335",
                bullets: [
                  "App 100% gratuito",
                  "Dados privados no próprio celular",
                  "Bônus por cuidar da saúde",
                ],
              },
            ].map((p, i) => {
              const Icon = p.icone;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm p-8"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${p.cor}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: p.cor }} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#202124] mb-4">
                    {p.titulo}
                  </h3>
                  <ul className="space-y-3">
                    {p.bullets.map((b, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-[#5F6368]"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#34A853] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. COMPARATIVO */}
      <section className="py-16 px-6 bg-[#F8F9FA]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#202124]">
              SaluFlow vs alternativas
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F9FA] border-b border-[#DADCE0]">
                  <tr>
                    <th className="text-left p-4 font-semibold text-[#202124]">
                      Recurso
                    </th>
                    <th className="p-4 font-semibold text-[#1A73E8]">SaluFlow</th>
                    <th className="p-4 font-semibold text-[#5F6368]">Gympass</th>
                    <th className="p-4 font-semibold text-[#5F6368]">
                      Apps de hábitos
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparativo.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-[#DADCE0] last:border-b-0"
                    >
                      <td className="p-4 text-[#202124] font-medium">
                        {row.recurso}
                      </td>
                      <td className="p-4 text-center text-lg">{row.saluflow}</td>
                      <td className="p-4 text-center text-lg">{row.gympass}</td>
                      <td className="p-4 text-center text-lg">{row.apps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. URGÊNCIA */}
      <section className="py-20 px-6 bg-[#1A73E8] text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-white/20 text-sm font-semibold">
            ATENÇÃO
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6">Maio de 2026</h2>
          <p className="text-lg md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Quando a fiscalização punitiva da NR-1 começa.
            <br />
            Sua empresa está pronta?
          </p>
          <a
            href="mailto:jose@saluflow.com.br"
            className="inline-flex items-center gap-2 bg-white text-[#1A73E8] hover:bg-[#F8F9FA] font-semibold px-8 py-4 rounded-full transition-all shadow-lg"
          >
            Solicitar piloto gratuito
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </section>

      {/* 9. CTA FINAL */}
      <section className="py-20 px-6 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#202124]">
            Pronto para começar?
          </h2>
          <p className="text-lg md:text-xl text-[#5F6368] mb-10">
            Piloto gratuito de 90 dias. Sem custo. Sem risco.
          </p>
          <a
            href="mailto:jose@saluflow.com.br"
            className="inline-flex items-center gap-2 bg-[#1A73E8] hover:bg-[#1557b0] text-white font-semibold px-10 py-5 rounded-full transition-all shadow-sm hover:shadow-md text-lg mb-8"
          >
            Falar com vendas
            <ArrowRight className="w-5 h-5" />
          </a>
          <div className="space-y-2 text-[#5F6368]">
            <p>
              <a
                href="mailto:jose@saluflow.com.br"
                className="text-[#1A73E8] hover:underline font-medium"
              >
                jose@saluflow.com.br
              </a>
            </p>
            <p>(16) 99999-0000</p>
          </div>
        </motion.div>
      </section>

      {/* 10. FOOTER */}
      <footer className="border-t border-[#DADCE0] py-12 px-6 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SaluFlow" className="h-8" />
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#5F6368]">
            <Link href="/legal/privacidade" className="hover:text-[#1A73E8]">
              Política de privacidade
            </Link>
            <Link href="/legal/termos" className="hover:text-[#1A73E8]">
              Termos de uso
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1A73E8]"
            >
              GitHub
            </a>
          </div>
          <p className="text-sm text-[#5F6368]">
            © 2026 SaluFlow. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
