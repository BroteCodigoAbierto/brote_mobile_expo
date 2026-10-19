import { Curso } from "../tipos/tipos";

// Datos de ejemplo escritos a mano

export const usuarioDemo = {
  nombre: "Pedro",
  correo: "pedro@ejemplo.com",
};

export const cursos: Curso[] = [
  {
    id: "git-esencial",
    titulo: "Git esencial",
    descripcion:
      "Aprende Git desde cero: commits, ramas y remotos, con una terminal simulada y grafos de commits interactivos.",
    autor: "pedro",
    lecciones: [
      { id: "01", titulo: "¿Qué es el control de versiones?", completada: true },
      { id: "02", titulo: "Tu primer commit", completada: true },
      { id: "03", titulo: "Viajar en el tiempo: historial y diffs", completada: false },
      { id: "04", titulo: "Ramas: trabajar en paralelo", completada: false },
      { id: "05", titulo: "Remotos: compartir tu trabajo", completada: false },
      { id: "06", titulo: "Resolviendo conflictos", completada: false },
    ],
  },
  {
    id: "japones-sencillo",
    titulo: "Japonés sencillo",
    descripcion: "Hiragana, saludos y números para dar tus primeros pasos en japonés.",
    autor: "pedro",
    lecciones: [
      { id: "01", titulo: "Hiragana: las vocales", completada: true },
      { id: "02", titulo: "Saludos", completada: false },
      { id: "03", titulo: "Números del 1 al 5", completada: false },
      { id: "04", titulo: "Preséntate", completada: false },
    ],
  },
  {
    id: "c-sencillo",
    titulo: "Programación en C sencilla",
    descripcion: "Variables, condicionales, funciones, arreglos y punteros.",
    autor: "pedro",
    lecciones: [
      { id: "01", titulo: "Primeros pasos", completada: false },
      { id: "02", titulo: "Condicionales y operadores", completada: false },
      { id: "03", titulo: "Funciones", completada: false },
      { id: "04", titulo: "Arrays y punteros", completada: false },
    ],
  },
  {
    id: "flexbox",
    titulo: "HTML y Flexbox",
    descripcion: "Formularios, semántica, box model y todo lo necesario para dominar Flexbox.",
    autor: "pedro",
    lecciones: [
      { id: "01", titulo: "Formularios: label e input", completada: false },
      { id: "02", titulo: "Box model: padding, gap y margin", completada: false },
      { id: "03", titulo: "¿Qué es Flexbox?", completada: false },
      { id: "04", titulo: "justify-content: el eje principal", completada: false },
      { id: "05", titulo: "align-items: el eje cruzado", completada: false },
    ],
  },
];

// Cuántas lecciones lleva hechas el usuario en un curso (de 0 a 1).
// Se calcula cada vez a partir de las lecciones en lugar de guardarlo
// aparte, para no tener dos datos que digan lo mismo.
export function progresoDe(curso: Curso) {
  const hechas = curso.lecciones.filter((l) => l.completada).length;
  return hechas / curso.lecciones.length;
}

export function buscarCurso(id: string) {
  return cursos.find((c) => c.id === id);
}
