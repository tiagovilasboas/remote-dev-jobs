export enum GreenhouseCompanyBR {
  Nubank = "nubank",
  QuintoAndar = "quintoandar",
  Gympass = "gympass",
  C6Bank = "c6bank",
}

export const GREENHOUSE_BR_COMPANIES: string[] =
  Object.values(GreenhouseCompanyBR);

export enum LeverCompanyBR {
}

export const LEVER_BR_COMPANIES: string[] = Object.values(LeverCompanyBR);

export enum WorkableCompanyBR {
}

export const WORKABLE_BR_COMPANIES: string[] = Object.values(WorkableCompanyBR);

export enum GupyCompanyBR {
  BancoInter = "bancointer",
  Boticario = "grupoboticario",
  Totvs = "totvs",
  Localiza = "localiza",
}

export const GUPY_BR_COMPANIES: string[] = Object.values(GupyCompanyBR);

export const getEnumKeyByEnumValue = <T extends { [index: string]: string }>(
  myEnum: T,
  enumValue: string,
): keyof T | undefined => {
  return Object.keys(myEnum).find((x) => myEnum[x] === enumValue);
};
