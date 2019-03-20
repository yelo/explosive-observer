import React from "react";
import { Text, StyleSheet, ImageBackground, View, Linking } from "react-native";
import { GBVideos } from "../models/GBVideos";
import { onSnapshot } from "mobx-state-tree";
import { observer } from "mobx-react";
import FullLoader from "../components/FullLoader";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

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
    console.log("play this", video);
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
  <View style={{backgroundColor: "#eee", height:"100%"}}>
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
          <View style={styles.listItemInfoText}>
            <Icon name="user" size={18} color="#F9432A" />
            <Text style={{ fontSize: 15, marginLeft: 5 }}>{item.user}</Text>
          </View>
          <View style={styles.listItemInfoText}>
            <Text style={{ fontSize: 15, marginRight: 5 }}>
              {item.publish_date}
            </Text>
            <Icon name="clock-o" size={18} color="#F9432A" />
          </View>
        </View>
      </ImageBackground>
      <View
        style={{
          padding: 15,
          paddingBottom: 0,
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <TouchableOpacity>
          <Icon name="download" size={30} color="#F9432A" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.launchExternalSite(item.site_detail_url)}
        >
          <Icon name="external-link-square" size={30} color="#F9432A" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="gear" size={30} color="#F9432A" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.playVideo(item)}>
          <Icon name="play" size={30} color="#F9432A" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    justifyContent: "space-between"
  },
  listItem: {
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    padding: 10,
    justifyContent: "space-between",
    marginBottom: 10
  },
  listItemTitle: {
    fontSize: 18,
    padding: 8
  },
  listItemInfoText: {
    fontSize: 15,
    padding: 6,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  listItemInfo: {
    padding: 5,
    backgroundColor: "#ffffffff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  listItemSubtitle: {
    fontSize: 15
  },
  listItemSubtitleView: {
    backgroundColor: "#EEEEEECC",
    padding: 8,
    color: "blue"
  },
  listItemBackground: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    justifyContent: "flex-end",
    aspectRatio: 3 / 2
  },
  listItemBackgroundImage: {
    borderRadius: 10
  },
  listHeader: { padding: 4, backgroundColor: "#eee", fontWeight: "bold" }
});

export default observer(VideoListScreen);
