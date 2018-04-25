import React,{Component} from 'react';
import MapView from 'react-native-maps';
import {Text, View} from 'react-native';

import CallApi from './API/ExampleCallApi'

export default class MainComponent extends Component{
    render() {
        // return (
        //     <View>
        //         <Text style={{color:'red'}}>Main</Text>
        //         <MapView
        //             initialRegion={{
        //             latitude: 37.78825,
        //             longitude: -122.4324,
        //             latitudeDelta: 0.0922,
        //             longitudeDelta: 0.0421,
        //         }}

        //             style = {{width: "100%", height: 400}}
        //         />
        //     </View>
        // );

        return (
            <CallApi />
        );
    }
}