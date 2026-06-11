import type { TeamMember } from '../types';

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    nombre: 'Emilia Dearriba',
    rol: 'Directora y Productora Ejecutiva',
    descripcion: 'Lidera la dirección en rodajes y la ejecución creativa. Su enfoque combina el control logístico del backstage con un estándar técnico altísimo, garantizando que la estética de cada marca impacte en el primer frame y la producción fluya sin cuellos de botella.',
    imagen: '/assets/team/emilia.jpg',
    especialidades: [
      'Dirección Audiovisual',
      'Producción Ejecutiva',
      'Stage Management y Backstage',
      'Resolución Logística en Set'
    ]
  },
  {
    id: '2',
    nombre: 'Tiziana Piccione',
    rol: 'Directora de Fotografía, Operadora de Cámara y Colorista',
    descripcion: ' Con experiencia en eventos masivos y shows en vivo, maneja los tiempos operativos y la cámara para que no se pierda ni un clip. Cierra nuestro pipeline estructurando el managment operativo y aplicando el color grading de nivel en edición. Tolerancia cero a las fallas técnicas.',
    imagen: '/assets/team/tiziana.png',
    especialidades: [
      'Producción Ejecutiva y Operativa',
      'Operación de Cámara',
      'Colorización y Edición',
      'Gestión de Flujos en Tiempo Real'
    ]
  },
  {
    id: '3',
    nombre: 'Victoria Cornaro',
    rol: 'Prod. Creativa, CM y Edición',
    descripcion: 'Especialista en la creación audiovisual y redacción de guiones gancheros que sostienen a la audiencia. Con rodaje en la gestión de cuentas internacionales, es el puente clave entre un render perfecto y la viralización; asegurando que el material editado convierta visualizaciones en métricas reales para el cliente.',
    imagen: '/assets/team/victoria.jpg',
    especialidades: [
      'Producción Creativa y Guiones',
      'Community Management Estratégico',
      'Edición de Video Orientada a Retención',
      'Planificación de Contenido'
    ]
  },
  {
    id: '4',
    nombre: 'Valentina Marquez',
    rol: 'Asistente de Dirección, CM y Edición',
    descripcion: 'Con un perfil orientado al consumo digital y un minor en Moda, fusiona la coordinación operativa y de escaletas en pleno rodaje o streaming con el diseño de estrategias de posicionamiento digital. Domina la redacción de copys y monitorea las métricas post-publicación para ajustar el contenido continuamente.',
    imagen: '/assets/team/valentina.jpg',
    especialidades: [
      'Asistencia de Dirección en Set',
      'Community Management y Métricas',
      'Estrategia Digital y Tendencias',
      'Edición de Formatos Verticales'
    ]
  }
];