export const PRODUCT = {
  name: 'FluxoCerto',
  tagline: 'Projeção de fluxo de caixa para renda variável',
  subtagline:
    'Para freelancers, autônomos e comissionados. Veja seus próximos 90 dias em dois cenários e descubra se você pode gastar hoje sem quebrar amanhã.',
}

export const PRICING = {
  priceBRL: 'R$ 19,90',
  period: 'por mês',
  trialDays: 14,
}

export const LINKS = {
  // Default to a short, marketing-friendly subdomain (override via VITE_APP_URL).
  // Example override: VITE_APP_URL="https://app.fluxocerto.app"
  appUrl: import.meta.env.VITE_APP_URL || 'https://painel.fluxocerto.app',
}
