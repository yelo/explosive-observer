import React from "react";
import { StyleSheet, View, Linking, Alert, NetInfo } from "react-native";
import { observer } from "mobx-react";
import { FlatList } from "react-native-gesture-handler";
import VideoItem from "./VideoItem";
import {
  getGlobalVideoQuality,
  getAuthData,
  setGlobalVideoQuality,
  getForceLowOnMobile,
} from "../../utils/DataStorage";
import { getVideoEndpoint } from "../../utils/ApiEndpoints";
import GoogleCast from "react-native-google-cast";


class VideoFlatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false
    };
  }

  onRefresh = () => {
    console.log("refreshing");
  };

  launchExternalSite = url => {
    Linking.openURL(url);
  };

  setVideoQuality = (quality, video) => {
    setGlobalVideoQuality(quality).then(() => {
      this.playVideo(video);
    });
  };

  renderVideoItem = video => {
    return (
      <VideoItem
        video={video}
        playVideo={this.playVideo}
        launchExternalSite={this.launchExternalSite}
      />
    );
  };

  playVideo = video => {
    getGlobalVideoQuality().then(res => {
      if (!res) {
        Alert.alert(
          "Select video quality",
          "You have not selected a default video quality, please select one of the following. You can change the default video quality in the settings later if you change your mind.",
          [
            {
              text: "HD",
              onPress: () => this.setVideoQuality("hd")
            },
            {
              text: "High",
              onPress: () => this.setVideoQuality("high")
            },
            { text: "Low", onPress: () => this.setVideoQuality("low") }
          ],
          { cancelable: false }
        );
      } else {
        if (video.saved_time) {
          Alert.alert("Continue watching?", null, [
            {
              text: "Continue watching",
              onPress: () => this._initVideo(video, Number(video.saved_time))
            },
            {
              text: "Watch from beginning",
              onPress: () => this._initVideo(video, 0)
            }
          ]);
        } else {
          this._initVideo(video, 0);
        }
      }
    });
  };

  _initVideo = async (video, saved_time) => {
    const url = await this._getVideoUrl(video);
    const castState = await GoogleCast.getCastState();

    getAuthData().then(token => {
      const videoEndpoint = getVideoEndpoint(url, token.token);
      if (castState === "Connected") {
        this._cast(
          videoEndpoint,
          video.image.original_url,
          video.name,
          video.deck,
          saved_time,
          video.length_seconds
        );
      } else {
        this.props.navigation.navigate("Video", {
          video: video,
          url: videoEndpoint,
          title: video.name,
          savedTime: saved_time,
          resume: saved_time > 0
        });
      }
    });
  };

  _cast = (url, image, title, subtitle, duration, playPosition) => {
    GoogleCast.castMedia({
      mediaUrl: url,
      imageUrl: image,
      title: title,
      subtitle: subtitle,
      studio: "Giant Bomb",
      streamDuration: duration,
      playPosition: playPosition > 0 ? playPosition : 0
    });
  };

  _getVideoUrl = async video => {
    const forceLow = await getForceLowOnMobile();
    const netInfo = await NetInfo.getConnectionInfo();

    if (forceLow && netInfo.type !== "wifi") return video.low_url;

    const quality = await getGlobalVideoQuality();
    switch (quality) {
      case "hd":
        return video.hd_url;
      case "high":
        return video.high_url;
      case "low":
        return video.low_url;
      default:
        return video.low_url;
    }
  };

  render() {
    return (
      <View style={styles.listViewStyle}>
        <FlatList
          onRefresh={this.onRefresh}
          refreshing={this.state.isFetching}
          data={this.props.videos.results.slice()}
          renderItem={({item}) => this.renderVideoItem(item)}
          keyExtractor={(_item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listViewStyle: { backgroundColor: "#18121D", height: "100%" }
});

export default observer(VideoFlatList);
