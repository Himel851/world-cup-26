import { API_FOOTBALL_KEY } from "@/config/global-variables";
import axios, { type AxiosError } from "axios";


/** Official API-Football base URL — https://www.api-football.com/documentation-v3 */
export const API_FOOTBALL_BASE_URL = "https://v3.football.api-sports.io";

export const apiFootballClient = axios.create({
  baseURL: API_FOOTBALL_BASE_URL,
  headers: {
    "x-apisports-key": API_FOOTBALL_KEY.trim(),
  },
  timeout: 15_000,
});

export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}
