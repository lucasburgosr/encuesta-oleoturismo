// src/lib/countries.ts
import countries from "i18n-iso-countries";
import es from "i18n-iso-countries/langs/es.json";
import en from "i18n-iso-countries/langs/en.json";
import pt from "i18n-iso-countries/langs/pt.json";

countries.registerLocale(es);
countries.registerLocale(en);
countries.registerLocale(pt);

export type Lang = "es" | "en" | "pt";

export function getCountries(lang: Lang) {
  const map = countries.getNames(lang, { select: "official" }) as Record<string,string>;
  // map: { "AR": "Argentina", "BR": "Brasil", ... }
  return Object.entries(map)
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name, lang));
}
