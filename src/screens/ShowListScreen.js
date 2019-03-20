import React from "react";
import { Text, View, SectionList, StyleSheet, Alert } from "react-native";
import { GBShows } from "../models/GBShows";
import { observer } from "mobx-react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { onSnapshot } from "mobx-state-tree";
import FullLoader from "../components/FullLoader";

class ShowListScreen extends React.Component {
  static navigationOptions = {
    headerTitle: "Home",
    headerRight: (
      <TouchableOpacity onPress={() => this.navigateToSettings}>
        <Icon style={{ marginRight: 10 }} name="gear" size={24} color="#000" />
      </TouchableOpacity>
    )
  };

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

  navigateToSettings = () => {
    Alert.alert("Implement this");
  };

  render() {
    if (this.state.isLoading) {
      return <FullLoader />;
    }
    return (
      <ShowList shows={this.state.shows} navigation={this.props.navigation} />
    );
  }
}

const ShowList = observer(props => (
  <View>
    <SectionList
      sections={[
        {
          title: "Howdy, duder",
          data: [
            {
              icon: "chrome",
              color: "steelblue",
              title: "Latest videos",
              action: () =>
                props.navigation.navigate("Videos", {
                  id: null,
                  title: "Latest videos"
                })
            },
            {
              icon: "home",
              color: "steelblue",
              title: "Features",
              action: () =>
                props.navigation.navigate("Videos", {
                  id: 0,
                  title: "Features"
                })
            },
            {
              icon: "history",
              color: "steelblue",
              title: "Continue watching",
              action: () => null
            },
            {
              icon: "download",
              color: "orange",
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
    <View style={styles.listItemNonShow}>
      <View>
        <Icon name={item.icon} size={25} color={item.color} />
      </View>
      <View style={styles.singleFlex}>
        <TouchableOpacity onPress={item.action}>
          <Text style={styles.listItemNonShowText}>{item.title}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

_renderShowItem = ({ item, index, section: { title, data, navigation } }) => {
  if (data.length === 0) return null;
  return (
    <View style={styles.listItem}>
      <View style={styles.singleFlex}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Videos", { id: item.id, title: item.title })
          }
        >
          <Text>{item.title}</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => item.toggleFavorite()}>
          <Icon
            name="star"
            size={20}
            color={item.isFavorite ? "gold" : "#eee"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between"
  },
  singleFlex: {
    flex: 1,
  },
  listItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "stretch"
  },
  listItemNonShow: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc"
  },
  listItemNonShowText: {
    marginLeft: 8,
    fontSize: 20
  },
  listHeader: { padding: 4, backgroundColor: "#eee", fontWeight: "bold" }
});

export default observer(ShowListScreen);
