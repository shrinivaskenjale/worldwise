import { useContext } from "react";
import { CitiesContext } from "../contexts/CitiesContext";

export function useCities() {
  const value = useContext(CitiesContext);
  if (value === undefined)
    throw new Error("CitiesContext is used outside CitiesProvider");

  return value;
}
