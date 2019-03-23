import React from "react";
import { StyleSheet, View } from "react-native";
import { observer } from "mobx-react";
import { FlatList } from "react-native-gesture-handler";
import VideoItem from "./VideoItem";

export const VideoFlatList = observer(props => (
  <View style={styles.listViewStyle}>
    <FlatList
      data={props.videos.results.slice()}
      renderItem={({ item: video }) => _renderVideoItem(video, props)}
      keyExtractor={(_item, index) => index.toString()}
    />
  </View>
));

_renderVideoItem = (video, props) => {
  return (
    <VideoItem
      video={video}
      playVideo={props.playVideo}
      launchExternalSite={props.launchExternalSite}
    />
  );
};

const styles = StyleSheet.create({
  listViewStyle: { backgroundColor: "#18121D", height: "100%" }
});
