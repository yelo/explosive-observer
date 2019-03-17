import { AsyncStorage } from "react-native"; // TODO: Update to @react-native-community/async-storage

const AUTH_DATA_KEY = "@AUTH_DATA";

export async function setAuthData(authData) {
  return await set(AUTH_DATA_KEY, authData);
}

export async function getAuthData() {
  return await get(AUTH_DATA_KEY);
}

async function set(key, value) {
  return await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function get(key) {
  return await AsyncStorage.getItem(key).then(data => JSON.parse(data));
}
