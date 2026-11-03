import { Text, type TextProps } from "react-native";
import { tipografia, type Colores, type VarianteTexto } from "../constantes/tema";
import { useColores } from "../hooks/useColores";

type Props = TextProps & {
  variante?: VarianteTexto;
  // nombre de un color del tema (por defecto, "texto")
  color?: keyof Colores;
};

// Todo texto del móvil pasa por aquí para usar Plus Jakarta Sans con los
// tamaños del sistema de diseño (docs/diseno.md, sección 2.2). En la web lo
// resuelven las variables --texto-*.
export default function Texto({ variante = "cuerpo", color = "texto", style, ...props }: Props) {
  const c = useColores();
  return <Text style={[tipografia[variante], { color: c[color] }, style]} {...props} />;
}
