import { CloudOff, RotateCw } from "lucide-react-native";
import Boton from "./Boton";
import EstadoVacio from "./EstadoVacio";

type Props = {
  mensaje: string;
  alReintentar: () => void;
};

// No se pudieron traer los datos de una pantalla (o los 10 siguientes).
export default function ErrorCarga({ mensaje, alReintentar }: Props) {
  return (
    <EstadoVacio
      icono={CloudOff}
      tono="error"
      titulo={mensaje}
      anunciar
      accion={
        <Boton
          titulo="Reintentar"
          variante="secundario"
          icono={RotateCw}
          alPresionar={alReintentar}
        />
      }
    />
  );
}
