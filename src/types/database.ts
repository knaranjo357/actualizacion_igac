export interface DatabaseRecord {
  [key: string]: string | number;
}

export interface DatabaseResponse {
  data: DatabaseRecord[];
}

// Mapping of database names to their matricula column names
export const MATRICULA_COLUMNS = {
  reconocedores: 'Matricula CICA',
  vurGeneral: 'Matricula',
  vurPropietarios: 'Matricula',
  vurSalvedades: 'Matricula',
  vurAnotaciones: 'Matricula',
  vurTramites: 'Matricula',
  r1: 'MATRICULA_INMOBILIARIA',
  r2: 'MATRICULA_INMOBILIARIA',
  cica: 'Matricula'
} as const;

// Helper function to normalize matricula values
export const normalizeMatricula = (matricula: string): string => {
  if (!matricula) return '';
  // Remove '320-' prefix if it exists and trim whitespace
  return matricula.replace(/^320-/, '').trim();
};

// Helper function to find matching R2 reco///rd for R1
export const findMatchingR2Record = (
  r1Record: DatabaseRecord,
  r2Data: DatabaseRecord[]
): DatabaseRecord | undefined => {
  return r2Data.find(r2Record => 
    r2Record.NUMERO_PREDIAL === r1Record.NUMERO_PREDIAL
  );
};

// const BASE_URL = 'https://alejandronaranjo357.app.n8n.cloud/webhook';
const BASE_URL = 'https://mariagomez1.app.n8n.cloud/webhook';
export const ENDPOINTS = {
  reconocedores: `${BASE_URL}/reconocedores`,
  vurGeneral: `${BASE_URL}/vur-general`,
  vurPropietarios: `${BASE_URL}/vur-propietarios`,
  vurSalvedades: `${BASE_URL}/vur-salvedades`,
  vurAnotaciones: `${BASE_URL}/vur-anotaciones`,
  vurTramites: `${BASE_URL}/vur-tramites`,
  r1: `${BASE_URL}/r1`,
  r2: `${BASE_URL}/r2`,
  cica: `${BASE_URL}/cica`
} as const;