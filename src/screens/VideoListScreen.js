import React from "react";
import { Alert, View, Linking, TouchableOpacity } from "react-native";
import { GBVideos } from "../models/gb/GBVideos";
import { onSnapshot } from "mobx-state-tree";
import { observer } from "mobx-react";
import Icon from "react-native-vector-icons/FontAwesome";
import FullLoader from "../components/FullLoader";
import {
  getGlobalVideoQuality,
  setGlobalVideoQuality,
  getAuthData
} from "../utils/DataStorage";
import { VideoFlatList } from "../components/videos/VideoFlatList";
import { getVideoEndpoint } from "../utils/ApiEndpoints";
import ChromeCastControl from "../components/ChromeCastControl";
import GoogleCast, { CastButton } from "react-native-google-cast";

class VideoListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Videos"),
      headerRight: (
        <View
          style={{
            width: 100,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end"
          }}
        >
          <CastButton style={{ width: 24, height: 24, tintColor: "#FD4142" }} />
          <TouchableOpacity onPress={navigation.getParam("navigateToSettings")}>
            <Icon
              style={{ marginRight: 10 }}
              name="gear"
              size={24}
              color="#FD4142"
            />
          </TouchableOpacity>
        </View>
      )
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

  componentDidMount() {
    this.props.navigation.setParams({
      navigateToSettings: this._navigateToSettings
    });
  }

  _navigateToSettings = () => {
    this.props.navigation.navigate("Settings");
  };

  setupVideos = async id => {
    const videos = GBVideos.create();
    onSnapshot(videos, () => {
      this.setState({ videos, isLoading: false });
    });
    await videos.load(id);
  };

  setVideoQuality = (quality, video) => {
    setGlobalVideoQuality(quality).then(() => {
      this.playVideo(video);
    });
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
    getAuthData().then(token => {
      this.props.navigation.navigate("Video", {
        video: video,
        url: getVideoEndpoint(url, token.token),
        title: video.name,
        savedTime: saved_time,
        resume: saved_time > 0
      });
    });
  };

  _getVideoUrl = async video => {
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
  }

  launchExternalSite = url => {
    Linking.openURL(url);
  };

  render() {
    if (this.state.isLoading) {
      return <FullLoader />;
    }
    return (
      <View>
        <VideoFlatList
          videos={this.state.videos}
          navigation={this.props.navigation}
          playVideo={this.playVideo}
          launchExternalSite={this.launchExternalSite}
        />
        <ChromeCastControl />
      </View>
    );
  }
}

export default observer(VideoListScreen);
