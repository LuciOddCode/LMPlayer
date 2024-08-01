import * as React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import Home from "./components/Home";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VideoPlayer from "./components/VideoPlayer";

const Stack = createNativeStackNavigator();

export default function App() {


    return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            {(props)=><VideoPlayer {...props} />}
          </Stack.Navigator>
        </NavigationContainer>
    );
}

