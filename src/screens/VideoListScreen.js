import React from "react";
import { Text, StyleSheet, ImageBackground, View, Linking } from "react-native";
import { GBVideos } from "../models/gb/GBVideos";
import { onSnapshot } from "mobx-state-tree";
import { observer } from "mobx-react";
import FullLoader from "../components/FullLoader";
import { getAuthData } from "../utils/DataStorage";
import { getVideoEndpoint } from "../utils/ApiEndpoints";
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

  playVideo = video => {
    getAuthData().then(token => {
      this.props.navigation.navigate("Video", {
        videoUrl: getVideoEndpoint(video.hd_url, token.token),
        title: video.name
      });
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
