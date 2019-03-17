import { getAccessTokenEndpoint } from "./ApiEndpoints";

export async function fetchAccessToken(appCode) {
  const response = await fetch(getAccessTokenEndpoint(appCode));
  return await response.json();
}
