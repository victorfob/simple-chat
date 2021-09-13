import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";

import { auth } from "../services/firebase";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = () => {
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      alert(error.message);
    });
  };

  useEffect(() => {
    return auth.onAuthStateChanged(function (user) {
      if (user) {
        navigation.replace("Contacts");
      } else {
        // No user is signed in.
        navigation.navigate("Login");
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter your email"
        label="Email"
        leftIcon={{ type: "material", name: "email" }}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Input
        placeholder="Enter your password"
        label="Password"
        leftIcon={{ type: "material", name: "lock" }}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <Button title="login" containerStyle={styles.button} onPress={signIn} />
      <Button
        title="register"
        containerStyle={styles.button}
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});

export default Login;
