import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import GoogleCast from "react-native-google-cast";

export default class ChromeCastControl extends React.Component {
  
  componentDidMount() {
    GoogleCast.EventEmitter.addListener(
      GoogleCast.SESSION_START_FAILED,
      error => {
        console.error("errir", error);
      }
    );
  }
  render() {
    return (
      <View style={styles.chromeCast}>
        <TouchableOpacity>
          <Icon name="fast-backward" size={25} color="#FF3233" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="stop-circle" size={60} color="#FF3233" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="play-circle" size={60} color="#FF3233" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="fast-forward" size={25} color="#FF3233" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chromeCast: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 110,
    width: "100%",
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#000",
    backgroundColor: "#261B2D",
    paddingLeft: 30,
    paddingRight: 30
  }
});
