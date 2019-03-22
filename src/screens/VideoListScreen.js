import React from "react";
import { Alert, Linking } from "react-native";
import { GBVideos } from "../models/gb/GBVideos";
import { onSnapshot } from "mobx-state-tree";
import { observer } from "mobx-react";
import FullLoader from "../components/FullLoader";
import { getGlobalVideoQuality, setGlobalVideoQuality } from "../utils/DataStorage";
import { VideoFlatList } from "../components/videos/VideoFlatList";

class VideoListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Videos")
    };
  };

  state = {
    isLoading: true,
    videos: {}
  };

  constructor(props) {
    super(props);
    this.setupVideos(this.props.navigation.getParam("id", 0));
  }

  setupVideos = async id => {
    const videos = GBVideos.create();
    onSnapshot(videos, () => {
      this.setState({ videos });
    });
    await videos.load(id);
    this.state.isLoading = false;
  };

  setVideoQuality = (quality, video) => {
    setGlobalVideoQuality(quality).then(() => {
      this.playVideo(video);
    })
  }

  playVideo = video => {
    getGlobalVideoQuality().then(res => {
      if (!res) {
        Alert.alert(
          "Select video quality",
          "You have not selected a default video quality, please select one of the following. You can change the default video quality in the settings later if you change your mind.",
          [
            {
              text: "High",
              onPress: () => console.log("Ask me later pressed")
            },
            {
              text: "Medium",
              onPress: () => console.log("Cancel Pressed")
            },
            { text: "Low", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
      } else {
        getAuthData().then(token => {
          this.props.navigation.navigate("Video", {
            videoUrl: getVideoEndpoint(video.hd_url, token.token),
            title: video.name
          });
        });
      }
    });

  };

  launchExternalSite = url => {
    Linking.openURL(url);
  };

  render() {
    if (this.state.isLoading) {
      return <FullLoader />;
    }
    return (
      <VideoFlatList
        videos={this.state.videos}
        navigation={this.props.navigation}
        playVideo={this.playVideo}
        launchExternalSite={this.launchExternalSite}
      />
    );
  }
}

export default observer(VideoListScreen);
