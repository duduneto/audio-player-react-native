import React from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Audio } from 'expo-av';
import PropTypes from 'prop-types';

const width = Dimensions.get('screen').width;

const AudioController = () => {

    const [isPlaying, setIsPlaying] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [startByte, setStartByte] = React.useState(0);
    const [sizeTrack, setSizeTrack] = React.useState(0);
    const [trackItem, setTrackItem] = React.useState();
    const [currentTrackMinute, setCurrentTrackMinute] = React.useState('00:00');
    const [initialTrackState, setInitialTrackState] = React.useState({
        progressUpdateIntervalMillis: 500,
        positionMillis: 0,
        shouldPlay: false,
        rate: 1.0,
        shouldCorrectPitch: false,
        volume: 1.0,
        isMuted: false,
        isLooping: false,
    });

    const millisToMinutesAndSeconds = (millis) => {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    const handlePlay = async () => {
        console.log('Play')
        await trackItem.playAsync();
        setLoading(false);
        setIsPlaying(true);
    }
    const handlePause = async () => {
        console.log('pause')
        await trackItem.pauseAsync();
        setIsPlaying(false);
    }

    const loadSound = async (_startByte, reset) => {
        try {
            setLoading(true);
            await trackItem.stopAsync();
            trackItem.setPositionAsync(parseInt(_startByte))
            if (!!isPlaying) {
                await trackItem.playAsync();
            }
            setLoading(false)
        } catch (error) {
            console.log('Error => ', error)
        }
    }
    const startLoadSound = async (_startByte) => {
        try {
            Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: true,
                interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
                playThroughEarpieceAndroid: true
             });
            const { sound } = await Audio.Sound.createAsync(
                { uri: 'http://192.168.2.13:3000/storage_audio' },
                initialTrackState
            );
            const status = await sound.getStatusAsync();
            console.log('status => ', status)
            setSizeTrack(status.durationMillis)
            setTrackItem(sound);
        } catch (error) {
            console.log('Error => ', error)
        }
    }

    const handleSlider = (valueByte) => {
        loadSound(valueByte, true);
        setStartByte(valueByte);
        setCurrentTrackMinute(millisToMinutesAndSeconds(parseInt(valueByte)));
    }

    React.useEffect(() => {
        startLoadSound(0);
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.sliderContainer} >
                <Text>{currentTrackMinute}</Text>
                <Slider
                    style={{ width: width - 100, height: 64 }}
                    minimumValue={0}
                    maximumValue={sizeTrack}
                    minimumTrackTintColor="#000"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#C4C4C4"
                    value={startByte}
                    onSlidingComplete={handleSlider}
                />
                <Text>{millisToMinutesAndSeconds(sizeTrack)}</Text>
            </View>
            {
                trackItem === undefined || !!loading ?
                    <ActivityIndicator size="large" color="#000" />
                    :
                    <View style={styles.playerContainer}>
                        {
                            !isPlaying ?
                                <TouchableOpacity onPress={handlePlay}>
                                    <Icon name="play" size={30} color="#000" />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={handlePause}>
                                    <Icon name="pause" size={30} color="#000" />
                                </TouchableOpacity>
                        }
                    </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 144,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    playerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bigBlue: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 30,
    },
    red: {
        color: 'red',
    },
});

AudioController.prototype = {
}


export default AudioController;