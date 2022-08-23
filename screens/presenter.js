import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as SQLite from "expo-sqlite";
import moment from "moment";
export default function Presenter() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [studentId, setStudentId] = useState("");
  const db = SQLite.openDatabase("MainDB.db");
  const createTable = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS PRESENCE (STUDENTID INTEGER,DATE VARCHAR(20),PRIMARY KEY(STUDENTID, DATE));",
          [],
          (tx, results) => {
            console.log("table create succes");
          },
          (error) => {}
        );
      });
    } catch (err) {}
  };

  useEffect(() => {
    createTable();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    var date = moment(Date.now()).format("DD/MM/YYYY").toString();
    setScanned(true);
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO PRESENCE (STUDENTID, DATE) VALUES (?,?)",
        [data, date],

        (tx, results) => {
          console.log(results.rows.length);
          if (results.rowsAffected > 0) {
            Alert.alert("success", "your presence has been regested");
          }
        },
        (tx, err) => {
          Alert.alert("warning", "u aleready scanned for today");
        }
      );
    });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      <View style={styles.screen}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>scan your qr code</Text>
        </View>

        {!scanned && (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: "150%", width: "100%" }}
          />
        )}
        {scanned && (
          <View style={styles.screensContainer}>
            <View style={styles.buttonContainer}>
              <Button
                title={"Tap to Scan Again"}
                color="cadetblue"
                onPress={() => setScanned(false)}
              />
            </View>
          </View>
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
    paddingTop: "10%",
  },
  screensContainer: {
    borderRadius: 10,
    marginTop: 20,
    width: 300,
    height: 300,
    maxWidth: "80%",
    maxHeight: "70%",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    width: 100,
    marginVertical: 30,
    bottom: 0,
  },
  titleView: {
    width: "100%",
  },
  titleText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
    fontFamily: "serif",
  },
});
