import React, { useState, useEffect, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import DateField from "react-native-datefield";
import * as SQLite from "expo-sqlite";
import moment from "moment";
export default function AddStudent({ navigation }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bDay, setBDay] = useState("");

  const db = SQLite.openDatabase("MainDB.db");
  const createTable = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS ETUDIANT (ID INTEGER PRIMARY KEY AUTOINCREMENT, Name VARCHAR(20), LastName VARCHAR(20), BDay VARCHAR(20));",
          [],
          (tx, results) => {},
          (error) => {}
        );
      });
    } catch (err) {}
  };
  useEffect(() => {
    createTable();
  }, []);
  const setData = () => {
    if (!name || !lastName || !bDay) {
      Alert.alert("warning", "please enter your data");
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO ETUDIANT (Name, LastName, BDay) VALUES (?,?,?)",
          [name, lastName, bDay],

          (tx, results) => {
            if (results.rowsAffected > 0) {
              Alert.alert(
                "success",
                `user added successfuly his id is ${results.insertId} `,
                [{ text: "ok", onPress: () => navigation.navigate("Home") }]
              );
            }
          },
          (tx, err) => {}
        );
      });
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.AddStudent}>
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="name"
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="last name"
              value={lastName}
              style={styles.input}
              onChangeText={(text) => setLastName(text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <DateField
              styleInput={styles.inputDate}
              labelDate="day "
              labelMonth="month "
              labelYear="year"
              onSubmit={(value) =>
                setBDay(moment(value).format("DD/MM/YYYY").toString())
              }
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="add" color="cadetblue" onPress={setData} />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  AddStudent: {
    flex: 1,
    alignItems: "center",
    paddingTop: "10%",
  },

  card: {
    borderRadius: 10,
    marginTop: 20,
    width: 300,
    height: 300,
    maxWidth: "80%",

    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
    padding: 10,

    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    height: 50,
    minWidth: 100,

    marginVertical: 10,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    textAlign: "center",
  },
  inputDate: {
    height: 50,
    maxWidth: 200,
    marginVertical: 5,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
  },
  buttonContainer: {
    width: 100,
    marginVertical: 30,
    bottom: 0,
  },
});
