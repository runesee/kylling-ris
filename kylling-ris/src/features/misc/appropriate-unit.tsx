// g to kg and ml to L conversion for display.
export default function appropriateUnit(x: number, standardUnit: string) {
  if (x > 999 && standardUnit === "g") {
    return `${Math.round((x / 1000) * 100) / 100}kg`;
  }
  if (x > 999 && standardUnit === "ml") {
    return `${Math.round((x / 1000) * 100) / 100}l`;
  }
  return `${Math.round(x * 100) / 100}${standardUnit}`;
}
