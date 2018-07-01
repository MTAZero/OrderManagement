import React, {Component} from 'react';
import {Text, View } from 'react-native';
import RNGooglePlaces from 'react-native-google-places';

import {Input, Item} from 'native-base';
import MapView,{Marker} from 'react-native-maps';

const GOOGLE_MAPS_APIKEY = 'AIzaSyAPYoGZt-UG4-URgqc1xFW5xWLvk4VLfzE';

export default class AddComponent extends Component{

    constructor(props){
        super(props);

        this.state={
            mapPosition: {
                latitude: 21.037649, 
                longitude: 105.7816119
            }
        };
    }

    getAddressPredictions = () =>{

        let userInput = "Đồng Văn";
        RNGooglePlaces.getAutocompletePredictions(userInput
        )
        .then((results)=>{
            console.log(results);
            return results;
        })
        .catch((error)=> console.log(error.message));
    }

    render(){
        this.getAddressPredictions();
        return (
            <View>
                <Text style={{color:'black', fontWeight:'bold', fontSize:35, textAlign:'center', marginBottom: 10}}>
                    ADD CUSTOMER
                </Text>
                
                <Item style={{borderColor: 'black', borderWidth: 1, backgroundColor:'lightgray'}}>
                    <Input placeholder='Enter Address' />
                </Item>

                <MapView 
                        initialRegion={{
                            latitude: this.state.mapPosition.latitude,
                            longitude: this.state.mapPosition.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        region = {{
                            latitude: this.state.mapPosition.latitude,
                            longitude: this.state.mapPosition.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421
                        }}
                        showsUserLocation = {true}
                        style = {{width: "100%", height: 250, borderRadius: 5, borderColor:'black', borderWidth: 10}}
                    >
                </MapView>
                
            </View>
        );
    }
}