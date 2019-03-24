import React from "react";
import { Text, View, SectionList, StyleSheet } from "react-native";
import { observer } from "mobx-react";
import ShowItem from "./ShowItem";
import NonShowItem from "./NonShowItem";
import LiveVideoItem from "../LiveVideoItem";
import { getLiveVideo } from "../../utils/ApiEndpoints";

class ShowSectionList extends React.Component {
  liveCheckInterval = null;

  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      liveVideo: null
    };
  }

  componentDidMount() {
    this._checkForLiveShow();
  }

  componentWillUnmount() {
    if (liveCheckInterval) {
      clearTimeout(liveCheckInterval);
    }
  }

  renderSectionHeader = section => {
    if (section.data.length === 0) return null;
    return <Text style={styles.listHeader}>{section.title}</Text>;
  };

  renderNonShowItem = ({
    item,
    index,
    section: { title, data, navigation }
  }) => {
    return <NonShowItem item={item} />;
  };

  renderShowItem = ({
    item: show,
    index,
    section: { title, data, navigation }
  }) => {
    if (data.length === 0) return null;
    return <ShowItem show={show} navigation={navigation} />;
  };

  renderLiveItem = ({ item, index, section: { title, data, navigation } }) => {
    return item;
  };

  _checkForLiveShow = async () => {
    this.setState({ liveVideo: await getLiveVideo() });
    this.liveCheckInterval = setInterval(async () => {
      this.setState({ liveVideo: await getLiveVideo() });
    }, 1000 * 60 * 10);
  };

  render() {
    const liveItem = {
      title: "Live",
      data: this.state.liveVideo
        ? [<LiveVideoItem video={this.state.liveVideo} />]
        : [],
      renderItem: this.renderLiveItem
    };

    const customItems = {
      title: "Howdy, duder",
      data: [
        {
          icon: "clock-o",
          color: "#FD4142",
          title: "Latest videos",
          action: () =>
            this.props.navigation.navigate("Videos", {
              id: null,
              title: "Latest videos"
            })
        },
        {
          icon: "bomb",
          color: "#FD4142",
          title: "Features",
          action: () =>
            this.props.navigation.navigate("Videos", {
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
      renderItem: this.renderNonShowItem
    };

    const favoriteItems = {
      title: "Favorites",
      data: this.props.shows.favorites.slice(),
      renderItem: this.renderShowItem,
      navigation: this.props.navigation
    };

    const showItems = {
      title: "Shows",
      data: this.props.shows.all.slice(),
      renderItem: this.renderShowItem,
      navigation: this.props.navigation
    };

    return (
      <View style={styles.container}>
        <SectionList
          sections={[liveItem, customItems, favoriteItems, showItems]}
          renderSectionHeader={({ section }) =>
            this.renderSectionHeader(section)
          }
          keyExtractor={(_item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#18121D" },
  listHeader: {
    padding: 4,
    backgroundColor: "#2E2138",
    fontWeight: "bold",
    color: "#FF3233"
  }
});

export default observer(ShowSectionList);
