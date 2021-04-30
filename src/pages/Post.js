import * as React from "react";
import { View } from "react-native";
import { AudioController } from '../components'

export default function Post() {
    

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <AudioController />
        </View>
    );
}
