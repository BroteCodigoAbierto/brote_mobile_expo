import { useRef, useState } from "react";
import { leerErrorDeEnvio } from "../servicios/sesion";

type OpcionesFormulario<C extends string> = {
  inicial: Record<C, string>;
  validar: (valores: Record<C, string>) => Partial<Record<C, string>>;
  // si lanza, el error se muestra en el formulario y lo capturado se conserva
  enviar: (valores: Record<C, string>) => Promise<void>;
};

// Estado de un formulario según la spec F01: los errores de campo aparecen al
// enviar y se quitan al editar ese campo; mientras se envía no se puede enviar
// otra vez; si falla, nada de lo escrito se pierde.
export function useFormulario<C extends string>({
  inicial,
  validar,
  enviar,
}: OpcionesFormulario<C>) {
  const [valores, setValores] = useState(inicial);
  const [errores, setErrores] = useState<Partial<Record<C, string>>>({});
  const [general, setGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  // el estado tarda un render en verse; con la ref dos toques seguidos no pasan
  const enviandoAhora = useRef(false);

  function cambiar(campo: C, valor: string) {
    setValores((actuales) => ({ ...actuales, [campo]: valor }));
    setErrores((actuales) => {
      if (!actuales[campo]) return actuales;
      const resto = { ...actuales };
      delete resto[campo];
      return resto;
    });
  }

  async function manejarEnvio() {
    if (enviandoAhora.current) return;

    const encontrados = validar(valores);
    setErrores(encontrados);
    setGeneral(null);
    if (Object.keys(encontrados).length > 0) return;

    enviandoAhora.current = true;
    setEnviando(true);
    try {
      await enviar(valores);
    } catch (error) {
      const leido = leerErrorDeEnvio(error);
      setErrores((leido.campos ?? {}) as Partial<Record<C, string>>);
      setGeneral(leido.general ?? null);
    } finally {
      enviandoAhora.current = false;
      setEnviando(false);
    }
  }

  return { valores, errores, general, enviando, cambiar, manejarEnvio };
}
