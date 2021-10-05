import React, { useCallback, useLayoutEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-elements";
import { GiftedChat } from "react-native-gifted-chat";
import * as Analytics from "expo-firebase-analytics";

import { AntDesign } from "@expo/vector-icons";

import { auth, db } from "../services/firebase";

const Chat = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginHorizontal: 20 }}>
          <Avatar rounded source={{ uri: route.params.avatar }} />
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="leftcircle" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const onSend = useCallback(async (messages = []) => {
    await Analytics.logEvent("message_sent", { value: messages[0].text });

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    const { _id, createdAt, text, user } = messages[0];

    // Salva mensagem no chat do remetente
    db.collection("chats")
      .doc(auth?.currentUser?.email)
      .collection(route.params.user2)
      .add({
        _id,
        createdAt,
        text,
        user,
      });
    // Salva mensagem no chat do destinatário
    db.collection("chats")
      .doc(route.params.user2)
      .collection(auth?.currentUser?.email)
      .add({
        _id,
        createdAt,
        text,
        user,
      });
  }, []);

  useLayoutEffect(() => {
    return (
      db
        .collection("chats")
        .doc(auth?.currentUser?.email)
        .collection(route.params.user2)
        .orderBy("createdAt", "desc")
        // .limit(20) // É possível limitar o número de mensagens para as últimas 20

        // Evento que atualiza as mensagens quando há alguma alteração
        .onSnapshot((snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              _id: doc.data()._id,
              createdAt: doc.data().createdAt.toDate(),
              text: doc.data().text,
              user: doc.data().user,
            }))
          )
        )
    );
  }, [route.params.user2]);

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: auth?.currentUser?.email,
        name: auth?.currentUser?.displayName,
        avatar: auth?.currentUser?.photoURL,
      }}
    />
  );
};

export default Chat;
