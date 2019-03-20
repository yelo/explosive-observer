import React from "react";
import { getAuthData } from "../utils/DataStorage";
import FullLoader from "../components/FullLoader";

export default class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrap();
  }

  _bootstrap = async () => {
    const authData = await getAuthData();
    this.props.navigation.navigate(
      authData && Number(authData.expiration) > Date.now() / 1000
        ? "App"
        : "Auth"
    );
  };

  render() {
    return (
      <FullLoader />
    );
  }
}