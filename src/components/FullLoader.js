import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

export default class FullLoader extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
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
