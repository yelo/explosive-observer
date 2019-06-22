import React from "react";
import { View, StyleSheet } from "react-native";
import NonShowItem from "./shows/NonShowItem";

export default class LiveVideoItem extends React.PureComponent {
  state = {
    hide: false,
    video: {
      title: this.props.video.title,
      icon: "video-camera",
      color: "#FD4142",
      action: () => this.launchLiveVideo()
    }
  };

  componentDidMount() {
    console.log("this.props.video", this.props.video);
    console.log('this.state.video', this.state.video);
  }

  launchLiveVideo = () => {
    console.log('launch', this.state.video);
    this.props.navigation.navigate("LiveVideo", {
      url: this.props.video.stream,
      title: this.props.video.title,
    });
  }

  render() {
    if (this.state.hide) return null;
    return (
      <View style={styles.container}>
        <NonShowItem item={this.state.video} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});
