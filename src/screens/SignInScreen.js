import React from "react";
import {
  Text,
  View,
  TextInput,
  WebView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView
} from "react-native";
import { fetchAccessToken } from "../utils/Authenticator";
import { setAuthData } from "../utils/DataStorage";
import { TouchableOpacity } from "react-native-gesture-handler";
import FullLoader from "../components/FullLoader";
import { getAccessTokenEndpoint, getAppCodeUrl } from "../utils/ApiEndpoints";

export default class SignInScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Authenticate",
      headerStyle: {
        backgroundColor: "#261B2D"
      },
      headerTintColor: "#FD4142",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    };
  };
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
      Alert.alert(
        "Unable to fetch access token",
        "Something went wronng while fetching the access token, make sure that the code you entered is the same that's displayed on the site."
      );
    }
  };

  render() {
    if (this.state.isLoading) {
      return <FullLoader />;
    }
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.container}>
          <Text style={styles.infoText}>
            Login and enter the code displayed below into the input field, then
            tap 'Continue' to begin the authentication
          </Text>
          <View style={styles.webView}>
            <WebView
              style={{ backgroundColor: "#333" }}
              source={{ uri: getAppCodeUrl() }}
            />
          </View>
          <TextInput
            placeholderTextColor="#888"
            placeholder="Code goes here"
            style={styles.input}
            onChangeText={appCode => this.setState({ appCode })}
          />

          <TouchableOpacity
            ref={this.loginButton}
            styles={styles.touchable}
            onPress={this.handleAuth}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>Continue</Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    height: "50%",
    width: "100%",
    margin: 20,
    borderColor: "#333",
    borderWidth: 5
  },
  infoText: {
    color: "#eee"
  },
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
    backgroundColor: "#261B2D",
    justifyContent: "space-around",
    alignItems: "center"
  },
  touchable: {
    justifyContent: "center"
  },
  button: {
    padding: 10,
    borderRadius: 10,
    width: 200,
    marginBottom: 20,
    backgroundColor: "#FD4142",
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 20,
    alignSelf: "center"
  },
  input: {
    width: 200,
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    color: "#eee",
    fontSize: 20,
    marginBottom: 20
  }
});
