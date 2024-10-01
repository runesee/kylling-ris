import { useEffect } from "react";

export default function useOnKeyDown(
  f: () => void,
  keyCodes: string[],
  dependencies: React.DependencyList = []
): void {
  useEffect(() => {
    const handler = ({ code }: KeyboardEvent) => {
      if (keyCodes.includes(code)) {
        f();
      }
    };

    window.addEventListener("keydown", handler);

    // So that the event listener is only there when the component is rendered.
    return () => {
      window.removeEventListener("keydown", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
