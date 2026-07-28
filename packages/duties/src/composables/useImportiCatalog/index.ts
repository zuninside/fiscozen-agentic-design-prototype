/**
 * useImportiCatalog
 *
 * Read-only catalogue of the calculation sources ("fonti dei calcoli") and the
 * amounts ("importi") each one produces. In production this registry is
 * configured in the backoffice admin (source + token key + human label +
 * display format) and served via API; here it is mocked with fixtures so the
 * guide editor can consume it.
 *
 * The guide step stores ONLY the source `key`; labels and the runtime values of
 * the individual amounts always come from this catalogue / the backend.
 */

export interface ImportoDefinition {
  /** Backend token key resolved per-user at runtime */
  key: string
  /** Human-readable label configured in the admin */
  label: string
}

export interface FonteCalcoli {
  /** Source identifier stored on the guide step */
  key: string
  /** Human-readable source name shown in the editor select */
  label: string
  /** All amounts produced by this source */
  importi: ImportoDefinition[]
}

const INARCASSA: FonteCalcoli = {
  key: 'inarcassa_welfare',
  label: 'Calcoli previdenziali INARCASSA',
  importi: [
    {
      key: 'calculated_professional_income_amount',
      label: 'A1 - Reddito professionale'
    },
    {
      key: 'calculated_volume_of_business_amount_b1_1',
      label: "B1 - Volume d'affari complessivo prodotto attraverso la P.IVA individuale"
    },
    {
      key: 'calculated_volume_of_business_amount_b2_1',
      label: "B2 - Volume d'affari professionale prodotto attraverso la P.IVA individuale"
    },
    {
      key: 'calculated_volume_of_business_amount_b5_1',
      label:
        "B5 - Volume d'affari riferito a prestazioni professionali rese a soggetti in Stato UE ed extra UE"
    },
    {
      key: 'calculated_volume_of_business_amount_b6_1',
      label: "B6 - Volume d'affari professionale riferito ad attività diverse"
    }
  ]
}

const INTRASTAT: FonteCalcoli = {
  key: 'intrastat',
  label: 'Calcoli per Intrastat',
  importi: [
    {
      key: 'intrastat_intra_acquisitions_goods',
      label: 'Acquisti intracomunitari di beni'
    },
    {
      key: 'intrastat_intra_sales_goods',
      label: 'Cessioni intracomunitarie di beni'
    },
    {
      key: 'intrastat_intra_services_received',
      label: 'Servizi ricevuti da soggetti UE'
    },
    {
      key: 'intrastat_intra_services_rendered',
      label: 'Servizi resi a soggetti UE'
    }
  ]
}

const ENPAM: FonteCalcoli = {
  key: 'enpam_welfare',
  label: 'Calcoli previdenziali ENPAM',
  importi: [
    {
      key: 'calculated_income_year_2025',
      label: "Reddito per l'anno 2025"
    }
  ]
}

const ENPAPI: FonteCalcoli = {
  key: 'enpapi_welfare',
  label: 'Calcoli previdenziali ENPAPI',
  importi: [
    {
      key: 'calculated_volume_of_business_amount',
      label: "Volume d'affari"
    },
    {
      key: 'calculated_professional_income_amount',
      label: 'Reddito professionale'
    }
  ]
}

const ENPAP: FonteCalcoli = {
  key: 'enpap_welfare',
  label: 'Calcoli previdenziali ENPAP',
  importi: [
    { key: 'calculated_volume_of_business_amount', label: "Volume d'affari" },
    { key: 'calculated_professional_income_amount', label: 'Reddito professionale' }
  ]
}

const FORENSE: FonteCalcoli = {
  key: 'forense_welfare',
  label: 'Calcoli previdenziali Cassa Forense',
  importi: [
    { key: 'calculated_volume_of_business_amount', label: "Volume d'affari" },
    { key: 'calculated_professional_income_amount', label: 'Reddito professionale' }
  ]
}

/** Registry of calculation sources — mirrors the admin-configured table */
const fonti: FonteCalcoli[] = [INARCASSA, INTRASTAT, ENPAM, ENPAPI, ENPAP, FORENSE]

export function useImportiCatalog() {
  const getFonti = (): FonteCalcoli[] => fonti

  const getFonte = (key: string): FonteCalcoli | undefined =>
    fonti.find((f) => f.key === key)

  return { getFonti, getFonte }
}
