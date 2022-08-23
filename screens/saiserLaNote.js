import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { BarCodeScanner } from "expo-barcode-scanner";
export default function SaiserLaNote() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [id, setId] = useState();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bDay, setBDay] = useState("");
  const [presence, setPresence] = useState();
  const [exam, setExam] = useState();
  const [td, setTd] = useState();
  const [tp, setTp] = useState();

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
  const createPresenceTable = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS PRESENCE (STUDENTID INTEGER,DATE VARCHAR(20),FOREIGN KEY (STUDENTID) REFERENCES ETUDIANT(ID),PRIMARY KEY(STUDENTID, DATE));",
          [],
          (tx, results) => {},
          (error) => {}
        );
      });
    } catch (err) {}
  };

  useEffect(() => {
    createTable();
    createPresenceTable();
    createdELIBERAITIONTable();
  }, []);
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const handleBarCodeScanned = ({ type, data }) => {
    db.transaction((tx) => {
      setId(parseInt(data));

      tx.executeSql(
        `SELECT * FROM ETUDIANT WHERE ID=${parseInt(data)}`,
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            var name = results.rows.item(0).Name;
            var lastName = results.rows.item(0).LastName;
            var bday = results.rows.item(0).BDay;
            setName(name);
            setLastName(lastName);
            setBDay(bday);
            setId(data);
            setScanned(true);
          } else {
            Alert.alert("warning", "there is no student with that id");
          }
        },
        (tx, err) => {
          Alert.alert("warning", "there is no student with that id");
          return;
        }
      );
      tx.executeSql(
        `SELECT * FROM PRESENCE WHERE (STUDENTID = ${parseInt(data)}) `,
        [],
        (tx, results) => {
          var presence = results.rows.length;
          setPresence(presence);
        },
        (tx, results) => {}
      );
    });
  };
  const validateHandler = () => {
    if (!exam || !name || !lastName || !bDay) {
      Alert.alert("warning", "the data is incomplete");
      return;
    }
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT  INTO DELEBIRATIONFINAL (ETUDIANTID, Name, LastName, BDay, Exam,TD,TP) VALUES (?,?,?,?,?,?,?) ",
        [id, name, lastName, bDay, exam, td, tp],
        (tx, results) => {
          Alert.alert("success", "note valideted successfuly");
          setExam();
          setTd();
          setTp();
          setScanned(false);
        },
        (tx, err) => {
          Alert.alert(
            "warning",
            "this student's note has been already affected"
          );
        }
      );
    });
  };
  const HandlerDelete = () => {
    if (!id) {
      Alert.alert("warning", "no student selected");
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ETUDIANT WHERE ID=${id}`,
        [],
        (tx, results) => {
          Alert.alert("success", "student has been deleted successfuly");
        },
        (tx, err) => {}
      );
      tx.executeSql(
        `DELETE FROM DELEBIRATIONFINAL WHERE ETUDIANTID=${id}`,
        [],
        (tx, results) => {},
        (tx, err) => {}
      );
      tx.executeSql(
        `DELETE FROM PRESENCE WHERE STUDENTID=${id}`,
        [],
        (tx, results) => {
          setScanned(false);
        },
        (tx, err) => {}
      );
    });
  };
  return (
    <>
      {!scanned && (
        <View style={styles.screen}>
          <View style={styles.titleView}>
            <Text style={styles.titleText}>scan the student's qr code</Text>
          </View>

          {!scanned && (
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{ height: "150%", width: "100%" }}
            />
          )}
        </View>
      )}
      {scanned && (
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.screen}>
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
                      <TextInput style={styles.input} value={id.toString()} />
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
                        value={name + " " + lastName}
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
                      <TextInput
                        style={styles.input}
                        value={presence ? presence.toString() : "0"}
                      />
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
                        placeholder="--"
                        keyboardType="numeric"
                        maxLength={2}
                        value={exam}
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
                        value={td}
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
                        value={tp}
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
                  title="Delete student"
                  color="red"
                  onPress={() =>
                    Alert.alert(
                      "Alert",
                      "you sure you want to delete this student?",
                      [
                        {
                          text: "yes",
                          onPress: () => HandlerDelete(),
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
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: "10%",
    paddingBottom: "2%",
  },
  screensContainer: {
    borderRadius: 10,
    marginTop: "5%",
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
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5,
  },
  input: {
    textAlign: "center",

    height: "100%",
  },
  buttonsContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    paddingTop: 10,
    marginTop: 5,
    bottom: "1%",
  },
  button: {
    width: "47%",
  },
  titleView: {
    width: "100%",
  },
  titleText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    fontFamily: "serif",
  },
});
