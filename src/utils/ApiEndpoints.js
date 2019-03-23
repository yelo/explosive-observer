import { getAuthData } from "./DataStorage";

const APP_CODE_URL = "https://www.giantbomb.com/app/explosiveobserver/";
const API_KEY_ENDPOINT =
  "https://www.giantbomb.com/app/explosiveobserver/get-result";
const API_REST_ENDPOINT = "https://www.giantbomb.com/api";

export function getAccessTokenEndpoint(appCode) {
  return `${API_KEY_ENDPOINT}?regCode=${appCode}&format=JSON`;
}

export function getAppCodeUrl() {
  return APP_CODE_URL;
}

export function getApiEndpoint(target, accessToken) {
  return `${API_REST_ENDPOINT}${target}&api_key=${accessToken}&format=JSON`;
}

export function getVideoEndpoint(target, accessToken) {
  return `${target}?api_key=${accessToken}`;
}

export async function getLiveVideo() {
  const token = await getAuthData();
  const endpoint = getApiEndpoint("/video/current-live/?", token.token);
  return await fetch(endpoint).then(res => res.json()).then(live => live.video);
}