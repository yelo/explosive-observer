import React from "react";
import { Text } from "react-native";
import { GBVideos } from "../models/GBVideos";
import { onSnapshot } from "mobx-state-tree";

export default class VideoListScreen extends React.Component {
  state = {
    isLoading: true,
    videos: {}
  };

  constructor(props) {
    super(props);
    this.setupVideos(this.props.navigation.getParam('id', 0));
  }

  setupVideos = async id => {
    const videos = GBVideos.create();
    onSnapshot(videos, () => {
      this.setState({ videos });
      console.log('videosja', this.state.videos);
    });
    await videos.load(id);
    this.state.isLoading = false;
  }

  render() {
    console.log('this.state.videos', this.state.videos);
    return <Text>VideoListScreen</Text>;
  }
}
