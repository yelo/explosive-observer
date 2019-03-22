import React from "react";
import { Text, StyleSheet, ImageBackground, View, Linking } from "react-native";
import { GBVideos } from "../models/gb/GBVideos";
import { onSnapshot } from "mobx-state-tree";
import { observer } from "mobx-react";
import FullLoader from "../components/FullLoader";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { getAuthData } from "../utils/DataStorage";
import { getVideoEndpoint } from "../utils/ApiEndpoints";

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
      <VideoList
        videos={this.state.videos}
        navigation={this.props.navigation}
        playVideo={this.playVideo}
        launchExternalSite={this.launchExternalSite}
      />
    );
  }
}

const VideoList = observer(props => (
  <View style={styles.listViewStyle}>
    <FlatList
      data={props.videos.results.slice()}
      renderItem={({ item }) => _renderVideoItem(item, props)}
      keyExtractor={(_item, index) => index.toString()}
    />
  </View>
));

_renderVideoItem = (item, props) => {
  return (
    <View style={styles.listItem}>
      <Text style={styles.listItemTitle}>{item.name}</Text>

      <ImageBackground
        style={styles.listItemBackground}
        imageStyle={styles.listItemBackgroundImage}
        source={{ uri: item.image.screen_url, cache: "default" }}
      >
        <View style={styles.listItemSubtitleView}>
          <Text style={styles.listItemSubtitle}>{item.deck}</Text>
        </View>
        <View style={styles.listItemInfo}>
          <View style={styles.listItemInfoSubView}>
            <Icon name="user" size={15} color="#FF3233" />
            <Text style={styles.listItemInfoText}>{item.user}</Text>
          </View>
          <View style={styles.listItemInfoSubView}>
            <Text style={styles.listItemInfoText}>{item.publish_date}</Text>
            <Icon name="clock-o" size={15} color="#FF3233" />
          </View>
        </View>
      </ImageBackground>
      <View style={styles.listViewItemInteractions}>
        <TouchableOpacity>
          <Icon name="download" size={25} color="#FF3233" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.playVideo(item)}>
          <Icon name="play-circle" size={60} color="#FF3233" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.launchExternalSite(item.site_detail_url)}
        >
          <Icon name="external-link-square" size={25} color="#FF3233" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18121D",
    justifyContent: "space-between"
  },
  listViewStyle: { backgroundColor: "#18121D", height: "100%" },
  listItem: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#000",
    backgroundColor: "#261B2D",
    padding: 10,
    margin: 10,
    justifyContent: "space-between",
    borderRadius: 10
  },
  listViewItemInteractions: {
    padding: 15,
    paddingBottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  listItemTitle: {
    color: "#FF3233",
    fontSize: 20,
    padding: 8
  },
  listItemInfoSubView: {
    fontSize: 15,
    padding: 6,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  listItemInfoText: {
    alignItems: "center",
    fontSize: 12,
    marginLeft: 5,
    marginRight: 5,
    color: "#ccc"
  },
  listItemInfo: {
    alignContent: "center",
    padding: 2,
    backgroundColor: "#333333ff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  listItemSubtitle: {
    fontSize: 15,
    color: "#eee"
  },
  listItemSubtitleView: {
    backgroundColor: "#333333CC",
    padding: 8
  },
  listItemBackground: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    justifyContent: "flex-end",
    aspectRatio: 3 / 2
  },
  listItemBackgroundImage: {
    borderRadius: 10
  }
});

export default observer(VideoListScreen);
