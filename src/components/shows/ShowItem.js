import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

export default class ShowItem extends React.PureComponent {
  render() {
    return (
      <View style={styles.listItem}>
        <View style={styles.singleFlex}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("Videos", { id: this.props.show.id, title: this.props.show.title })
            }
          >
            <Text style={styles.listItemText}>{this.props.show.title}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => this.props.show.toggleFavorite()}>
            <Icon
              name="star"
              size={20}
              color={this.props.show.isFavorite ? "gold" : "#888"}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  listItemText: {
    color: "#eee"
  },
});