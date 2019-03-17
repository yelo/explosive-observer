const APP_CODE_URL = "https://www.giantbomb.com/app/explosiveobserver/";
const API_KEY_ENDPOINT =
  "https://www.giantbomb.com/app/explosiveobserver/get-result";
const API_REST_ENDPOINT = "https://www.giantbomb.com/api";

export function getAccessTokenEndpoint(appCode) {
  return `${API_KEY_ENDPOINT}?regCode=${appCode}&format=JSON`;
}

export function getApiEndpoint(target, accessToken) {
  `${API_REST_ENDPOINT}${target}&api_key=${accessToken}&format=JSON`;
}
