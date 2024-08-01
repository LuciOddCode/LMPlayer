import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet,  View,useWindowDimensions  } from 'react-native';
import { TabView , SceneMap} from 'react-native-tab-view';
import VideoListView from "./VideoListView";
import ImageListView from "./ImageListView";


const FirstRoute = () => (
    <VideoListView/>
);

const SecondRoute = () => (
    <ImageListView/>
);

const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
});

export default function Home(props) {

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Video' },
        { key: 'second', title: 'Photo' },
    ]);


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
});


