import { useEffect, useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  Briefcase,
  CalendarClock,
  Check,
  CircleAlert,
  Coins,
  Facebook,
  Instagram,
  Layers,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingDown,
} from 'lucide-react'
import { Button } from '@/components/button'
import { Reveal } from '@/components/reveal'
import { Logo } from '@/components/logo'
import { HeroProjectionChart } from '@/components/hero-projection-chart'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/cn'
import { LINKS, PRICING, PRODUCT } from '@/content'
import { captureEvent } from '@/lib/analytics/posthog'

function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('mx-auto w-full max-w-6xl px-5 sm:px-7', className)}>{children}</div>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3 py-1 text-xs text-[color:var(--color-dim-foreground)]">
      <Sparkles className="h-3.5 w-3.5 text-[color:var(--color-brand-blue)]" aria-hidden="true" />
      {children}
    </span>
  )
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5 shadow-[0_10px_50px_rgba(0,0,0,0.16)]">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-surface-2)] border border-[color:var(--color-border)]">
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">{title}</div>
          <div className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">{desc}</div>
        </div>
      </div>
    </div>
  )
}

function UseCaseCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-1)] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-surface-2)] text-[color:var(--color-brand-blue)]">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-[color:var(--color-foreground)]">{title}</div>
        <div className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">{desc}</div>
      </div>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-1)] p-5">
      <div className="text-sm font-semibold">{q}</div>
      <div className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">{a}</div>
    </div>
  )
}

function CtaButtons() {
  const hasAppUrl = LINKS.appUrl.trim().length > 0

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      {hasAppUrl ? (
        <a href={LINKS.appUrl}>
          <Button
            size="lg"
            onClick={() =>
              captureEvent('landing_cta_clicked', { placement: 'header', action: 'start_trial', href: LINKS.appUrl })
            }
          >
            Começar teste grátis
            <ArrowRight className="h-4 w-4 opacity-90" aria-hidden="true" />
          </Button>
        </a>
      ) : (
        <Button size="lg" disabled title="Defina VITE_APP_URL para habilitar o botão">
          Começar teste grátis
          <ArrowRight className="h-4 w-4 opacity-90" aria-hidden="true" />
        </Button>
      )}

      {hasAppUrl ? (
        <a href={LINKS.appUrl}>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => captureEvent('landing_cta_clicked', { placement: 'header', action: 'login', href: LINKS.appUrl })}
          >
            Entrar
          </Button>
        </a>
      ) : (
        <Button variant="secondary" size="lg" disabled>
          Entrar
        </Button>
      )}
    </div>
  )
}

function SingleCtaButton() {
  const hasAppUrl = LINKS.appUrl.trim().length > 0

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      {hasAppUrl ? (
        <a href={LINKS.appUrl}>
          <Button
            size="lg"
            onClick={() =>
              captureEvent('landing_cta_clicked', { placement: 'pricing', action: 'start_trial', href: LINKS.appUrl })
            }
          >
            Começar teste grátis
            <ArrowRight className="h-4 w-4 opacity-90" aria-hidden="true" />
          </Button>
        </a>
      ) : (
        <Button size="lg" disabled title="Defina VITE_APP_URL para habilitar o botão">
          Começar teste grátis
          <ArrowRight className="h-4 w-4 opacity-90" aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}

function HeroCtaButton() {
  const hasAppUrl = LINKS.appUrl.trim().length > 0

  return (
    <div className="flex">
      {hasAppUrl ? (
        <a href={LINKS.appUrl}>
          <Button
            size="lg"
            className="fc-hero-cta"
            onClick={() =>
              captureEvent('landing_cta_clicked', { placement: 'hero', action: 'start_trial', href: LINKS.appUrl })
            }
          >
            Começar teste grátis
            <ArrowRight className="h-4 w-4 opacity-90" aria-hidden="true" />
          </Button>
        </a>
      ) : (
        <Button size="lg" disabled title="Defina VITE_APP_URL para habilitar o botão" className="fc-hero-cta">
          Começar teste grátis
          <ArrowRight className="h-4 w-4 opacity-90" aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}

export function App() {
  const reduce = useReducedMotion()

  const debugEnabled = useMemo(() => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).has('debug')
  }, [])

  void debugEnabled

  useEffect(() => {
    return () => {
      // no-op
    }
  }, [debugEnabled])

  return (
    <div id="top" className="min-h-screen">
      <div aria-hidden="true" className="fc-fixed-bg" />
      {debugEnabled ? null : null}

      <header className="sticky top-0 z-20 border-b border-[color:var(--color-border-soft)] bg-[color:var(--color-header)] backdrop-blur">
        <Container className="flex items-center justify-between py-4 sm:py-5">
          <a
            href="#top"
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(64,181,232,0.55)]"
            aria-label="Voltar ao topo"
          >
            <Logo />
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[color:var(--color-dim-foreground)]">
            <a className="hover:text-[color:var(--color-foreground)]" href="#como-funciona">
              Como funciona
            </a>
            <a className="hover:text-[color:var(--color-foreground)]" href="#recursos">
              Recursos
            </a>
            <a className="hover:text-[color:var(--color-foreground)]" href="#preco">
              Preço
            </a>
            <a className="hover:text-[color:var(--color-foreground)]" href="#faq">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <CtaButtons />
            </div>
          </div>
        </Container>
      </header>

      <main>
        {/* "Top background" overlay should end after Como funciona (not based on viewport height). */}
        <div className="relative fc-top-bg">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 fc-grain opacity-[0.35]" />

          <section className="relative">
            <Container className="pt-14 sm:pt-20 pb-10 sm:pb-12">
              <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                <div>
                  <Pill>
                    {PRICING.trialDays} dias grátis • {PRICING.priceBRL}/{PRICING.period}
                  </Pill>

                  <motion.h1
                    className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight"
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={reduce ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    Pare de adivinhar.
                    <br />
                    <span className="text-[color:var(--color-brand-blue)]">Planeje</span> com confiança.
                  </motion.h1>

                  <motion.p
                    className="mt-4 text-base sm:text-lg text-[color:var(--color-muted-foreground)] max-w-xl"
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={reduce ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                  >
                    {PRODUCT.subtagline}
                  </motion.p>

                  <motion.div
                    className="mt-6"
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={reduce ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
                  >
                    <HeroCtaButton />
                  </motion.div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {[{ t: '2 cenários', d: 'Otimista e pessimista' }, { t: 'Dias de risco', d: 'Avisos antes do negativo' }, { t: 'Ritual mensal', d: 'Atualize em minutos' }].map(
                      (item) => (
                        <div
                          key={item.t}
                          className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-1)] p-4"
                        >
                          <div className="text-sm font-semibold">{item.t}</div>
                          <div className="mt-1 text-xs text-[color:var(--color-muted-foreground)]">{item.d}</div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-6 -z-10 opacity-80">
                    <div className="fc-float absolute left-4 top-8 h-48 w-48 rounded-full bg-[rgba(64,181,232,0.25)] blur-3xl" />
                    <div className="fc-float absolute right-2 top-24 h-52 w-52 rounded-full bg-[rgba(99,102,241,0.22)] blur-3xl" style={{ animationDelay: '0.9s' }} />
                    <div className="fc-float absolute right-14 bottom-6 h-44 w-44 rounded-full bg-[rgba(16,185,129,0.16)] blur-3xl" style={{ animationDelay: '1.6s' }} />
                  </div>

                  <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-1)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.22)]">
                    <div className="text-sm font-semibold">Seu próximo mês, em um olhar</div>
                    <div className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
                      Duas projeções para tomar decisões sem depender de “torcer pra cair”.
                    </div>

                    <div className="mt-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-inset)] p-4">
                      <div className="flex items-center justify-between text-xs text-[color:var(--color-dim-foreground)]">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full bg-emerald-400/90 ring-1 ring-[color:var(--color-border)]"
                            aria-hidden="true"
                          />
                          Otimista
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full bg-amber-400/90 ring-1 ring-[color:var(--color-border)]"
                            aria-hidden="true"
                          />
                          Pessimista
                        </span>
                      </div>
                      <div className="mt-3 h-28 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(64,181,232,0.10),rgba(0,0,0,0))]">
                        <HeroProjectionChart className="h-full w-full" />
                      </div>
                      <div className="mt-3 flex items-start gap-2 text-xs text-[color:var(--color-dim-foreground)]">
                        <CircleAlert className="h-4 w-4 text-amber-300" aria-hidden="true" />
                        <span>
                          Dias de risco aparecem quando o saldo projetado pode ficar <b>negativo</b>.
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3">
                      <div className="flex items-start gap-2 text-sm text-[color:var(--color-dim-foreground)]">
                        <ShieldCheck className="h-4 w-4 mt-0.5 text-[color:var(--color-brand-blue)]" aria-hidden="true" />
                        <span>Sem categorizar transações. Foco em projeção.</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-[color:var(--color-dim-foreground)]">
                        <ShieldCheck className="h-4 w-4 mt-0.5 text-[color:var(--color-brand-blue)]" aria-hidden="true" />
                        <span>Feito para grupos com renda variável (freela, PJ, comissão).</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>

          <section className="border-b border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-2)]/30 py-10">
            <Container>
              <div className="grid gap-4 md:grid-cols-3">
                <UseCaseCard
                  icon={<Coins className="h-5 w-5" />}
                  title="Corretores e Vendas"
                  desc="Fechou um contrato grande? Saiba exatamente até quando a comissão vai durar antes da próxima venda."
                />
                <UseCaseCard
                  icon={<Stethoscope className="h-5 w-5" />}
                  title="Saúde e Liberais"
                  desc="Controle repasses de convênios, plantões e atendimentos particulares em uma visão unificada."
                />
                <UseCaseCard
                  icon={<Briefcase className="h-5 w-5" />}
                  title="Freelancers e PJs"
                  desc="Pare de misturar dinheiro da empresa com pessoal. Saiba seu pró-labore real mês a mês."
                />
              </div>
            </Container>
          </section>

          <section id="como-funciona" className="pt-10 pb-14 sm:pt-12 sm:pb-18">
            <Container>
              <Reveal>
                <div className="text-sm font-semibold text-[color:var(--color-foreground)]">Como funciona</div>
                <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
                  Um ritual mensal simples. Clareza para o mês todo.
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[color:var(--color-muted-foreground)] max-w-2xl">
                  Você cadastra contas, receitas e despesas. Depois, só atualiza saldos de tempos em tempos (geralmente 1x/mês)
                  e o FluxoCerto faz o resto.
                </p>
              </Reveal>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <Reveal delay={0.05}>
                  <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-1)] p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Layers className="h-4 w-4 text-[color:var(--color-brand-blue)]" aria-hidden="true" />
                      1) Cadastre o básico
                    </div>
                    <div className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
                      Contas, cartões, receitas (com nível de certeza) e despesas.
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-1)] p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <CalendarClock className="h-4 w-4 text-[color:var(--color-brand-blue)]" aria-hidden="true" />
                      2) Atualize em minutos
                    </div>
                    <div className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
                      Um fluxo rápido para atualizar saldos e manter a projeção confiável.
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.15}>
                  <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-1)] p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <TrendingDown className="h-4 w-4 text-[color:var(--color-brand-blue)]" aria-hidden="true" />
                      3) Antecipe dias de risco
                    </div>
                    <div className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
                      Veja quando o saldo pode ficar negativo e o que fazer antes disso.
                    </div>
                  </div>
                </Reveal>
              </div>
            </Container>
          </section>
        </div>

        {/* Background break after "Como funciona" (divider only, keep background continuous) */}
        <div
          aria-hidden="true"
          className="h-px w-full bg-[linear-gradient(90deg,transparent,var(--color-divider),transparent)]"
        />

        {/* Darker background block to visually separate Recursos + Preço from the rest. */}
        <div className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--color-overlay),var(--color-overlay))]"
          />

          <div className="relative">
            <section id="recursos" className="py-14 sm:py-18">
              <Container>
                <Reveal>
                  <div className="text-sm font-semibold text-[color:var(--color-foreground)]">Recursos</div>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
                    O que faz o FluxoCerto ser diferente
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-[color:var(--color-muted-foreground)] max-w-2xl">
                    A maioria dos apps assume que sua renda é certa. Aqui, você enxerga o melhor e o pior cenário e decide com dados.
                  </p>
                </Reveal>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <Reveal delay={0.02}>
                    <Feature
                      icon={<Layers className="h-5 w-5 text-[color:var(--color-brand-blue)]" aria-hidden="true" />}
                      title="Dois cenários (otimista e pessimista)"
                      desc="Compare o cenário que inclui toda renda com o cenário só de renda garantida."
                    />
                  </Reveal>
                  <Reveal delay={0.06}>
                    <Feature
                      icon={<TrendingDown className="h-5 w-5 text-[color:var(--color-brand-blue)]" aria-hidden="true" />}
                      title="Dias de risco destacados"
                      desc="O app sinaliza automaticamente os dias em que o saldo projetado pode ficar abaixo de zero."
                    />
                  </Reveal>
                  <Reveal delay={0.1}>
                    <Feature
                      icon={<CalendarClock className="h-5 w-5 text-[color:var(--color-brand-blue)]" aria-hidden="true" />}
                      title="Projeção 30/60/90 dias"
                      desc="Planeje no horizonte certo para você e veja o fluxo diário, sem planilhas."
                    />
                  </Reveal>
                  <Reveal delay={0.14}>
                    <Feature
                      icon={<ShieldCheck className="h-5 w-5 text-[color:var(--color-brand-blue)]" aria-hidden="true" />}
                      title="Pensado para grupos"
                      desc="Centralize a visão do grupo e tome decisões juntos, com menos ansiedade e mais clareza."
                    />
                  </Reveal>
                </div>
              </Container>
            </section>

            <section id="preco" className="py-14 sm:py-18">
              <Container>
                <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                  <Reveal>
                    <div className="text-sm font-semibold text-[color:var(--color-foreground)]">Preço</div>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
                      Simples: um plano, acesso completo
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-[color:var(--color-muted-foreground)] max-w-2xl">
                      Sem pegadinhas, sem dezenas de tiers. Teste por {PRICING.trialDays} dias e veja se substitui sua planilha.
                    </p>
                  </Reveal>

                  <Reveal delay={0.06}>
                    <div className="rounded-3xl border border-[color:var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface-3),var(--color-surface-1))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.22)]">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold">Plano Único</div>
                          <div className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
                            Tudo que você precisa para projetar e agir.
                          </div>
                        </div>
                        <span className="rounded-full bg-[color:var(--fc-badge-bg)] text-[color:var(--fc-badge-fg)] px-3 py-1 text-xs font-semibold border border-[color:var(--fc-badge-border)] shadow-[0_8px_22px_var(--fc-badge-shadow)]">
                          {PRICING.trialDays} dias grátis
                        </span>
                      </div>

                      <div className="mt-6">
                        <div className="text-4xl font-semibold tracking-tight">{PRICING.priceBRL}</div>
                        <div className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">{PRICING.period}</div>
                      </div>

                      <div className="mt-6 grid gap-3">
                        {[
                          'Projeção 30/60/90 dias',
                          'Dois cenários: otimista e pessimista',
                          'Dias de risco destacados',
                          'Ritual de atualização rápida',
                          'Cancele quando quiser',
                        ].map((t) => (
                          <div key={t} className="flex items-start gap-2 text-sm text-[color:var(--color-dim-foreground)]">
                            <Check className="h-4 w-4 mt-0.5 text-emerald-300" aria-hidden="true" />
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-7">
                        <SingleCtaButton />
                        <div className="mt-3 text-xs text-[color:var(--color-faint-foreground)]">
                          Após o teste, a assinatura segue automaticamente. Você pode cancelar a qualquer momento.
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </Container>
            </section>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="h-px w-full bg-[linear-gradient(90deg,transparent,var(--color-divider),transparent)]"
        />

        <section id="faq" className="py-14 sm:py-18">
          <Container>
            <Reveal>
              <div className="text-sm font-semibold text-[color:var(--color-foreground)]">FAQ</div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
                Perguntas frequentes
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[color:var(--color-muted-foreground)] max-w-2xl">
                O FluxoCerto é feito para quem quer clareza de fluxo de caixa, sem burocracia.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Reveal delay={0.03}>
                <FaqItem
                  q="Preciso categorizar todas as transações?"
                  a="Não. O foco é projeção: saldos, receitas e despesas com datas. Menos manutenção, mais previsibilidade."
                />
              </Reveal>
              <Reveal delay={0.06}>
                <FaqItem
                  q="Para quem isso é ideal?"
                  a="Corretores, médicos, dentistas, freelancers, advogados e qualquer profissional que não tem salário fixo no dia 5."
                />
              </Reveal>
              <Reveal delay={0.09}>
                <FaqItem
                  q="O que significa “dois cenários”?"
                  a="Você compara um cenário otimista (toda renda) com um pessimista (apenas renda garantida). Assim, dá para planejar e se proteger." 
                />
              </Reveal>
              <Reveal delay={0.12}>
                <FaqItem
                  q="Posso cancelar quando quiser?"
                  a="Sim. Você inicia o teste grátis e pode cancelar a qualquer momento antes de começar a pagar."
                />
              </Reveal>
            </div>

            <Reveal delay={0.16}>
              <div className="mt-10 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-1)] p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="text-lg font-semibold">Pronto para trocar planilhas por clareza?</div>
                  <div className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
                    Comece com {PRICING.trialDays} dias grátis. Leva poucos minutos para ver sua primeira projeção.
                  </div>
                </div>
                <SingleCtaButton />
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Removed "Observação" section per request */}
      </main>

      <footer className="border-t border-[color:var(--color-border-soft)] bg-[color:var(--color-header)]">
        <Container className="py-10 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-4 text-sm text-[color:var(--color-dim-foreground)]">
              <a className="hover:text-[color:var(--color-foreground)]" href="#preco">
                Preço
              </a>
              <a className="hover:text-[color:var(--color-foreground)]" href="#faq">
                FAQ
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <a
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-lg cursor-pointer',
                'text-[color:var(--color-dim-foreground)] hover:text-[color:var(--color-foreground)]',
                'transition-[color,opacity,transform] duration-200',
                'hover:opacity-90 hover:-translate-y-[1px]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(64,181,232,0.55)] focus-visible:ring-offset-0',
                'active:translate-y-[1px]'
              )}
              href="https://instagram.com/meufluxocerto"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-lg cursor-pointer',
                'text-[color:var(--color-dim-foreground)] hover:text-[color:var(--color-foreground)]',
                'transition-[color,opacity,transform] duration-200',
                'hover:opacity-90 hover:-translate-y-[1px]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(64,181,232,0.55)] focus-visible:ring-offset-0',
                'active:translate-y-[1px]'
              )}
              href="https://www.facebook.com/profile.php?id=61587100917870"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Facebook"
            >
              <Facebook className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </Container>
      </footer>
    </div>
  )
}
