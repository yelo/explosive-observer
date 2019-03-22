import React from "react";
import { Text, View, SectionList, StyleSheet } from "react-native";
import { observer } from "mobx-react";
import ShowItem from "./ShowItem";
import NonShowItem from "./NonShowItem";

export const ShowSectionList = observer(props => (
  <View style={{ backgroundColor: "#18121D" }}>
    <SectionList
      sections={[
        {
          title: "Howdy, duder",
          data: [
            {
              icon: "clock-o",
              color: "#FD4142",
              title: "Latest videos",
              action: () =>
                props.navigation.navigate("Videos", {
                  id: null,
                  title: "Latest videos"
                })
            },
            {
              icon: "bomb",
              color: "#FD4142",
              title: "Features",
              action: () =>
                props.navigation.navigate("Videos", {
                  id: 0,
                  title: "Features"
                })
            },
            {
              icon: "history",
              color: "#FD4142",
              title: "Continue watching",
              action: () => null
            },
            {
              icon: "download",
              color: "#FD4142",
              title: "Downloads",
              action: () => null
            }
          ],
          renderItem: _renderNonShowItem
        },
        {
          title: "Favorites",
          data: props.shows.favorites.slice(),
          renderItem: _renderShowItem,
          navigation: props.navigation
        },
        {
          title: "Shows",
          data: props.shows.all.slice(),
          renderItem: _renderShowItem,
          navigation: props.navigation
        }
      ]}
      renderSectionHeader={({ section }) => _renderSectionHeader(section)}
      keyExtractor={(_item, index) => index.toString()}
    />
  </View>
));

_renderSectionHeader = section => {
  if (section.data.length === 0) return null;
  return <Text style={styles.listHeader}>{section.title}</Text>;
};

_renderNonShowItem = ({
  item,
  index,
  section: { title, data, navigation }
}) => {
  return (
    <NonShowItem item={item} />
  );
};

_renderShowItem = ({ item, index, section: { title, data, navigation } }) => {
  if (data.length === 0) return null;
  return (
    <ShowItem item={item} navigation={navigation} />
  );
};

const styles = StyleSheet.create({
  listHeader: {
    padding: 4,
    backgroundColor: "#2E2138",
    fontWeight: "bold",
    color: "#FF3233"
  }
});