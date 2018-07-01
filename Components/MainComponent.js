import React,{Component} from 'react';
import MapView,{Marker} from 'react-native-maps';

// UI
import {Text, View, ScrollView, TouchableOpacity} from 'react-native';
import {Card, Container, Button} from 'native-base';

// Function
import ApiHelper from './API/api'
import MapViewDirections from 'react-native-maps-directions';

// data 
import data from './API/customer.json';
 
const destination = {latitude: 21.0480817,longitude: 105.8012362};
const GOOGLE_MAPS_APIKEY = 'AIzaSyAPYoGZt-UG4-URgqc1xFW5xWLvk4VLfzE';

export default class MainComponent extends Component{

    constructor(props){
        super(props);
        this.state= {
            listPosition:[

            ],
            stringList: 'nothing',
            directions: [

            ],
            indexDirections: 0,
            mapPosition: {
                latitude: 21.037649, 
                longitude: 105.7816119
            }
        };
    }

    callServer = async () => {
        var ans = await ApiHelper.getList(data);
        
        console.log("Ans : ", ans);

        var directions = [];
        var positions = ans;
        for(var i = 0; i<ans.length-1; i++){
            var origin = positions[i];
            var destination = positions[i+1];
            var item = {
                origin: origin,
                destination: destination,
                index: i
            };
            directions = directions.concat(item);
        }
        this.setState({stringList: JSON.stringify(ans), listPosition: positions, directions: directions, indexDirections: 0});
        this.ChangeIndexDirections(0);
        //console.log(this.state.directions);
    }

    ChangeIndexDirections = (index) => {
        if (index<0 || index>this.state.directions.length) return;
        if (this.state.directions.length == 0) return;
        
        var item = this.state.directions[index].origin;
        this.setState(
            {
                indexDirections: index, 
                mapPosition: {
                    latitude: item.latitude, 
                    longitude: item.longitude
                }
            }
        );
    }

    render() {
        // return (
        //     <CallApi />
        // );

        return(
            <Container>
                <Card style={{padding: 5}}>
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
                        style = {{width: "100%", height: 300, borderRadius: 5, borderColor:'black', borderWidth: 1}}
                    >
                        {
                            this.state.listPosition.map((item, index) => {
                                var color = "black";
                                if (index == this.state.indexDirections) color="red";
                                if (index == this.state.indexDirections+1) color="green";
                                return (
                                    <Marker
                                        coordinate={{latitude: item.latitude, longitude: item.longitude}}
                                        title={item.customerID}
                                        description=""
                                        pinColor= {color}
                                        key = {item.customerID}
                                    >
                                        <View style={{backgroundColor: color, height: 20, width: 20, borderRadius: 5}}>
                                            <Text style={{color: 'white', textAlign: 'center'}}>{item.customerID}</Text>
                                        </View>
                                    </Marker>
                                );
                             } )
                        }

                        {
                            this.state.directions.map( (item, index) => {
                                return (
                                    <MapViewDirections 
                                        origin={item.origin}
                                        destination={item.destination}
                                        apikey= {GOOGLE_MAPS_APIKEY}
                                        strokeWidth={(index == this.state.indexDirections) ? 2 : 2}
                                        strokeColor={(index == this.state.indexDirections) ? "red" : "black"}
                                        key = {index}
                                    />
                                );
                            })
                        }
                    </MapView>

                    <Button primary full style= {{margin: 10, padding: 5}} onPress={() => this.callServer()}>
                        <Text style={{color: 'white'}}>Call to Server</Text>
                    </Button>
                    
                    <ScrollView style={{height: 300}}>
                    {
                            this.state.directions.map( (item, index) => {
                                var backgroundColor = "lightgray";
                                if (index == this.state.indexDirections) backgroundColor = "green";

                                return(
                                    <TouchableOpacity style = {{backgroundColor : backgroundColor, marginTop: 5}} key={index} onPress= {() => this.ChangeIndexDirections(index)}>
                                        <Text style ={{margin: 5, color: 'black'}} >Bước {index+1} : Đi từ 
                                            <Text> ({item.origin.customerID}) {item.origin.name} </Text> đến 
                                            <Text> ({item.destination.customerID}) {item.destination.name} </Text>
                                        </Text>
                                    </TouchableOpacity>
                                );
                             } )
                        }
                    </ScrollView>
                </Card>
            </Container>
        );
    }
}