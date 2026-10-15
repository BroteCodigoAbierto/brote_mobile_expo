// Tipos de la demo. Viven aquí y no dentro de los componentes para que
// cualquier pantalla que los necesite los importe en lugar de duplicarlos.
// Cuando existan las features reales, se reemplazan por los del contrato.

export type Leccion = {
  id: string;
  titulo: string;
  completada: boolean;
};

export type Curso = {
  id: string;
  titulo: string;
  descripcion: string;
  autor: string;
  icono: string; // un emoji o un caracter, para no depender de imágenes
  color: string; // color de fondo del icono
  lecciones: Leccion[];
};
