import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Picker,
  ActionSheetIOS,
  Platform
} from "react-native";
import {
  getGlobalVideoQuality,
  getDownloadOverMobile,
  setGlobalVideoQuality,
  setDownloadOverMobile,
  setForceLowOnMobile,
  clearAuthData,
  getForceLowOnMobile
} from "../utils/DataStorage";
import {
  ScrollView,
  Switch,
  TouchableOpacity
} from "react-native-gesture-handler";
import { NavigationActions } from "react-navigation";

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: "Settings"
  };

  state = {
    downloadOverMobile: null,
    globalVideoQuality: null,
    qualityString: null,
    forceLowOnMobile: false
  };

  isIos = Platform.OS === "ios";

  videoQualities = ["Hd", "High", "Low"];

  constructor() {
    super();
    this._setupSettings();
  }

  _setupSettings = async () => {
    const globalVideoQuality = await getGlobalVideoQuality();
    const downloadOverMobile = await getDownloadOverMobile();
    const forceLowOnMobile = await getForceLowOnMobile();
    this.setState({ globalVideoQuality: globalVideoQuality || "low" });
    this.setState({ downloadOverMobile: downloadOverMobile || false });
    this.setState({ forceLowOnMobile: forceLowOnMobile || false });
    this.setState({
      qualityString: this.getVideoQualityString(this.state.globalVideoQuality)
    });
  };

  setVideoQuality = globalVideoQuality => {
    setGlobalVideoQuality(globalVideoQuality).then(() => {
      this.setState({ globalVideoQuality });
      this.setState({
        qualityString: this.getVideoQualityString(this.state.globalVideoQuality)
      });
    });
  };

  setDownloadOverMobile = downloadOverMobile => {
    setDownloadOverMobile(downloadOverMobile).then(() => {
      this.setState({ downloadOverMobile });
    });
  };

  setForceLowOnMobile = forceLowOnMobile => {
    setForceLowOnMobile(forceLowOnMobile).then(() => {
      this.setState({ forceLowOnMobile });
    })
  };

  getVideoQualityString = () => {
    if (typeof this.state.globalVideoQuality !== "string") return "";
    return (
      this.state.globalVideoQuality.charAt(0).toUpperCase() +
      this.state.globalVideoQuality.slice(1)
    );
  };

  openQualityActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: "Select video quality",
        options: this.videoQualities
      },
      buttonIndex =>
        this.setVideoQuality(this.videoQualities[buttonIndex].toLowerCase())
    );
  };

  signOut = () => {
    clearAuthData().then(() => {
      this.props.navigation.replace(
        NavigationActions.navigate({
          routeName: "Auth",
          action: NavigationActions.navigate({ routeName: "SignIn" })
        })
      );
    });
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        {/* Toggle download over mobile */}
        <View style={styles.itemHolder}>
          <View style={styles.itemContainer}>
            <Text style={styles.title}>Download over mobile?</Text>
            <Switch
              value={this.state.downloadOverMobile}
              onValueChange={downloadOverMobile =>
                this.setDownloadOverMobile(downloadOverMobile)
              }
            />
          </View>
        </View>

        {/* Force low over mobile  */}
        <View style={styles.itemHolder}>
          <View style={styles.itemContainer}>
            <Text style={styles.title}>Force low quality over mobile?</Text>
            <Switch
              value={this.state.forceLowOnMobile}
              onValueChange={forceLowOnMobile =>
                this.setForceLowOnMobile(forceLowOnMobile)
              }
            />
          </View>
        </View>

        {/* Select video quality */}
        <View style={styles.itemHolder}>
          <View style={styles.itemContainer}>
            <Text style={styles.title}>Video quality?</Text>
            {this.isIos && (
              <TouchableOpacity onPress={() => this.openQualityActionSheet()}>
                <Text style={styles.qualityString}>
                  {this.state.qualityString}
                </Text>
              </TouchableOpacity>
            )}
            {!this.isIos && (
              <Picker
                selectedValue={this.state.globalVideoQuality}
                style={styles.picker}
                itemStyle={styles.qualityString}
                onValueChange={(itemValue, itemIndex) =>
                  this.setVideoQuality(itemValue)
                }
              >
                <Picker.Item label="Hd" value="hd" />
                <Picker.Item label="High" value="high" />
                <Picker.Item label="Low" value="low" />
              </Picker>
            )}
          </View>
        </View>

        {/* Sign out */}
        <View style={styles.itemHolder}>
          <TouchableOpacity onPress={() => this.signOut()}>
            <View style={styles.itemContainer}>
              <Text style={styles.title}>Sign out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#261B2D"
  },
  picker: { height: 30, width: 100 },
  itemHolder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc"
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8
  },
  title: {
    color: "#eee",
    marginTop: 5,
    fontSize: 18
  },
  qualityString: {
    marginTop: 5,
    fontSize: 18,
    color: "#FD4142",
    textDecorationLine: "underline"
  }
});
