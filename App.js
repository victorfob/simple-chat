import React, { useEffect } from "react";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Updates from "expo-updates";
import * as Analytics from "expo-firebase-analytics";

import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import Contacts from "./src/screens/Contacts";
import Chat from "./src/screens/Chat";

const Stack = createNativeStackNavigator();

export default function App() {
  async function updateApp() {
    const { isAvailable } = await Updates.checkForUpdateAsync();

    if (isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  }

  async function test() {
    await Analytics.setDebugModeEnabled(true);
  }

  useEffect(() => {
    if (!__DEV__) updateApp();
    else test();
    LogBox.ignoreLogs(["Setting a timer"]);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Contacts" component={Contacts} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
