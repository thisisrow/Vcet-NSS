import { View, Text } from "react-native";
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../../context/authContext";
import Home from "../../screens/Home";
import Login from "../../screens/auth/Login";
import HeaderMenu from "./HeaderMenu";
import Post from "../../screens/Post";
import UserAbout from "../../screens/auth/UserAbout";
import About from "../../screens/About";
import Account from "../../screens/Account";
import Myposts from "../../screens/Myposts";
import AdminPost from "../../screens/AdminPost";
import A_Home from "../../screens/Admin/A_home"; // Admin Home
import A_Account from "../../screens/Admin/A_Account";
import A_Attendence from "../../screens/Admin/A_Attendence";
import A_Event from "../../screens/Admin/A_Event";
import A_ManageEvent from "../../screens/Admin/A_ManageEvent";
import A_allVolenteer from "../../screens/Admin/A_allVolenteer";
import A_CreateVolenteer from "../../screens/Admin/A_CreateVolenteer";
import theme from "../theme";

const ScreenMenu = () => {
  const [state] = useContext(AuthContext);
  const authenticatedUser = state?.user && state?.token;
  const userRole = state?.role; // Get role from auth state

  const Stack = createNativeStackNavigator();

  // Common screen options
  const commonScreenOptions = {
    headerStyle: {
      backgroundColor: theme.colors.primary,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: '600',
    },
    headerShadowVisible: false,
    contentStyle: {
      backgroundColor: theme.colors.background,
    },
  };

  // Admin screen options
  const adminScreenOptions = {
    ...commonScreenOptions,
    headerRight: () => <HeaderMenu />,
  };

  // Volunteer screen options
  const volunteerScreenOptions = {
    ...commonScreenOptions,
    headerRight: () => <HeaderMenu />,
  };

  return (
    <Stack.Navigator 
      initialRouteName="UserAbout"
      screenOptions={commonScreenOptions}
    >
      {authenticatedUser ? (
        <>
          {userRole === "Admin" ? (
            // Admin Screens
            <>
              <Stack.Screen
                name="A_Home"
                component={A_Home}
                options={{
                  title: "Admin Dashboard",
                  ...adminScreenOptions,
                }}
              />

              <Stack.Screen
                name="A_Event"
                component={A_Event}
                options={{
                  title: "Create Event",
                  ...adminScreenOptions,
                }}
              />
              <Stack.Screen
                name="A_ManageEvent"
                component={A_ManageEvent}
                options={{
                  title: "Manage Events",
                  ...adminScreenOptions,
                }}
              />

              <Stack.Screen
                name="A_allVolenteer"
                component={A_allVolenteer}
                options={{
                  title: "All Volunteers",
                  ...adminScreenOptions,
                }}
              />
              <Stack.Screen
                name="A_CreateVolenteer"
                component={A_CreateVolenteer}
                options={{
                  title: "Create Volunteer",
                  ...adminScreenOptions,
                }}
              />

              <Stack.Screen
                name="A_Attendence"
                component={A_Attendence}
                options={{
                  title: "Manage Attendance",
                  ...adminScreenOptions,
                }}
              />
              <Stack.Screen
                name="A_Account"
                component={A_Account}
                options={{
                  title: "My Account",
                  ...adminScreenOptions,
                }}
              />
            </>
          ) : (
            // Volunteer Screens
            <>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{
                  title: "NSS Portal",
                  ...volunteerScreenOptions,
                }}
              />
              <Stack.Screen
                name="Events"
                component={AdminPost}
                options={{
                  title: "Events",
                  ...volunteerScreenOptions,
                }}
              />
              <Stack.Screen
                name="Post"
                component={Post}
                options={{
                  title: "Create Post",
                  ...volunteerScreenOptions,
                }}
              />
              <Stack.Screen
                name="About"
                component={About}
                options={{
                  title: "About NSS",
                  ...volunteerScreenOptions,
                }}
              />
              <Stack.Screen
                name="Account"
                component={Account}
                options={{
                  title: "My Profile",
                  ...volunteerScreenOptions,
                }}
              />
              <Stack.Screen
                name="AdminPost"
                component={AdminPost}
                options={{
                  title: "Admin Updates",
                  ...volunteerScreenOptions,
                }}
              />
              <Stack.Screen
                name="Myposts"
                component={Myposts}
                options={{
                  title: "My Posts",
                  ...volunteerScreenOptions,
                }}
              />
            </>
          )}
        </>
      ) : (
        <>
          <Stack.Screen
            name="UserAbout"
            component={UserAbout}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default ScreenMenu;
