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
  clearAuthData
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
    downloadOverWifi: null,
    globalVideoQuality: null,
    qualityString: null
  };

  isIos = Platform.OS === "ios";

  videoQualities = ["High", "Medium", "Low"];

  constructor() {
    super();
    this._setupSettings();
  }

  _setupSettings = async () => {
    const globalVideoQuality = await getGlobalVideoQuality();
    const downloadOverWifi = await getDownloadOverMobile();
    this.setState({ globalVideoQuality: globalVideoQuality || "high" });
    this.setState({ downloadOverWifi: downloadOverWifi || false });
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

  setDownloadOverMobile = downloadOverWifi => {
    setDownloadOverMobile(downloadOverWifi).then(() => {
      this.setState({ downloadOverWifi });
    });
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
            <Text style={styles.title}>Download over mobile data?</Text>
            <Switch
              value={this.state.downloadOverWifi}
              onValueChange={downloadOverWifi =>
                this.setDownloadOverMobile(downloadOverWifi)
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
                style={{ height: 30, width: 100 }}
                itemStyle={styles.qualityString}
                onValueChange={(itemValue, itemIndex) =>
                  this.setVideoQuality(itemValue)
                }
              >
                <Picker.Item label="High" value="high" />
                <Picker.Item label="Medium" value="medium" />
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
    backgroundColor: "#261B2D",

  },
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
