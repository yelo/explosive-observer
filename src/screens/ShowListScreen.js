import React from "react";
import {
  Text,
  ActivityIndicator,
  View,
  SectionList,
  StyleSheet,
  Alert
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { GBShows } from "../models/GBShows";
import { observer } from "mobx-react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { onSnapshot } from "mobx-state-tree";

class ShowListScreen extends React.Component {
  state = {
    isLoading: true,
    shows: {}
  };

  constructor() {
    super();
    this.setupShows();
  }

  setupShows = async () => {
    const shows = GBShows.create();
    onSnapshot(shows, () => {
      this.setState({ shows });
    });
    await shows.load();
    this.state.isLoading = false;
  };

  render() {
    if (this.state.isLoading) {
      return <ActivityIndicator />;
    }
    return (
      <SafeAreaView style={styles.container} forceInset={{ bottom: "always" }}>
        <ShowList shows={this.state.shows} navigation={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

const ShowList = observer(props => (
  <View>
    <SectionList
      sections={[
        {
          title: "Favorites",
          data: props.shows.favorites.slice(),
          renderItem: renderListItem,
          navigation: props.navigation
        },
        {
          title: "Shows",
          data: props.shows.all.slice(),
          renderItem: renderListItem,
          navigation: props.navigation
        }
      ]}
      renderSectionFooter={({ section }) => renderSectionFooter(section)}
      renderSectionHeader={({ section }) => renderSectionHeader(section)}
      keyExtractor={(_item, index) => index.toString()}
    />
  </View>
));

renderSectionFooter = section => {
  if (section.data.length == 0) {
    return <Text style={styles.listItem}>Nothing here :(</Text>;
  }
  return null;
};

renderSectionHeader = section => {
  return <Text style={styles.listHeader}>{section.title}</Text>;
};

renderListItem = ({ item, index, section: { title, data, navigation } }) => {
  console.log('item', item);
  return (
    <View style={styles.listItem}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Videos", { id: item.id })
        }
      >
        <Text>{item.title}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => item.toggleFavorite()}>
        <Icon
          name="star"
          size={20}
          color={item.isFavorite ? "gold" : "#eee"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between"
  },
  listItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  listHeader: { padding: 4, backgroundColor: "#eee", fontWeight: "bold" }
});

export default observer(ShowListScreen);
