import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from "react-native";
import { FAB } from "react-native-paper";
import * as SQLite from "expo-sqlite";
export default function ViewStudentTable({ navigation }) {
  const [data, setData] = useState([]);
  const db = SQLite.openDatabase("MainDB.db");

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS ETUDIANT (ID INTEGER PRIMARY KEY AUTOINCREMENT, Name VARCHAR(20), LastName VARCHAR(20), BDay VARCHAR(20));",
        [],
        (tx, results) => {},
        (error) => {}
      );

      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS DELEBIRATIONFINAL (ID INTEGER PRIMARY KEY AUTOINCREMENT,ETUDIANTID INTEGER UNIQUE,Name VARCHAR(20),LastName VARCHAR(20),BDay VARCHAR(20),Exam INTERGER,TD INTERGER,TP INTERGER);",
        [],
        (tx, results) => {},
        (err) => {}
      );
    });
  };
  const deleteAllHandler = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "DROP TABLE IF EXISTS ETUDIANT",
        [],
        (tx, results) => {
          Alert.alert("success", "db is clean now");
        },
        (tx, err) => {}
      );
      tx.executeSql(
        "DROP TABLE IF EXISTS DELEBIRATIONFINAL",
        [],
        (tx, results) => {
          Alert.alert("success", "db is clean now");
          setData([]);
        },

        (tx, err) => {}
      );
      tx.executeSql(
        "DROP TABLE IF EXISTS PRESENCE",
        [],
        (tx, results) => {},
        (tx, err) => {}
      );
    });
  };
  const getData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM ETUDIANT",
        [],
        (tx, results) => {
          var rows = results.rows._array;
          setData([...rows]);
        },
        (tx, err) => {}
      );
    });
  };
  const HandlerDelete = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM DELEBIRATIONFINAL WHERE ETUDIANTID = ${id}`,
        [],
        (tx, results) => {},
        (tx, err) => {}
      );
      tx.executeSql(
        `DELETE FROM ETUDIANT WHERE ID =${id}`,
        [],
        (tx, results) => {
          Alert.alert("success", "row deleted successfuly", [
            { title: "ok", onPress: () => getData() },
          ]);
        }
      );
    });
  };

  useEffect(() => {
    getData();
    createTable();
  }, []);
  useEffect(() => {});
  if (data.length < 1) {
    return (
      <View style={styles.screen}>
        <View
          style={{
            height: "30%",
            alignItems: "center",

            marginVertical: "1%",
          }}
        >
          <View style={styles.header}>
            <View
              style={{
                borderBottomLeftRadius: 40,
                borderTopLeftRadius: 40,
                marginLeft: 3,

                width: "50%",
                height: "100%",
                padding: "3%",
                backgroundColor: "#F5F5F5",
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => navigation.navigate("viewDelebirationTable")}
              >
                <Text
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontFamily: "serif",
                    fontWeight: "bold",
                  }}
                >
                  Delebiration
                </Text>
              </TouchableWithoutFeedback>
            </View>
            <View
              style={{
                width: "49%",
                borderTopRightRadius: 40,
                borderBottomRightRadius: 40,
                marginRight: 5,
                height: "100%",
                padding: "3%",

                backgroundColor: "white",
                opacity: 0.8,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "serif",
                  fontWeight: "bold",
                }}
              >
                Students
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: "50%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>there is no student</Text>
        </View>
      </View>
    );
  }
  return (
    <>
      <View style={styles.screen}>
        <>
          <ScrollView style={{ width: "100%", height: "100%" }}>
            <View
              style={{
                height: "100%",
                alignItems: "center",

                marginVertical: "1%",
              }}
            >
              <View style={styles.header}>
                <View
                  style={{
                    borderBottomLeftRadius: 40,
                    borderTopLeftRadius: 40,
                    marginLeft: 3,

                    width: "50%",
                    height: "100%",
                    padding: "3%",
                    backgroundColor: "#F5F5F5",
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate("viewDelebirationTable")}
                  >
                    <Text
                      style={{
                        width: "100%",
                        textAlign: "center",
                        fontFamily: "serif",
                        fontWeight: "bold",
                      }}
                    >
                      Delebiration
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
                <View
                  style={{
                    width: "49%",
                    borderTopRightRadius: 40,
                    borderBottomRightRadius: 40,
                    marginRight: 5,
                    height: "100%",
                    padding: "3%",

                    backgroundColor: "white",
                    opacity: 0.8,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "serif",
                      fontWeight: "bold",
                    }}
                  >
                    Students
                  </Text>
                </View>
              </View>
              <View style={styles.tableHeader}>
                <Text style={styles.headerId}>ID</Text>
                <Text style={styles.headerFullName}>FullName</Text>
                <Text style={styles.headerBDay}>birthDay</Text>
              </View>
              {data.length > 0 &&
                data.map((d) => (
                  <View style={styles.item} key={d.ID}>
                    <View
                      style={{
                        width: "100%",

                        flexDirection: "row",
                      }}
                    >
                      <Text style={styles.id}>{d.ID}</Text>
                      <Text style={styles.fullName}>
                        {d.Name} {d.LastName}
                      </Text>
                      <Text style={styles.BDay}>{d.BDay}</Text>
                    </View>
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <FAB
                        style={styles.fab}
                        small
                        icon="delete"
                        color="red"
                        onPress={() =>
                          Alert.alert(
                            "Alert",
                            "you sure you want to delete this row?",
                            [
                              {
                                text: "yes",
                                onPress: () => HandlerDelete(d.ID),
                              },
                              {
                                text: "cancel",

                                style: "cancel",
                              },
                            ],
                            { cancelable: true }
                          )
                        }
                      />
                    </View>
                  </View>
                ))}
              <View style={{ width: "50%", marginVertical: 5, bottom: "0%" }}>
                <Button
                  title="delete all students"
                  color="red"
                  onPress={() =>
                    Alert.alert(
                      "Alert",
                      "you sure you want to delete the database?",
                      [
                        {
                          text: "yes",
                          onPress: () => deleteAllHandler(),
                        },
                        {
                          text: "cancel",

                          style: "cancel",
                        },
                      ],
                      { cancelable: true }
                    )
                  }
                />
              </View>
            </View>
          </ScrollView>
        </>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    marginTop: "5%",
    paddingVertical: "0%",
    paddingHorizontal: "0%",
    borderRadius: 40,
    shadowColor: "black",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
    width: "90%",
    marginBottom: "10%",
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: "2%",
    paddingHorizontal: "3%",
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
    width: "90%",
    margin: 5,
  },
  headerId: {
    width: "10%",
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: "serif",
  },
  headerFullName: {
    width: "60%",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: "serif",
  },
  headerBDay: {
    width: "30%",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: "serif",
  },

  id: {
    width: "10%",
  },
  fullName: { width: "60%", textAlign: "center" },
  BDay: { width: "30%", textAlign: "center" },
  fab: { margin: 5, backgroundColor: "#fff" },
  item: {
    paddingTop: "5%",
    paddingBottom: "2%",
    paddingHorizontal: "3%",
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
    width: "90%",
    margin: 5,
  },
});
