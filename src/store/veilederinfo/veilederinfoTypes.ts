export interface Veilederinfo {
  navn: string;
  ident: string;
}

export interface VeilederinfoState {
  readonly hentet: boolean;
  readonly henter: boolean;
  readonly hentingFeilet: boolean;
  readonly data: Veilederinfo;
}
