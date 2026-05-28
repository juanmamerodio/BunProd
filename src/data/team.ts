import { TeamMember } from '../types';

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    nombre: 'Delfina Solari',
    rol: 'Directora de Arte & Fotografía Cinematográfica',
    descripcion: 'Obsesiva del detalle visual, el encuadre perfecto y la colorimetría de nivel internacional. Su mirada artística garantiza que cada marca adquiera una impronta de lujo desde el primer frame. No improvisa: diseña cada set para transmitir sofisticación y dominio estético absoluto.',
    imagen: '/assets/team/delfina.jpg',
    especialidades: [
      'Dirección de Fotografía',
      'Color Grading de Cine',
      'Diseño de Iluminación de Alta Gama',
      'Curaduría Estética Corporativa'
    ]
  },
  {
    id: '2',
    nombre: 'Sofía Valenzuela',
    rol: 'Head of Visual Strategy & Performance',
    descripcion: 'Estratega obsesionada con que la belleza visual genere números reales. Fusiona la alta costura audiovisual con estructuras de retención psicológica. Si Delfina crea la magia en el lente, Sofía se asegura de que esa magia retenga a tu cliente ideal y lo mueva a la acción en segundos.',
    imagen: '/assets/team/sofia.jpg',
    especialidades: [
      'Estructura de Retención Psicológica',
      'Copywriting Cinematográfico',
      'Conversión para High-Ticket',
      'Optimización de Funnels de Video'
    ]
  }
];
