import { View, Text } from "react-native";
import React from "react";
import { AuthProvider } from "./context/authContext";
import ScreenMenu from "./components/Menus/ScreenMenu";
import { PostProvider } from "./context/postContext";
import { EventProvider } from "./context/eventContext";

const RootNavigation = () => {
  return (
    <AuthProvider>
      <EventProvider>
        <PostProvider>
          <ScreenMenu />
        </PostProvider>
      </EventProvider>
    </AuthProvider>
  );
};

export default RootNavigation;
