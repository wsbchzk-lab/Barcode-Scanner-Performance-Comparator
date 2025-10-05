
export enum LibraryType {
  ZXing = 'ZXing',
  QuaggaJS = 'QuaggaJS',
}

export interface ScanResult {
  text: string;
  timestamp: number;
}
