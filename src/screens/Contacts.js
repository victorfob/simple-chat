import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";

import { auth, db } from "../services/firebase";
import { AntDesign } from "@expo/vector-icons";

const Contacts = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);

  async function getContacts() {
    let users = [];
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();
    snapshot.forEach((doc) => {
      users.push(doc.data());
    });
    setContacts(users);
  }

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        // Sign-out successful.
        navigation.replace("Login");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  useEffect(() => {
    getContacts();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 10 }} onPress={signOut}>
          <AntDesign name="logout" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    contacts.length > 0 && (
      <FlatList
        data={contacts}
        contentContainerStyle={{ flex: 1 }}
        renderItem={({ item }) =>
          item.email !== auth?.currentUser?.email && (
            <TouchableOpacity
              style={styles.container}
              onPress={() => navigation.navigate("Chat", { user2: item.email })}
            >
              <View style={{ marginRight: 20 }}>
                <Avatar rounded source={{ uri: item.photoURL }} />
              </View>
              <Text style={styles.text}>{item.displayName}</Text>
              <View style={{ marginLeft: 30 }}>
                <AntDesign name="rightcircle" size={24} color="black" />
              </View>
            </TouchableOpacity>
          )
        }
      />
    )
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
  },
  text: { fontSize: 16, fontWeight: "bold" },
});

export default Contacts;
