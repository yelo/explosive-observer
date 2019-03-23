import { AsyncStorage } from "react-native"; // TODO: Update to @react-native-community/async-storage

const AUTH_DATA_KEY = "@AUTH_DATA";
const GLOBAL_VIDEO_QUALITY = "@GLOBAL_VIDEO_QUALITY";
const DOWNLOAD_OVER_MOBILE = "@DOWNLOAD_OVER_MOBILE";
const FAVORITE_SHOWS = "@FAVORITE_SHOWS";
const FORCE_LOW_ON_MOBILE = "@FORCE_LOW_ON_MOBILE";

export async function setAuthData(authData) {
  return await set(AUTH_DATA_KEY, authData);
}

export async function getAuthData() {
  return await get(AUTH_DATA_KEY);
}

export async function getGlobalVideoQuality() {
  return await get(GLOBAL_VIDEO_QUALITY);
}

export async function clearAuthData() {
  return await clear(AUTH_DATA_KEY);
}

export async function getForceLowOnMobile() {
  return get(FORCE_LOW_ON_MOBILE);
}

export async function setForceLowOnMobile(force) {
  return await set(FORCE_LOW_ON_MOBILE, force);
}

export async function setGlobalVideoQuality(quality) {
  return await set(GLOBAL_VIDEO_QUALITY, quality);
}

export async function getDownloadOverMobile() {
  return await get(DOWNLOAD_OVER_MOBILE);
}

export async function setDownloadOverMobile(enabled) {
  return await set(DOWNLOAD_OVER_MOBILE, enabled);
}

export async function getFavoriteShows() {
  return await get(FAVORITE_SHOWS);
}

export async function addShowToFavorites(id) {
  return await add(FAVORITE_SHOWS, id);
}

export async function removeShowFromFavorites(id) {
  return await remove(FAVORITE_SHOWS, id);
}

async function add(key, value) {
  await get(key).then(list => {
    let tempList = list || [];
    if (!tempList.find(i => i === value)) {
      tempList.push(value);
      set(key, tempList);
    }
  });
}

async function remove(key, value) {
  await get(key).then(list => {
    let tempList = list || [];
    let index = tempList.indexOf(value);
    if (index >= 0) tempList.splice(index, 1);
    set(key, tempList);
  });
}

async function set(key, value) {
  return await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function get(key) {
  return await AsyncStorage.getItem(key).then(data => JSON.parse(data));
}

async function clear(key) {
  return await AsyncStorage.removeItem(key);
}
