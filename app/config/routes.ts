export const routes = {
  // Rotas públicas
  home: "/",
  about: "/sobre",
  services: "/servicos",
  vehicles: "/frota",
  contact: "/contato",
  reviews: "/avaliacoes",
  
  // Rotas de avaliação
  evaluations: "/avaliacoes",
  evaluate: "/avaliar",
  evaluationSent: "/avaliacao-enviada",
  
  // Rotas administrativas
  admin: "/admin",
  
  // Rotas de autenticação
  login: "/login",
  register: "/cadastro",
  
  // Rotas do blog
  blog: "/blog",
} as const;

export type Route = keyof typeof routes; 