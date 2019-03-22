import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

export default class FullLoader extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#FD4142" size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#261B2D"
  }
});
