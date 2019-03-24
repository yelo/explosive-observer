import React from "react";
import { GBShows } from "../models/gb/GBShows";
import { observer } from "mobx-react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { onSnapshot } from "mobx-state-tree";
import FullLoader from "../components/FullLoader";
import ShowSectionList from "../components/shows/ShowSectionList";

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
      this.setState({ shows, isLoading: false });
    });
    shows.load();
  };

  _navigateToSettings = () => {
    this.props.navigation.navigate("Settings");
  };

  render() {
    if (this.state.isLoading) {
      return <FullLoader />;
    }
    return (
      <ShowSectionList
        shows={this.state.shows}
        navigation={this.props.navigation}
      />
    );
  }
}

export default observer(ShowListScreen);
