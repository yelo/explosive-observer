import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default class LiveVideoItem extends React.PureComponent {
  state = {
    hide: false
  };

  componentDidMount() {
    console.log('this.props.video', this.props.video);
  }
  render() {
    if (this.state.hide) return null;
    return (
      <View style={styles.container}>
        <Text>LIVE!!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100
  }
})