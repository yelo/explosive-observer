import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import Video from "react-native-video";
import FullLoader from "../components/FullLoader";
import VideoPlayer from "react-native-video-controls";

export default class LiveVideoScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Video")
    };
  };

  state = {
    isLoading: true
  };

  isIos = Platform.OS === "ios";

  componentDidMount() {
      console.log("is ios?", this.isIos)
  }

  componentWillUnmount() {
    this.player = null;
  }

  onLoad = () => {
    this.setState({ isLoading: false });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading && (
          <View style={styles.spinnerHolder}>
            <FullLoader />
          </View>
        )}
        {this.isIos && (
          <Video
            source={{ uri: this.props.navigation.getParam("url", null) }}
            onLoad={this.onLoad}
            style={styles.backgroundVideo}
            controls={true}
            ignoreSilentSwitch={"ignore"}
          />
        )}
        {!this.isIos && (
          <VideoPlayer
          ref={ref => {
            this.player = ref;
          }}
            source={{ uri: this.props.navigation.getParam("url", null) }}
            onBack={this.props.navigation.goBack}
            onLoad={this.onLoad}
            showOnStart={false}
            toggleResizeModeOnFullscreen={false}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
    backgroundColor: "#000"
  },
  spinnerHolder: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    zIndex: 5
  },
  backgroundVideo: {
    height: "100%",
    width: "100%",
    flex: 1
  }
});
