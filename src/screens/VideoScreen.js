import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import Video from "react-native-video";
import FullLoader from "../components/FullLoader";
import { getApiEndpoint } from "../utils/ApiEndpoints";
import { getAuthData } from "../utils/DataStorage";
import VideoPlayer from "react-native-video-controls";

export default class VideoScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Video")
    };
  };

  state = {
    isLoading: true
  };

  isIos = Platform.OS === "ios";

  componentWillUnmount() {
    this.player = null;
  }

  onLoad = () => {
    const resume = this.props.navigation.getParam("resume", false);
    const savedTime = this.props.navigation.getParam("savedTime", 0);
    console.log("this.player", this.player);
    if (!this.isIos) {
      this.player.player.ref.seek(resume ? savedTime : 0);
    } else {
      this.player.seek(resume ? savedTime : 0);
    }
    this.setState({ isLoading: false });
  };

  onProgress = event => {
    if (event.currentTime <= 0) return;

    const video = this.props.navigation.getParam("video", null);
    getAuthData().then(token => {
      let endpoint = getApiEndpoint(
        `/video/save-time/?video_id=${video.id}&time_to_save=${
          event.currentTime
        }`,
        token.token
      );
      fetch(endpoint).then(() => {
        video.updateSavedTime(event.currentTime);
      });
    });
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
            ref={ref => {
              this.player = ref;
            }}
            progressUpdateInterval={1000 * 10}
            onProgress={this.onProgress}
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
            progressUpdateInterval={1000 * 10}
            onProgress={this.onProgress}
            toggleResizeModeOnFullscreen={true}
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
    flex: 1
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
