import { createContext, useContext, useState, type ReactNode } from "react";
import {
  demoRequests,
  type Lang,
  type Pair,
  type RequestRecord,
} from "@/lib/casino-data";
type AppContext = {
  lang: Lang;
  setLang: (v: Lang) => void;
  t: (a: string | undefined, b: string | undefined) => string;
  p: (pair: Pair | undefined) => string;
  requests: RequestRecord[];
  addRequest: (r: RequestRecord) => void;
  setStatus: (ref: string, status: string) => void;
};
const Context = createContext<AppContext | undefined>(undefined);
export function CasinoProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [requests, setRequests] = useState(demoRequests);
  const t = (a: string | undefined, b: string | undefined) =>
    (lang === "en" ? a : b) || a || "";
  return (
    <Context.Provider
      value={{
        lang,
        setLang,
        t,
        p: (pair) => (pair ? t(...pair) : ""),
        requests,
        addRequest: (r) => setRequests((old) => [r, ...old]),
        setStatus: (ref, status) =>
          setRequests((old) =>
            old.map((r) => (r.ref === ref ? { ...r, status } : r)),
          ),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useCasino() {
  const value = useContext(Context);
  if (!value) throw new Error("CasinoProvider required");
  return value;
}
