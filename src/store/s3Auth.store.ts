import { ES3FolderKeys } from "../enums";
import { create } from "zustand";

export interface IS3AuthData {
  folder?: ES3FolderKeys;
  url: string;
  base_url: string;
  token: string;
  prefix: string;
  expires_in: number;
  fetchedAt?: number;
}

export interface IS3AuthStore {
  s3AuthDocumentation: IS3AuthData[];
  fetchedAt: number | null;
  setS3AuthDocumentation: (s3Auth: IS3AuthData[]) => void;
}

export const useS3AuthStore = create<IS3AuthStore>((set) => ({
  s3AuthDocumentation: [],
  fetchedAt: null,
  setS3AuthDocumentation: (s3Auth: IS3AuthData[]) => set({ s3AuthDocumentation: s3Auth, fetchedAt: Date.now() }),
}));
