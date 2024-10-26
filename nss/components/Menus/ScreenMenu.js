import { View, Text } from "react-native";
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../../context/authContext";
import Home from "../../screens/Home";
import Login from "../../screens/auth/Login";
import HeaderMenu from "./HeaderMenu";
import Post from "../../screens/Post";
import About from "../../screens/About";
import Account from "../../screens/Account";
import Myposts from "../../screens/Myposts";
import AdminPost from "../../screens/AdminPost";
import A_Home from "../../screens/Admin/A_Home"; // Admin Home
import A_Account from "../../screens/Admin/A_Account";
import A_Attendence from "../../screens/Admin/A_Attendence";
import A_Event from "../../screens/Admin/A_Event";
import A_ManageEvent from "../../screens/Admin/A_ManageEvent";
import A_allVolenteer from "../../screens/Admin/A_allVolenteer";
import A_CreateVolenteer from "../../screens/Admin/A_CreateVolenteer";


const ScreenMenu = () => {
  const [state] = useContext(AuthContext);
  const authenticatedUser = state?.user && state?.token;
  const userRole = state?.role; // Get role from auth state

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Login">
      {authenticatedUser ? (
        <>
          {userRole === "Admin" ? (
            // Admin Screens
            <>
              <Stack.Screen
                name="A_Home"
                component={A_Home}
                options={{
                  title: "Admin Panel",
                  headerRight: () => <HeaderMenu />,
                }}
              />

              <Stack.Screen
                name="A_Event"
                component={A_Event}
                options={{
                  title: "Admin Create Event",
                  headerRight: () => <HeaderMenu />,
                }}
              />
              <Stack.Screen
                name="A_ManageEvent"
                component={A_ManageEvent}
                options={{
                  title: "Admin Manage Event",
                  headerRight: () => <HeaderMenu />,
                }}
              />

              <Stack.Screen
                name="A_allVolenteer"
                component={A_allVolenteer}
                options={{
                  title: "Admin All Volenteer",
                  headerRight: () => <HeaderMenu />,
                }}
              />
              <Stack.Screen
                name="A_CreateVolenteer"
                component={A_CreateVolenteer}
                options={{
                  title: "Admin Create Volenteer",
                  headerRight: () => <HeaderMenu />,
                }}
              />

              <Stack.Screen
                name="A_Attendence"
                component={A_Attendence}
                options={{
                  title: "Admin Manage Attendence",
                  headerRight: () => <HeaderMenu />,
                }}
              />
              <Stack.Screen
                name="A_Account"
                component={A_Account}
                options={{
                  title: "Admin Account",
                  headerRight: () => <HeaderMenu />,
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
                  title: "Welcome",
                  headerRight: () => <HeaderMenu />,
                }}
              />
              <Stack.Screen
                name="Events"
                component={AdminPost}
                options={{
                  title: "Admin Post",
                  headerRight: () => <HeaderMenu />,
                }}
              />
              <Stack.Screen
                name="Post"
                component={Post}
                options={{
                  headerBackTitle: "Back",
                  headerRight: () => <HeaderMenu />,
                }}
              />
              <Stack.Screen
                name="About"
                component={About}
                options={{
                  headerBackTitle: "Back",
                  headerRight: () => <HeaderMenu />,
                }}
              />
              <Stack.Screen
                name="Account"
                component={Account}
                options={{
                  headerBackTitle: "Back",
                  headerRight: () => <HeaderMenu />,
                }}
              />
              <Stack.Screen
                name="AdminPost"
                component={AdminPost}
                options={{
                  title: "Admin Post",
                  headerRight: () => <HeaderMenu />,
                }}
              />
              <Stack.Screen
                name="Myposts"
                component={Myposts}
                options={{
                  headerBackTitle: "Back",
                  headerRight: () => <HeaderMenu />,
                }}
              />
            </>
          )}
        </>
      ) : (
        <>
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
