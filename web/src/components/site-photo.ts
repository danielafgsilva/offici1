export type SitePhoto = {
  _key?: string;
  alt?: string | null;
  /** Shown uncropped */
  whole?: boolean | null;
  ratio?: number | null;
  asset?: { _ref: string } | null;
  hotspot?: unknown;
  crop?: unknown;
};
