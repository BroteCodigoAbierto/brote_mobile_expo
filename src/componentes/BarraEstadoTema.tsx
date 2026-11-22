import { StatusBar } from "expo-status-bar";
import { useModoTema } from "../hooks/useColores";

export default function BarraEstadoTema() {
  const modo = useModoTema();
  return <StatusBar style={modo === "oscuro" ? "light" : "dark"} />;
}
