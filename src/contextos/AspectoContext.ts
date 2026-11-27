import { createContext } from "react";

export type VarianteAspecto = "vidrio" | "editorial";

export type ValorAspecto = {
  variante: VarianteAspecto;
  cambiarVariante: (nueva: VarianteAspecto) => void;
};

export const AspectoContext = createContext<ValorAspecto>({
  variante: "vidrio",
  cambiarVariante: () => {},
});
