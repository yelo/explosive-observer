import React from "react";
import { StyleSheet, View } from "react-native";
import Video from "react-native-video";
import FullLoader from "../components/FullLoader";
import { getApiEndpoint } from "../utils/ApiEndpoints";
import { getAuthData, getGlobalVideoQuality } from "../utils/DataStorage";

export default class VideoScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Video")
    };
  };

  state = {
    isLoading: true
  };

  onLoad = evt => {
    const resume = this.props.navigation.getParam("resume", false);
    const savedTime = this.props.navigation.getParam("savedTime", 0);
    this.player.seek(resume ? savedTime : 0);
    this.setState({ isLoading: false });
  };

  onProgress = evt => {
    if (evt.currentTime <= 0) return;

    const video = this.props.navigation.getParam("video", null);
    getAuthData().then(token => {
      let endpoint = getApiEndpoint(
        `/video/save-time/?video_id=${video.id}&time_to_save=${
          evt.currentTime
        }`,
        token.token
      );
      fetch(endpoint).then(res => {
        video.updateSavedTime(evt.currentTime);
      });
    });
  };

  componentWillUnmount() {
    this.player = null;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading && (
          <View style={styles.spinnerHolder}>
            <FullLoader />
          </View>
        )}
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
        />
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
    flex: 1,
    backgroundColor: "#000"
  }
});
