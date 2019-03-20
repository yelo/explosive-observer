import React from "react";
import { StyleSheet, View } from "react-native";
import Video from "react-native-video";
import FullLoader from "../components/FullLoader";

export default class VideoScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Video")
    };
  };

  state = {
    isLoading: false
  };

  onBuffer = evt => {
    console.log("onBuffer", evt);
  };

  videoError = err => {
    console.log("videoError", err);
  };

  onLoadStart = evt => {
    console.log("onLoadStart", evt);
    this.setState({ isLoading: true });
  };

  onLoad = evt => {
    console.log("onLoad", evt);
    this.setState({ isLoading: false });
  };

  render() {
    console.log("isLoading?", this.state.isLoading);
    return (
      <View style={styles.container}>
        {this.state.isLoading && (
          <View style={styles.spinnerHolder}>
            <FullLoader />
          </View>
        )}

        <Video
          source={{ uri: this.props.navigation.getParam("videoUrl", "n/a") }}
          ref={ref => {
            this.player = ref;
          }}
          onBuffer={this.onBuffer}
          onError={this.videoError}
          onLoadStart={this.onLoadStart}
          onLoad={this.onLoad}
          style={styles.backgroundVideo}
          fullscreen={true}
          controls={true}
          fullscreenOrientation="landscape"
        />
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
  },
  spinnerHolder: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    zIndex: 5,
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "#000"
  }
});
