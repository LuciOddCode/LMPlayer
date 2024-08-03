import React, { useEffect, useState } from "react";
import { Button, Image, StyleSheet, TextInput, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from "expo-router";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';

interface FileUri {
    uri: string;
    name: string;
}

export default function HomeScreen() {
    const navigation = useNavigation();
    const [url, setUrl] = useState('');
    const [fileUris, setFileUris] = useState([] as FileUri[]);
    const [thumbnail, setThumbnail] = useState(null);
    const [downloadProgress, setDownloadProgress] = useState('0/0');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getFiles() {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
                const assets = await MediaLibrary.getAssetsAsync({
                    mediaType: MediaLibrary.MediaType.video,
                });
                const uris = assets.assets.map(asset => asset.uri);
                const names = assets.assets.map(asset => asset.filename);
                const fileUrisArray = uris.map((uri, index) => ({ uri, name: names[index] }));
                setFileUris(fileUrisArray);
            } else {
                console.log('Permission not granted!');
            }
        }

        getFiles();

        const checkNetwork = async () => {
            const { isConnected } = await Network.getNetworkStateAsync();
            if (!isConnected) {
                setError('No internet connection available');
                setIsLoading(false);
                alert('No internet connection available');
            }
        };

        checkNetwork();
    }, []);

    async function downloadVid() {
        console.log('Downloading video...');
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission not granted!');
            return;
        } else {
            console.log('Permission granted!');
        }

        const downloadResumable = FileSystem.createDownloadResumable(
            url,
            FileSystem.documentDirectory +'/'+ Date.now() + '.mp4',
            {},
            (downloadProgress) => {
                const progress = `${downloadProgress.totalBytesWritten/1000000}MB/${downloadProgress.totalBytesExpectedToWrite/1000000}MB`;
                setDownloadProgress(progress);
            }
        );

        try {
            const { uri } = await downloadResumable.downloadAsync();
            console.log('Finished downloading to', uri);
            const asset = await MediaLibrary.createAssetAsync(uri);
           /* const album = await MediaLibrary.getAlbumAsync('Download');
            if (album === null) {
                await MediaLibrary.createAlbumAsync('Download', asset, false);
            } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            }*/

      /*      const assets = await MediaLibrary.getAssetsAsync({
                mediaType: MediaLibrary.MediaType.video,
            });
            const uris = assets.assets.map(asset => asset.uri);
            const names = assets.assets.map(asset => asset.filename);
            const newFileUris = uris.map((uri, index) => ({ uri, name: names[index] }));*/


        } catch (e) {
            console.error('Error downloading file', e);
        }
    }

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#a200ff', dark: '#1D3D47' }}
            headerImage={<Image source={require('@/assets/images/logo.png')} style={styles.reactLogo} />}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Welcome to Hell!</ThemedText>
            </ThemedView>
            <TextInput
                onChangeText={setUrl}
                allowFontScaling={true}
                placeholder="Enter the URL"
                style={{ borderWidth: 1, borderColor: 'black', padding: 10, margin: 10 }}
            />
            <ThemedText>{downloadProgress}</ThemedText>
            <Button title="Download" onPress={downloadVid} />

            <View style={styles.stepContainer}>
                {fileUris.map((fileUri, index) => (
                    <View key={index} style={styles.itemContainer}>
                        <Image source={{ uri: fileUri.uri }} style={{ width: 30, height: 30, marginStart: 5 }} />
                        <ThemedText
                            style={styles.item}
                            onPress={() => navigation.navigate('VideoScreen', { uri: fileUri.uri })}
                        >
                            {fileUri.name}
                        </ThemedText>
                    </View>
                ))}
            </View>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 180,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    item: {
        padding: 10,
        margin: 2,
        height: 40,
        width: '100%',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#e3b3ff',
        overflow: 'hidden',
        height: 50,
    },
});
