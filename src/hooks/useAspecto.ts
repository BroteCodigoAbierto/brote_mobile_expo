import { useContext } from "react";
import { AspectoContext } from "../contextos/AspectoContext";

export function useAspecto() {
  return useContext(AspectoContext);
}
