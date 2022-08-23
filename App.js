import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./screens/home";
import SaiserLaNote from "./screens/saiserLaNote";
import Presenter from "./screens/presenter";
import AddStudent from "./screens/addStudent";
import ViewDelebirationTable from "./screens/viewTable";
import ViewStudentTable from "./screens/viewStudentTable";

const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: "make it numeric",
            headerStyle: {
              backgroundColor: "cadetblue",
            },
            headerTitleStyle: {
              fontWeight: "bold",
              fontFamily: "serif",
              textAlign: "center",
              color: "#F5F5F5",
              fontSize: 25,
            },
          }}
        />
        <Stack.Screen
          name="SaiserLaNote"
          component={SaiserLaNote}
          options={{
            title: "enter the note",
            headerStyle: {
              backgroundColor: "cadetblue",
            },
            headerTintColor: "#F5F5F5",
            headerTitleStyle: {
              fontWeight: "bold",
              fontFamily: "serif",
              fontSize: 25,
            },
          }}
        />
        <Stack.Screen
          name="presenter"
          component={Presenter}
          options={{
            title: "prove your presence",
            headerStyle: {
              backgroundColor: "cadetblue",
            },
            headerTintColor: "#F5F5F5",
            headerTitleStyle: {
              fontWeight: "bold",
              fontFamily: "serif",
              fontSize: 20,
            },
          }}
        />
        <Stack.Screen
          name="addstudent"
          component={AddStudent}
          options={{
            title: "add a student",
            headerStyle: {
              backgroundColor: "cadetblue",
            },
            headerTintColor: "#F5F5F5",
            headerTitleStyle: {
              fontWeight: "bold",
              fontFamily: "serif",
              fontSize: 25,
            },
          }}
        />
        <Stack.Screen
          name="viewDelebirationTable"
          component={ViewDelebirationTable}
          options={{
            title: " view delebiration",
            headerStyle: {
              backgroundColor: "cadetblue",
            },
            headerTintColor: "#F5F5F5",
            headerTitleStyle: {
              fontWeight: "bold",
              fontFamily: "serif",
              fontSize: 20,
            },
          }}
        />
        <Stack.Screen
          name="viewStudentTable"
          component={ViewStudentTable}
          options={{
            title: " view all students",
            headerStyle: {
              backgroundColor: "cadetblue",
            },
            headerTintColor: "#F5F5F5",
            headerTitleStyle: {
              fontWeight: "bold",
              fontFamily: "serif",
              fontSize: 20,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
