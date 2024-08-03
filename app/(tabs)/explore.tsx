import React, { useEffect, useState } from "react";
import { Button, Image, StyleSheet, TextInput, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from "expo-router";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

interface FileUri {
    uri: string;
    name: string;
}

export default function TabTwoScreen() {
    const photoList = useState([]);
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);




    useEffect(() => {
        async function getPhotos() {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
                const assets = await MediaLibrary.getAssetsAsync({
                    mediaType: MediaLibrary.MediaType.photo,
                });
                const uris = assets.assets.map(asset => asset.uri);
                const names = assets.assets.map(asset => asset.filename);
                const fileUrisArray = uris.map((uri, index) => ({ uri, name: names[index] }));
                photoList[1](fileUrisArray);
            } else {
                console.log('Permission not granted!');
            }
        }

            getPhotos();

    }, []);

    function viewEnlargedImage(uri: string) {
        console.log('Viewing enlarged image...');
        setImage(uri);
    //     render a modal with the image
        return (
            <View style={styles.container}>
                <Image source={{ uri: image }} style={styles.image} />
            </View>
        );

    }


    return (
        <ParallaxScrollView
            headerBackgroundColor={{light: '#a200ff', dark: '#1D3D47'}}
            headerImage={<Image source={require('@/assets/images/logo.png')} style={styles.reactLogo}/>}>

            <ThemedView style={styles.container}>
                {
                    photoList[0].map((photo, index) => (
                        <View style={styles.itemContainer} key={index}>
                            <Image  source={{ uri: photo.uri }} style={styles.image} />
                        </View>
                    ))
                }
            </ThemedView>

        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#808080',
        textAlign: 'center',
        top: -90,
        position: 'absolute',
        left: 0,
        right: 0
    },
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    reactLogo: {
        height: 180,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        padding: 8,

    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,


    },
    itemContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 8,
        backgroundColor: '#e3b3ff',
        overflow: 'hidden',
        height: 116,
        width: 116,

    },
});
