import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { CLAVES } from "../constantes/almacenamiento";
import { AspectoContext, type VarianteAspecto } from "./AspectoContext";

type Props = {
  children: ReactNode;
};

// Preferencia de aspecto visual (F16): Liquid Glass ("vidrio") es el diseño por
// defecto; "editorial" es una variante opcional de mayor contraste.
export default function AspectoProvider({ children }: Props) {
  const [variante, setVariante] = useState<VarianteAspecto>("vidrio");

  useEffect(() => {
    let activo = true;
    SecureStore.getItemAsync(CLAVES.aspecto)
      .then((guardada) => {
        if (activo && (guardada === "vidrio" || guardada === "editorial")) {
          setVariante(guardada);
        }
      })
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, []);

  const cambiarVariante = useCallback((nueva: VarianteAspecto) => {
    setVariante(nueva);
    void SecureStore.setItemAsync(CLAVES.aspecto, nueva).catch(() => {});
  }, []);

  const valor = useMemo(() => ({ variante, cambiarVariante }), [variante, cambiarVariante]);

  return <AspectoContext value={valor}>{children}</AspectoContext>;
}
