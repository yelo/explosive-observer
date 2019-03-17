import React from "react";
import { StatusBar, ActivityIndicator, View, StyleSheet } from "react-native";
import { getAuthData } from "../utils/DataStorage";

export default class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrap();
  }

  _bootstrap = async () => {
    const authData = await getAuthData();
    this.props.navigation.navigate(
      authData && Number(authData.expiration) > Date.now() / 1000
        ? "App"
        : "Auth"
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
