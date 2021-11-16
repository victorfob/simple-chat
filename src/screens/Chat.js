import React, {
  useCallback,
  useLayoutEffect,
  useEffect,
  useState,
} from "react";
import { View, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-elements";
import { GiftedChat } from "react-native-gifted-chat";
import * as Analytics from "expo-firebase-analytics";

import { AntDesign } from "@expo/vector-icons";

import { auth, db } from "../services/firebase";

const Chat = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [timer, setTimer] = useState(0);

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

    console.log(messages);

    // const { _id, createdAt, text, user } = messages[0];

    let interval = setInterval(() => {
      setTimer((previous) => previous + 0.1);
    }, 100);

    const array = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
      40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
      58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75,
      76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93,
      94, 95, 96, 97, 98, 99, 100,
    ];

    const results = array.map(async (value) => {
      let _id = "22345" + value,
        createdAt = new Date(),
        text = "teste 2 - " + value,
        user = {
          _id: "victor.brayner@hotmail.com",
          avatar: "https://www.trackergps.com/canvas/images/icons/avatar.jpg",
          name: "Victor Brayner",
        };

      // Salva mensagem no chat do remetente
      await db
        .collection("chats")
        .doc(auth?.currentUser?.email)
        .collection(route.params.user2)
        .add({
          _id,
          createdAt,
          text,
          user,
        });
      // Salva mensagem no chat do destinatário
      await db
        .collection("chats")
        .doc(route.params.user2)
        .collection(auth?.currentUser?.email)
        .add({
          _id,
          createdAt,
          text,
          user,
        });
    });
    await Promise.all(results);
    clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log(timer);
  }, [timer]);

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
