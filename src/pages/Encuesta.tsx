import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "../App.css"
import axios from "axios";
import { getCountries } from "../utils/paises";
import { AR_PROVINCES, type ARProvinceCode } from "../utils/provincias-ar";
import logoMob from "../assets/Logo Mendoza Oliva Bien.png"

const translations = {
  es: {
    title: "Encuesta Oleoturismo - Octubre",
    lbl_pais: "País de residencia:",
    lbl_estadia: "Duración de estadía en Mendoza:",
    ph_estadia: "Ej: 3 noches, solo por el día",
    lbl_motivo: "Motivo principal de la visita:",
    lbl_primera: "¿Es su primera vez en esta almazara?",
    lbl_origen: "¿Cómo se enteró de esta experiencia?",
    lbl_actividades: "Actividades realizadas:",
    ph_actividades: "Ej: Visita guiada, degustación",
    lbl_compra: "¿Compró o comprará productos hoy aquí?",
    lbl_gasto: "Gasto estimado (grupo):",
    lbl_nps: "¿Volvería o recomendaría esta experiencia? (0-10)",
    lbl_cantidad_grupo: "¿Cuántas personas componen el grupo?",
    lbl_edad: "Edad:",
    lbl_provincia: "Provincia:",
    lbl_grupo: "Grupo:",
    btn_save: "Guardar encuesta",
    opts: {
      select: "Seleccione...",
      motivo: {
        turismo: "Turismo/ocio",
        excursion: "Excursión organizada",
        trabajo: "Trabajo/negocios",
        educativo: "Visita educativa",
        producto: "Adquirir productos",
        congreso: "Congreso/evento",
        otro: "Otro"
      },
      si: "Sí",
      no: "No",
      origen: {
        redes: "Redes sociales",
        web: "Web del establecimiento",
        recomendacion: "Recomendación",
        hotel: "Hotel/agencia",
        ruta: "Señalización en ruta",
        otro: "Otro"
      },
      gasto: {
        lt10k: "<$10.000",
        "10k_25k": "$10.000-$25.000",
        "25k_50k": "$25.000-$50.000",
        gt50k: ">$50.000"
      },
      edad: {
        "16-24": "16-24",
        "25-34": "25-34",
        "35-44": "35-44",
        "45-54": "45-54",
        "55-64": "55-64",
        "65+": "65+"
      },
      grupo: {
        solo: "Solo/a",
        pareja: "En pareja",
        grupo: "Grupo de amigos/trabajo",
        familia_menores: "En familia (con menores de edad)"
      }
    },
  },
  en: {
    title: "Olive Tourism Survey - October",
    lbl_pais: "Country of residence:",
    lbl_estadia: "Length of stay in Mendoza:",
    ph_estadia: "E.g.: 3 nights, day trip only",
    lbl_motivo: "Main reason for visit:",
    lbl_primera: "First time at this olive mill?",
    lbl_origen: "How did you hear about this experience?",
    lbl_actividades: "Activities performed:",
    ph_actividades: "E.g.: Guided tour, tasting",
    lbl_compra: "Did you buy or will you buy products here today?",
    lbl_gasto: "Estimated group spending:",
    lbl_nps: "Would you return or recommend this experience? (0-10)",
    lbl_cantidad_grupo: "How many people are in the group?",
    lbl_edad: "Age:",
    lbl_provincia: "Province:",
    lbl_grupo: "Group:",
    btn_save: "Submit",
    opts: {
      select: "Select…",
      motivo: {
        turismo: "Tourism/leisure",
        excursion: "Organized excursion",
        trabajo: "Work/business",
        educativo: "Educational visit",
        producto: "Buy products",
        congreso: "Congress/event",
        otro: "Other"
      },
      si: "Yes",
      no: "No",
      origen: {
        redes: "Social networks",
        web: "Official website",
        recomendacion: "Recommendation",
        hotel: "Hotel/agency",
        ruta: "Route signage",
        otro: "Other"
      },
      gasto: {
        lt10k: "<$10,000",
        "10k_25k": "$10,000-$25,000",
        "25k_50k": "$25,000-$50,000",
        gt50k: ">$50,000"
      },
      edad: {
        "16-24": "16-24",
        "25-34": "25-34",
        "35-44": "35-44",
        "45-54": "45-54",
        "55-64": "55-64",
        "65+": "65+"
      },
      grupo: {
        solo: "Solo",
        pareja: "Couple",
        grupo: "Friends/Work group",
        familia_menores: "Family (with minors)"
      }
    }
  },
  pt: {
    title: "Pesquisa de Oleoturismo - Outubro",
    lbl_pais: "País de residência:",
    lbl_estadia: "Duração da estadia em Mendoza:",
    ph_estadia: "Ex.: 3 noites, apenas por um dia",
    lbl_motivo: "Principal motivo da visita:",
    lbl_primera: "Primeira vez neste lagar?",
    lbl_origen: "Como soube desta experiência?",
    lbl_actividades: "Atividades realizadas:",
    ph_actividades: "Ex.: Visita guiada, degustação",
    lbl_compra: "Comprou ou vai comprar produtos aqui hoje?",
    lbl_gasto: "Gasto estimado (grupo):",
    lbl_nps: "Voltaria ou recomendaria esta experiência? (0-10)",
    lbl_cantidad_grupo: "Quantas pessoas há no grupo?",
    lbl_edad: "Idade:",
    lbl_grupo: "Grupo:",
    btn_save: "Enviar",
    lbl_provincia: "Estado/Província:",
    opts: {
      select: "Selecione…",
      motivo: {
        turismo: "Turismo/lazer",
        excursion: "Excursão organizada",
        trabajo: "Trabalho/negócios",
        educativo: "Visita educativa",
        producto: "Adquirir produtos",
        congreso: "Congresso/evento",
        otro: "Outro"
      },
      si: "Sim",
      no: "Não",
      origen: {
        redes: "Redes sociais",
        web: "Site do estabelecimento",
        recomendacion: "Recomendação",
        hotel: "Hotel/agência",
        ruta: "Sinalização de rota",
        otro: "Outro"
      },
      gasto: {
        lt10k: "<$10.000",
        "10k_25k": "$10.000-$25.000",
        "25k_50k": "$25.000-$50.000",
        gt50k: ">$50.000"
      },
      edad: {
        "16-24": "16-24",
        "25-34": "25-34",
        "35-44": "35-44",
        "45-54": "45-54",
        "55-64": "55-64",
        "65+": "65+"
      },
      grupo: {
        solo: "Sozinho/a",
        pareja: "Em casal",
        grupo: "Grupo de amigos/trabalho",
        familia_menores: "Em família (com menores)"
      }
    }
  }
} as const;

const normalizeAlmazara = (slug?: string) =>
  (slug ? decodeURIComponent(slug).replace(/-/g, " ").trim() : "");

const emptyToUndef = <T,>(schema: z.ZodType<T>) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema);

const schema = z.object({
  pais: z.string().length(2, "Seleccioná un país"),
  provincia: z.string().optional(),
  estadia: z.string().optional().default(""),
  motivo: emptyToUndef(z.enum(["turismo", "excursion", "trabajo", "educativo", "producto", "congreso", "otro"]).optional()),
  primera: emptyToUndef(z.enum(["si", "no"]).optional()),
  origen: emptyToUndef(z.enum(["redes", "web", "recomendacion", "hotel", "ruta", "otro"]).optional()),
  actividades: z.string().optional().default(""),
  compra: emptyToUndef(z.enum(["si", "no"]).optional()),
  gasto: emptyToUndef(z.enum(["lt10k", "10k_25k", "25k_50k", "gt50k"]).optional()),
  nps: z.coerce.number().min(0, "Mínimo 0").max(10, "Máximo 10"),
  cantidad_grupo: z.coerce.number().min(0, "Mínimo 0").max(50, "Máximo 50"),
  edad: emptyToUndef(z.enum(["16-24", "25-34", "35-44", "45-54", "55-64", "65+"]).optional()),
  grupo: emptyToUndef(
    z.enum(["solo", "pareja", "grupo", "familia_menores"]).optional()
  )
}).superRefine((data, ctx) => {
  if (data.pais === "AR" && !data.provincia) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["provincia"],
      message: "Seleccioná una provincia",
    });
  }
  // (opcional) validar que el código sea válido si viene
  if (data.provincia && data.pais === "AR") {
    const valid = [
      "AR-C", "AR-B", "AR-K", "AR-H", "AR-U", "AR-X", "AR-W", "AR-E", "AR-P", "AR-Y",
      "AR-L", "AR-F", "AR-M", "AR-N", "AR-Q", "AR-R", "AR-A", "AR-J", "AR-D", "AR-Z",
      "AR-S", "AR-G", "AR-V", "AR-T"
    ].includes(data.provincia as ARProvinceCode);
    if (!valid) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["provincia"], message: "Provincia inválida" });
    }
  }
});


export default function Encuesta() {
  const { almazara } = useParams();
  const establecimiento = useMemo(() => normalizeAlmazara(almazara), [almazara]);
  const apiUrl = import.meta.env.VITE_API_URL
  const [lang, setLang] = useState<keyof typeof translations>("es");
  const countryOptions = useMemo(() => getCountries(lang), [lang]);

  const t = translations[lang];

  const { register, handleSubmit, watch, setValue, clearErrors, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { compra: "" as any }
  });

  const paisSel = watch("pais")
  const provinciaSel = watch("provincia");

  useEffect(() => {
    if (provinciaSel === "AR-M") {
      setValue("estadia", "");
      setValue("motivo", "");
      clearErrors(["estadia", "motivo"]);
    }
  }, [provinciaSel, setValue, clearErrors]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const payload = {
        establecimiento,
        pais_residencia: values.pais,
        provincia: values.pais === "AR" ? values.provincia ?? "" : "",
        duracion_estadia: values.estadia ?? "",
        motivo_visita: values.motivo ?? "",
        primera_vez_almazara: values.primera ?? "",
        como_conocio_experiencia: values.origen ?? "",
        actividades_realizadas: values.actividades ?? "",
        compra_productos: values.compra ?? "",
        gasto_estimado: values.gasto ?? "",
        puntaje_experiencia: values.nps,
        cantidad_grupo: values.cantidad_grupo,
        edad: values.edad ?? "",
        grupo_compania: values.grupo ?? ""
      };

      const { status } = await axios.post(
        `/oleoturismo/encuesta/${apiUrl}`,
        payload,
        { timeout: 15000 }
      );

      if (status < 200 || status >= 300) throw new Error("Error enviando encuesta");

      reset();
      alert(
        lang === "es" ? "¡Gracias! Encuesta enviada."
          : lang === "en" ? "Thanks! Survey submitted."
            : "Obrigado! Pesquisa enviada."
      );
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.detail || err.response?.data?.message || err.message
        : "Error enviando encuesta";
      alert(msg);
    }
  };

  return (
    <main className="container survey-shell">
      <div className="survey-header">
        <img className="survey-logo" src={logoMob} alt="Mendoza Oliva Bien" />
        <h2>{t.title}</h2>
        <div className="lang-buttons">
          <button type="button" onClick={() => setLang("es")}>🇪🇸 Español</button>
          <button type="button" onClick={() => setLang("en")}>🇬🇧 English</button>
          <button type="button" onClick={() => setLang("pt")}>🇧🇷 Português</button>
        </div>
      </div>

      {/* Si querés mostrar el establecimiento (solo lectura), descomentá:
      {establecimiento && (
        <label>
          Establecimiento:
          <input value={establecimiento} readOnly />
        </label>
      )} */}

      <div className="survey-card">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label>
            {t.lbl_pais}
            <select {...register("pais")} defaultValue="">
              <option value="">{t.opts.select}</option>
              {countryOptions.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
            {errors.pais && <small className="error">{String(errors.pais.message)}</small>}
          </label>

          {paisSel === "AR" && (
            <label>
              {t.lbl_provincia}
              <select {...register("provincia")} defaultValue="">
                <option value="">{t.opts.select}</option>
                {AR_PROVINCES.map(p => (
                  <option key={p.code} value={p.code}>{p.name}</option>
                ))}
              </select>
              {errors.provincia && <small className="error">{String(errors.provincia.message)}</small>}
            </label>
          )}

          {provinciaSel !== "AR-M" && (
            <label>
              {t.lbl_estadia}
              <input {...register("estadia")} type="text" placeholder={t.ph_estadia} />
            </label>
          )}

          {provinciaSel !== "AR-M" && (
            <label>
              {t.lbl_motivo}
              <select {...register("motivo")} defaultValue="">
                <option value="">{t.opts.select}</option>
                <option value="turismo">{t.opts.motivo.turismo}</option>
                <option value="excursion">{t.opts.motivo.excursion}</option>
                <option value="trabajo">{t.opts.motivo.trabajo}</option>
                <option value="educativo">{t.opts.motivo.educativo}</option>
                <option value="producto">{t.opts.motivo.producto}</option>
                <option value="congreso">{t.opts.motivo.congreso}</option>
                <option value="otro">{t.opts.motivo.otro}</option>
              </select>
            </label>
          )}

          <label>
            {t.lbl_primera}
            <select {...register("primera")} defaultValue="">
              <option value="">{t.opts.select}</option>
              <option value="si">{t.opts.si}</option>
              <option value="no">{t.opts.no}</option>
            </select>
          </label>

          <label>
            {t.lbl_origen}
            <select {...register("origen")} defaultValue="">
              <option value="">{t.opts.select}</option>
              <option value="redes">{t.opts.origen.redes}</option>
              <option value="web">{t.opts.origen.web}</option>
              <option value="recomendacion">{t.opts.origen.recomendacion}</option>
              <option value="hotel">{t.opts.origen.hotel}</option>
              <option value="ruta">{t.opts.origen.ruta}</option>
              <option value="otro">{t.opts.origen.otro}</option>
            </select>
          </label>

          <label>
            {t.lbl_actividades}
            <input {...register("actividades")} type="text" placeholder={t.ph_actividades} />
          </label>

          <label>
            {t.lbl_compra}
            <select {...register("compra")} defaultValue="">
              <option value="">{t.opts.select}</option>
              <option value="si">{t.opts.si}</option>
              <option value="no">{t.opts.no}</option>
            </select>
          </label>

          <label>
            {t.lbl_gasto}
            <select {...register("gasto")} defaultValue="">
              <option value="">{t.opts.select}</option>
              <option value="lt10k">{t.opts.gasto.lt10k}</option>
              <option value="10k_25k">{t.opts.gasto["10k_25k"]}</option>
              <option value="25k_50k">{t.opts.gasto["25k_50k"]}</option>
              <option value="gt50k">{t.opts.gasto.gt50k}</option>
            </select>
          </label>

          <label>
            {t.lbl_nps}
            <input {...register("nps", { valueAsNumber: true })} type="number" min={0} max={10} />
            {errors.nps && <small className="error">{String(errors.nps.message)}</small>}
          </label>

          <label>
            {t.lbl_cantidad_grupo}
            <input {...register("cantidad_grupo", { valueAsNumber: true })} type="number" min={0} max={10} />
            {errors.nps && <small className="error">{String(errors.nps.message)}</small>}
          </label>

          <label>
            {t.lbl_edad}
            <select {...register("edad")} defaultValue="">
              <option value="">{t.opts.select}</option>
              <option value="16-24">{t.opts.edad["16-24"]}</option>
              <option value="25-34">{t.opts.edad["25-34"]}</option>
              <option value="35-44">{t.opts.edad["35-44"]}</option>
              <option value="45-54">{t.opts.edad["45-54"]}</option>
              <option value="55-64">{t.opts.edad["55-64"]}</option>
              <option value="65+">{t.opts.edad["65+"]}</option>
            </select>
          </label>

          <label>
            {t.lbl_grupo}
            <select {...register("grupo")} defaultValue="">
              <option value="">{t.opts.select}</option>
              <option value="solo">{t.opts.grupo.solo}</option>
              <option value="pareja">{t.opts.grupo.pareja}</option>
              <option value="grupo">{t.opts.grupo.grupo}</option>
              <option value="familia_menores">{t.opts.grupo.familia_menores}</option>
            </select>
          </label>

          <div className="btn-pos lang-buttons">
            <button id="btn_save" type="submit" aria-busy={isSubmitting}>
              {t.btn_save}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
