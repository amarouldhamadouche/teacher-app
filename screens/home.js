import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import * as SQLite from "expo-sqlite";
export default function Home({ navigation }) {
  return (
    <>
      <View style={styles.screen}>
        <View style={styles.screensContainer}>
          <View style={styles.screensOptions}>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate("SaiserLaNote");
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                }}
              >
                <Image
                  style={styles.backgroundImage}
                  source={require("../assets/saiserLaNote.jpeg")}
                ></Image>
                <View style={styles.button}>
                  <Text style={{ fontFamily: "serif", fontSize: 15 }}>
                    seize the note
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.screensOptions}>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate("presenter");
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                }}
              >
                <Image
                  style={styles.backgroundImage}
                  source={require("../assets/RaiseHand.jpg")}
                ></Image>
                <View style={styles.button}>
                  <Text
                    style={{
                      fontFamily: "serif",
                      fontSize: 15,
                      color: "black",
                    }}
                  >
                    presence
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.screensOptions}>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate("addstudent");
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                }}
              >
                <Image
                  style={styles.backgroundImage}
                  source={require("../assets/203-2033054_plus-and-minus-icon-png.png")}
                ></Image>
                <View style={styles.button}>
                  <Text
                    style={{
                      fontFamily: "serif",
                      fontSize: 15,
                      color: "black",
                    }}
                  >
                    add a student
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.screensOptions}>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate("viewDelebirationTable");
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                }}
              >
                <Image
                  style={styles.backgroundImage}
                  source={require("../assets/database-table-icon-14.jpg")}
                ></Image>
                <View style={styles.button}>
                  <Text
                    style={{
                      fontFamily: "serif",
                      fontSize: 15,
                      color: "black",
                    }}
                  >
                    generate
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,

    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingTop: "10%",
  },
  screensContainer: {
    borderRadius: 10,
    marginTop: 20,
    width: "80%",
    height: "80%",

    padding: 20,
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  header: {
    top: 0,
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
  },
  headerWrapper: {
    backgroundColor: "cadetblue",
    width: "100%",
    height: "100%",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 30,
    fontFamily: "serif",
  },
  screensOptions: {
    position: "relative",
    height: "46%",
    width: "46%",
    borderRadius: 10,
    alignItems: "center",
    margin: 6,
    paddingBottom: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: "#F5F5F5",
  },
  backgroundImage: {
    maxWidth: "100%",

    maxHeight: "90%",
    backgroundColor: "white",
    opacity: 1,
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  button: {
    opacity: 1,

    width: "100%",
    height: "17%",
    bottom: 0,
    borderRadius: 10,
    alignItems: "center",
    padding: 0,
  },
});
