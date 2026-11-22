import { useEffect, useReducer, useRef, type ReactNode } from "react";
import { temaInicial, type PreferenciaTema } from "../constantes/temas";
import { guardarTema, leerTema } from "../servicios/almacenTema";
import { reducirTema, TemaContext } from "./TemaContext";

type PropsTemaProvider = { children: ReactNode };
export default function TemaProvider({ children }: PropsTemaProvider) {
  const [estado, dispatch] = useReducer(reducirTema, { preferencia: temaInicial, estado: "listo" });
  const [listo, terminarCarga] = useReducer(() => true, false);
  const guardando = useRef(false);
  useEffect(() => {
    let vigente = true;
    void leerTema().then((preferencia) => {
      if (!vigente) return;
      dispatch({ preferencia });
      terminarCarga();
    });
    return () => {
      vigente = false;
    };
  }, []);

  async function cambiar(preferencia: PreferenciaTema) {
    if (guardando.current) return;
    guardando.current = true;
    dispatch({ preferencia, estado: "guardando" });
    try {
      await guardarTema(preferencia);
      dispatch({ estado: "guardado" });
    } catch {
      dispatch({ estado: "error" });
    } finally {
      guardando.current = false;
    }
  }
  if (!listo) return null;
  return <TemaContext value={{ ...estado, cambiar }}>{children}</TemaContext>;
}
