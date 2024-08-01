import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    FlatList,
    StyleSheet,
    View,
    Text,
    StatusBar,
    PermissionsAndroid,
    Platform,
    Image,
    TouchableOpacity,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { createThumbnail } from "react-native-create-thumbnail";

async function requestStoragePermission() {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission',
                    message: 'This app needs access to your storage to read video files',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    } else {
        return true;
    }
}

export default function VideoListView({ navigation }) {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const getFiles = async () => {
            const hasPermission = await requestStoragePermission();
            if (!hasPermission) {
                console.error('Storage permission not granted');
                return;
            }

            try {
                const result = await RNFetchBlob.fs.ls('/storage/emulated/0/Download');

                const videoFiles = result.filter(file => {
                    return file.endsWith('.mp4') || file.endsWith('.mkv') || file.endsWith('.avi') || file.endsWith('.mov');

                });

                // for (let i = 0; i < videoFiles.length; i++) {
                //     const thumbnail = await createThumbnail({
                //         url: `file:///storage/emulated/0/Download/${videoFiles[i]}`,
                //         timeStamp: 10000,
                //     });

                    // videoFiles[i] = {
                    //     name: videoFiles[i],
                    //     thumbnail,
                    // };
                // }

                setFiles(videoFiles);
            } catch (e) {
                console.error(e);
            }
        };

        getFiles();
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginTop: StatusBar.currentHeight || 0,
        },
        item: {
            backgroundColor: '#c2c5cd',
            padding: 20,
            marginVertical: 8,
            marginHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
        },
        title: {
            fontSize: 16,
            flex: 1,
            marginRight: 10,
        },
        thumbnail: {
            width: 50,
            height: 50,
        },
    });

    const handlePress = (item) => {
        navigation.navigate('Player', { video: item });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handlePress(item)}>
            <View style={styles.item}>
                <Text style={styles.title}>{item.name}</Text>
                <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={files}
                renderItem={renderItem}
                keyExtractor={(item) => item}
            />
        </SafeAreaView>
    );
}
