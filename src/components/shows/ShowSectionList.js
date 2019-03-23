import React from "react";
import { Text, View, SectionList, StyleSheet } from "react-native";
import { observer } from "mobx-react";
import ShowItem from "./ShowItem";
import NonShowItem from "./NonShowItem";

class ShowSectionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false
    };
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

  render() {
    return (
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
            },
            {
              title: "Favorites",
              data: this.props.shows.favorites.slice(),
              renderItem: this.renderShowItem,
              navigation: this.props.navigation
            },
            {
              title: "Shows",
              data: this.props.shows.all.slice(),
              renderItem: this.renderShowItem,
              navigation: this.props.navigation
            }
          ]}
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
  listHeader: {
    padding: 4,
    backgroundColor: "#2E2138",
    fontWeight: "bold",
    color: "#FF3233"
  }
});

export default observer(ShowSectionList);
