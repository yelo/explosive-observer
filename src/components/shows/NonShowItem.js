import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

export default class NonShowItem extends React.Component {
  render() {
    return (
      <View style={styles.listItemNonShow}>
        <View style={styles.listItemIcon}>
          <Icon
            name={this.props.item.icon}
            size={25}
            color={this.props.item.color}
          />
        </View>
        <View style={styles.singleFlex}>
          <TouchableOpacity onPress={this.props.item.action}>
            <Text style={styles.listItemNonShowText}>
              {this.props.item.title}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItemNonShow: {
    padding: 10,
    backgroundColor: "#261B2D",
    flexDirection: "row",
    justifyContent: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#18121D",
    alignContent: "stretch"
  },
  listItemIcon: {
    width: 24
  },
  listItemNonShowText: {
    marginLeft: 8,
    fontSize: 20,
    color: "#eee"
  },
  singleFlex: {
    flex: 1
  }
});
