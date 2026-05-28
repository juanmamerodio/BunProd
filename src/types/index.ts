// ─── TeamMember ──────────────────────────────────────────────────────────────
export interface TeamMember {
  id: string;
  nombre: string;
  rol: string;
  descripcion: string;
  imagen?: string;
  especialidades: string[];
}

// ─── Service ─────────────────────────────────────────────────────────────────
export interface Service {
  id: string;
  titulo: string;
  descripcion: string;
  beneficios: string[];
  resultadoEsperado: string;
  tag?: string;
}

// ─── PortfolioCase ───────────────────────────────────────────────────────────
export interface PortfolioCase {
  id: string;
  cliente: string;
  industria: string;
  metricaDestacada: string;
  descripcion: string;
  beforeImage?: string;
  afterImageOrVideo?: string;
  tags: string[];
}

// ─── Metric ──────────────────────────────────────────────────────────────────
export interface Metric {
  id: string;
  valor: number;
  sufijoPrefijo: string; // e.g. "M+" or "%" or "x" or "$"
  etiqueta: string;
}
