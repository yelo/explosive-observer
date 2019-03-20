/**
 * Starting point.
 *
 * @format
 * @flow
 */

import React from "react";
import { StyleSheet } from "react-native";
import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
  SafeAreaView
} from "react-navigation";

import AuthLoadingScreen from "./screens/AuthLoadingScreen";
import ShowListScreen from "./screens/ShowListScreen";
import VideoListScreen from "./screens/VideoListScreen";
import VideoScreen from "./screens/VideoScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SignInScreen from "./screens/SignInScreen";

const AppStack = createStackNavigator(
  {
    Shows: ShowListScreen,
    Videos: VideoListScreen,
    Video: VideoScreen,
    Settings: SettingsScreen
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#f4511e"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "normal"
      }
    }
  }
);

const AuthStack = createStackNavigator({ SignIn: SignInScreen });

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);

export default class App extends React.Component {
  render() {
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "never" }}
      >
        <AppContainer />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-around"
  }
});
