import type { PortfolioCase } from '../types';

export const portfolioCases: PortfolioCase[] = [
  {
    id: '1',
    cliente: 'Aura Atelier',
    industria: 'Moda y Ropa de Diseño',
    metricaDestacada: 'Lanzamiento Sold-Out & +350% Interacciones',
    descripcion: 'Redefinimos la comunicación audiovisual de su última colección de alta costura. Pasamos de fotos planas de catálogo a micro-documentales y fashion films de estética cinematográfica oscura. Logramos conectar con el deseo emocional de su cliente ideal, justificando precios premium.',
    beforeImage: '/assets/portfolio/aura-before.jpg',
    afterImageOrVideo: '/assets/portfolio/aura-after.mp4',
    tags: ['Dirección Artística', 'Fashion Film', 'Look-and-Feel Oscuro', 'Campaña Lanzamiento']
  },
  {
    id: '2',
    cliente: 'Clínica Dermolaser Valen',
    industria: 'Estética Médica Premium',
    metricaDestacada: 'Agenda de Consultas High-Ticket Completa por 3 Meses',
    descripcion: 'Diseñamos el ecosistema visual y estrategia de ganchos psicológicos de sus reels informativos. Al transformar explicaciones clínicas complejas en historias estéticas inmersivas de alta retención, erradicamos la objeción de precio, atrayendo pacientes buscando excelencia y no descuentos.',
    beforeImage: '/assets/portfolio/clinic-before.jpg',
    afterImageOrVideo: '/assets/portfolio/clinic-after.mp4',
    tags: ['Reels Funnel', 'Scripting Premium', 'Color Grading Cine', 'Conversión Orgánica']
  },
  {
    id: '3',
    cliente: 'Nero Bistró',
    industria: 'Gastronomía de Autor',
    metricaDestacada: 'Reposicionamiento Exclusivo & +180% Reservas Mensuales',
    descripcion: 'Creamos spots visuales inmersivos enfocados en el misterio, el detalle de la cocina y el ambiente del restaurante a puertas cerradas. El contenido transmitió exclusividad pura, posicionando la experiencia como un secreto codiciado para los paladares más exigentes de la ciudad.',
    beforeImage: '/assets/portfolio/nero-before.jpg',
    afterImageOrVideo: '/assets/portfolio/nero-after.mp4',
    tags: ['Gastronomía Inmersiva', 'Diseño de Sonido ASMR', 'Dirección de Luces', 'Storytelling Visual']
  }
];
