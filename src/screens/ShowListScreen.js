import React from "react";
import { Text, View, SectionList, StyleSheet, Alert } from "react-native";
import { GBShows } from "../models/gb/GBShows";
import { observer } from "mobx-react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { onSnapshot } from "mobx-state-tree";
import FullLoader from "../components/FullLoader";

class ShowListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Home",
      headerRight: (
        <TouchableOpacity onPress={navigation.getParam("navigateToSettings")}>
          <Icon
            style={{ marginRight: 10 }}
            name="gear"
            size={24}
            color="#FD4142"
          />
        </TouchableOpacity>
      )
    };
  };

  state = {
    isLoading: true,
    shows: {}
  };

  constructor() {
    super();
    this.setupShows();
  }

  componentDidMount() {
    this.props.navigation.setParams({
      navigateToSettings: this._navigateToSettings
    });
  }

  setupShows = async () => {
    const shows = GBShows.create();
    onSnapshot(shows, () => {
      this.setState({ shows });
    });
    await shows.load();
    this.state.isLoading = false;
  };

  _navigateToSettings = () => {
    this.props.navigation.navigate("Settings");
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
    <View style={styles.listItemNonShow}>
      <View style={{width:24}}>
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
          <Text style={styles.listItemText}>{item.title}</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => item.toggleFavorite()}>
          <Icon
            name="star"
            size={20}
            color={item.isFavorite ? "gold" : "#888"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FD4142",
    justifyContent: "space-between"
  },
  singleFlex: {
    flex: 1
  },
  listItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#3B1E39",
    padding: 10,
    borderColor: "#321D34",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "stretch",
    backgroundColor: "#18121D"
  },
  listItemNonShow: {
    padding: 10,
    backgroundColor: "#261B2D",
    flexDirection: "row",
    justifyContent: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#18121D"
  },
  listItemText: {
    color: "#eee"
  },
  listItemNonShowText: {
    marginLeft: 8,
    fontSize: 20,
    color: "#eee"
  },
  listHeader: {
    padding: 4,
    backgroundColor: "#2E2138",
    fontWeight: "bold",
    color: "#FF3233"
  }
});

export default observer(ShowListScreen);
