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
export default function ViewDelebirationTable({ navigation }) {
  const [data, setData] = useState([]);
  const db = SQLite.openDatabase("MainDB.db");
  const [update, setUpdate] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [LastName, setLastName] = useState("");
  const [presence, setPresence] = useState("");
  const [exam, setExam] = useState();
  const [td, setTd] = useState();
  const [tp, setTp] = useState();
  const [bDay, setBDay] = useState("");
  const createPresenceTable = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS PRESENCE (STUDENTID INTEGER,DATE VARCHAR(20),PRIMARY KEY(STUDENTID, DATE));",
          [],
          (tx, results) => {},
          (error) => {}
        );
      });
    } catch (err) {}
  };
  const createdELIBERAITIONTable = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS DELEBIRATIONFINAL (ID INTEGER PRIMARY KEY AUTOINCREMENT,ETUDIANTID INTEGER UNIQUE,Name VARCHAR(20),LastName VARCHAR(20),BDay VARCHAR(20),Exam INTERGER,TD INTERGER,TP INTERGER);",
          [],
          (tx, results) => {},
          (err) => {}
        );
      });
    } catch (err) {}
  };
  const getData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM DELEBIRATIONFINAL",
        [],
        (tx, results) => {
          var row = results.rows._array;

          setData([...row]);
        },

        (tx, err) => {}
      );
    });
  };
  const validateHandler = () => {
    if (!exam) {
      Alert.alert("warning", "enter the exam note");
    }
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE DELEBIRATIONFINAL SET Exam =${exam}, TD =${td}, TP=${tp} WHERE ETUDIANTID=${studentId} `,
        [],
        (tx, results) => {
          getData();
          Alert.alert("success", "the apdate has affected successfuly", [
            { text: "ok", onPress: () => setUpdate(false) },
          ]);
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
        (tx, results) => {
          Alert.alert("success", "row deleted successfuly", [
            { title: "ok", onPress: () => getData() },
          ]);
        },
        (tx, err) => {}
      );
    });
  };
  const HandlerUpdate = (id) => {
    setUpdate(true);
    var d = data.filter((D) => {
      if (D.ETUDIANTID === id) {
        return D;
      }
    });
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM PRESENCE WHERE STUDENTID=${id}`,
        [],
        (tx, results) => {
          setPresence(results.rows.length);
        },
        (tx, err) => {}
      );
    });

    setStudentId(d[0].ETUDIANTID);
    setName(d[0].Name);
    setLastName(d[0].LastName);
    setExam(d[0].Exam);
    setTd(d[0].TD);
    setTp(d[0].TP);
    setBDay(d[0].BDay);
    console.log(d);
  };
  useEffect(() => {
    createdELIBERAITIONTable();
    getData();
    createPresenceTable();
  }, []);
  const exportHandler = () => {};
  return (
    <>
      <View style={styles.screen}>
        {!update && (
          <>
            <ScrollView style={{ width: "100%" }}>
              <View
                style={{
                  width: "100%",
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
                      backgroundColor: "white",
                      opacity: 0.8,
                    }}
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
                  </View>
                  <View
                    style={{
                      width: "49%",
                      borderTopRightRadius: 40,
                      borderBottomRightRadius: 40,
                      marginRight: 5,
                      height: "100%",
                      padding: "3%",
                      backgroundColor: "#F5F5F5",
                    }}
                  >
                    <TouchableWithoutFeedback
                      onPress={() => {
                        navigation.navigate("viewStudentTable");
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
                    </TouchableWithoutFeedback>
                  </View>
                </View>
                <View style={styles.tableHeader}>
                  <Text style={styles.headerId}>ID</Text>
                  <Text style={styles.headerFullName}>FullName</Text>
                  <Text style={styles.headerExam}>Exam</Text>
                  <Text style={styles.headerTd}>TD</Text>
                  <Text style={styles.headerTp}>TP</Text>
                  <View style={styles.buttonContainer}></View>
                </View>
                {data.length > 0 &&
                  data.map((d) => (
                    <View style={styles.item} key={d.ETUDIANTID}>
                      <View
                        style={{
                          width: "100%",

                          flexDirection: "row",
                        }}
                      >
                        <Text style={styles.id}>{d.ETUDIANTID}</Text>
                        <Text style={styles.fullName}>
                          {d.Name} {d.LastName}
                        </Text>
                        <Text style={styles.exam}>{d.Exam}</Text>
                        <Text style={styles.td}>{d.TD || "null"}</Text>
                        <Text style={styles.tp}>{d.TP || "null"}</Text>
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
                          icon="update"
                          color="cadetblue"
                          onPress={() => HandlerUpdate(d.ETUDIANTID)}
                        />
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
                                  onPress: () => HandlerDelete(d.ETUDIANTID),
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
              </View>
               </ScrollView>
          </>
        )}
        {update && (
          <>
            <View style={styles.screensContainer}>
              <ScrollView>
                <View style={styles.title}>
                  <Text style={styles.titleText1}>Student Information </Text>
                </View>
                <View style={styles.infoContainer}>
                  <View style={styles.infoItem}>
                    <Text style={{ fontSize: 17, fontFamily: "serif" }}>
                      ID
                    </Text>
                    <View
                      style={{
                        width: "70%",
                        height: 20,
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.input}>{studentId} </Text>
                    </View>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={{ fontSize: 17, fontFamily: "serif" }}>
                      FullName
                    </Text>
                    <View
                      style={{
                        width: "70%",
                        height: 20,
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        style={styles.input}
                        value={name + " " + LastName}
                      />
                    </View>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={{ fontSize: 17, fontFamily: "serif" }}>
                      BirthDay
                    </Text>
                    <View
                      style={{
                        width: "70%",
                        height: 20,
                        alignItems: "center",
                      }}
                    >
                      <TextInput style={styles.input} value={bDay} />
                    </View>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={{ fontSize: 17, fontFamily: "serif" }}>
                      Presence
                    </Text>
                    <View
                      style={{
                        width: "70%",
                        height: 20,
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.input}>{presence}</Text>
                    </View>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={{ fontSize: 17, fontFamily: "serif" }}>
                      Exam
                    </Text>
                    <View
                      style={{
                        width: "70%",
                        height: 20,
                        alignItems: "center",
                        right: 0,
                      }}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="-"
                        keyboardType="numeric"
                        maxLength={2}
                        value={exam.toString()}
                        onChangeText={(value) => setExam(value)}
                      />
                    </View>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={{ fontSize: 17, fontFamily: "serif" }}>
                      TD
                    </Text>
                    <View
                      style={{
                        width: "70%",
                        height: 20,
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        maxLength={2}
                        placeholder="--"
                        value={td && td.toString()}
                        onChangeText={(value) => setTd(value)}
                      />
                    </View>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={{ fontSize: 17, fontFamily: "serif" }}>
                      TP
                    </Text>
                    <View
                      style={{
                        width: "70%",
                        height: 20,
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="--"
                        keyboardType="numeric"
                        maxLength={2}
                        value={tp && tp.toString()}
                        onChangeText={(value) => setTp(value)}
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
            <View style={styles.buttonsContainer}>
              <View style={styles.button}>
                <Button
                  title="Validate"
                  color="cadetblue"
                  onPress={validateHandler}
                />
              </View>
              <View style={styles.button}>
                <Button
                  title="cancel"
                  color="red"
                  onPress={() => setUpdate(false)}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
    shadowOffset: { width: 0, height: 2 },
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
  headerExam: {
    width: "13%",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: "serif",
  },
  headerTd: {
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: "serif",
    width: "10%",
    textAlign: "center",
  },
  headerTp: {
    width: "10%",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: "serif",
  },
  id: {
    width: "10%",
  },
  fullName: { width: "60%", textAlign: "center" },
  exam: { width: "13%", textAlign: "center" },
  td: { width: "10%", textAlign: "center" },
  tp: { width: "10%", textAlign: "center" },
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

  screensContainer: {
    borderRadius: 10,
    marginVertical: "10%",
    width: 400,
    height: 300,
    maxWidth: "90%",
    maxHeight: "80%",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,

    alignItems: "center",
    padding: 5,
  },
  title: {
    borderBottomWidth: 0.5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 20,
    padding: 5,
    width: "100%",
  },
  titleText1: {
    fontSize: 20,
    fontFamily: "serif",
    textAlign: "center",
  },
  infoContainer: {
    width: "100%",
    marginTop: 10,
  },
  buttonsContainer: {
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    paddingTop: 10,
    marginTop: 5,
    bottom: "10%",
  },
  button: {
    width: "40%",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5,
  },
  input: {
    textAlign: "center",

    height: "100%",
  },
});
