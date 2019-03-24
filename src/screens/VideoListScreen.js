import React from "react";
import { View, TouchableOpacity } from "react-native";
import { GBVideos } from "../models/gb/GBVideos";
import { onSnapshot } from "mobx-state-tree";
import { observer } from "mobx-react";
import Icon from "react-native-vector-icons/FontAwesome";
import FullLoader from "../components/FullLoader";
import ChromeCastControl from "../components/ChromeCastControl";
import GoogleCast, { CastButton } from "react-native-google-cast";
import VideoFlatList from "../components/videos/VideoFlatList";

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
          <CastButton
            style={{
              marginRight: 10,
              width: 24,
              height: 24,
              tintColor: "brightred"
            }}
          />
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
    GoogleCast.showIntroductoryOverlay();
  }

  setupVideos = async id => {
    const videos = GBVideos.create();
    onSnapshot(videos, () => {
      this.setState({ videos, isLoading: false });
    });
    await videos.load(id);
  };

  _navigateToSettings = () => {
    this.props.navigation.navigate("Settings");
  };

  render() {
    if (this.state.isLoading) {
      return <FullLoader />;
    }
    return (
      <View>
        <VideoFlatList
          videos={this.state.videos}
          showId={this.props.navigation.getParam("id", 0)}
          navigation={this.props.navigation}
        />
        {/* <ChromeCastControl /> */}
      </View>
    );
  }
}

export default observer(VideoListScreen);
