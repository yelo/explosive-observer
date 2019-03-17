import React from "react";
import { Text } from "react-native";
import { getAuthData } from "../utils/DataStorage";

export default class ShowListScreen extends React.Component {
    constructor() {
        super();
        this.setupShows();
    }

    setupShows = async () => {
        console.log("stored token", await getAuthData());
    }

    render() {
        return <Text>ShowListScreen</Text>;
    }
}