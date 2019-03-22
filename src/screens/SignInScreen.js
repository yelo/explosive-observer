import React from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";
import { fetchAccessToken } from "../utils/Authenticator";
import { setAuthData } from "../utils/DataStorage";

export default class SignInScreen extends React.Component {
  state = {
    appCode: null,
    isLoading: false
  };

  handleAuth = async () => {
    this.setState({ isLoading: true });

    const token = await fetchAccessToken(this.state.appCode);

    this.setState({ isLoading: false });

    if (token && token.status.toLowerCase() !== "failure") {
      setAuthData({ token: token.regToken, expiration: token.expiration });
      this.props.navigation.navigate("App");
    } else {
      Alert.alert("Unable to fetch access token");
    }
  };

  render() {
    return (
      <View>
        <Text>SignInScreen</Text>
        <TextInput
          style={styles.input}
          onChangeText={appCode => this.setState({ appCode })}
        />
        <Button title="Auth" onPress={this.handleAuth} />
        {this.state.isLoading && <ActivityIndicator />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1
  }
});
