import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {ResizeMode, Video} from 'expo-av';
import * as Network from 'expo-network';
import {useLocalSearchParams, useNavigation, useRouter} from "expo-router";

export default function VideoScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [videoUri, setVideoUri] = useState('https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4');
    const navigation = useNavigation();
    const router = useRouter();
    const {uri} = useLocalSearchParams();


    useEffect(() => {
        if (uri) {
            setVideoUri(uri);
        }
        const checkNetwork = async () => {
            const {isConnected} = await Network.getNetworkStateAsync();
            if (!isConnected) {
                setError('No internet connection available');
                setIsLoading(false);
            }
        };
        checkNetwork();

    }, [uri]);

    const handlePlaybackStatusUpdate = (status) => {
        if (status.isLoaded) {
            setIsLoading(false);
        } else if (status.error) {
            setError(status.error);
        }
    };

    return (
        <View style={styles.container}>
            {isLoading && (
                <View style={styles.bufferingContainer}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            )}
            {error && (
                <Text style={styles.errorText}>Error: {error.message}</Text>
            )}

            <Video
                source={{uri: videoUri}}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                isLooping
                useNativeControls={true}
                onLoadStart={() => console.log('Loading video')}
                onLoad={() => console.log('Video loaded')}
                style={styles.video}
                onError={(error) => console.error('Video error:', error)}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                onFullscreenUpdate={(status) => {

                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: 300,
        paddingTop: 0,
        top: 0,
    },
    bufferingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    errorText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'rgba(255,0,0,0.5)',
        padding: 10,

    }
});
