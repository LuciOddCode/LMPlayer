import React from 'react';
import { View } from 'react-native';
import { Video } from 'expo-av';

export default function VideoPlayer({ route }) {
    const { video } = route.params;
    return (
        <View style={styles.container}>
            <Video
                source={{ uri: `file://${RNFetchBlob.fs.dirs.DownloadDir}/${video}` }}
                style={styles.video}
                controls={true}
            />
        </View>
    );
}
