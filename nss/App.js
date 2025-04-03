import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./navigation";
import { StatusBar } from "react-native";
import { COLORS } from './config/constants';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={COLORS.PRIMARY} barStyle="light-content" />
      <RootNavigation />
    </NavigationContainer>
  );
}
