import React,{Component} from 'react';
import MapView,{Marker} from 'react-native-maps';

// UI
import {Text, View, ScrollView, TouchableOpacity, Modal} from 'react-native';
import {Card, Container, Button, Picker} from 'native-base';

// Function
import ApiHelper from './API/api'
import MapViewDirections from 'react-native-maps-directions';

// data 
import data from './API/customer.json';

// component
import AddCustomer from './AddComponent.js';

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
            },
            data: [
            ],
            tourIndex: 0,
            listCustomer: data,
            showModal: false
        };
    }

    callServer = async () => {
        var ans = await ApiHelper.getList(this.state.listCustomer);
        this.setState({data:ans});
        this.ChangeIndexTours(0);

        //console.log(ans);
        
        //console.log(this.state.directions);
    }

    selectTour = () => {
        ans = this.state.data[this.state.tourIndex].customers;
        if (ans == null) return;
        //console.log(this.state.tourIndex);
        //console.log("Ans : ", ans);

        var directions = [];
        var positions = [];

        for(var index = 0; index<ans.length-1; index++)
            positions = positions.concat(ans[index]);

        for(var i = 0; i<positions.length; i++){
            var origin = positions[i];
            var destination = positions[(i+1)%positions.length];
            var item = {
                origin: origin,
                destination: destination,
                index: i
            };
            directions = directions.concat(item);
        }

        //console.log("Directions : ", directions);
        this.setState({stringList: JSON.stringify(ans), listPosition: positions, directions: directions, indexDirections: 0});
        this.ChangeIndexDirections(0);
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

    ChangeIndexTours = async(index) => {
        if (index<0 || index>=this.state.data.length) return;

        await this.setState({tourIndex: index});
        this.selectTour();
    }

    addCustomer(lat, long, address, demand, id){
        console.log(lat, long, address, demand, id);
        var value = parseFloat(demand);
        var customer = {
            address: address,
            demand: value,
            latitude: lat,
            longitude: long,
            id: id.toString()
        };
        var a = this.state.listCustomer;
        a.requests = a.requests.concat(customer);
        this.setState({listCustomer: a});
    }

    showModal= (show)=>{
        this.setState({showModal:show});
    }

    render() {
        //console.log(this.state.listCustomer.requests);
        return(
            <Container>

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => {
                }}>

                    <View>
                        <AddCustomer 
                            listCustomer={this.state.listCustomer.requests} 
                            addCustomer={(lat, long, add, de, id)=>this.addCustomer(lat, long, add, de, id)} 
                            showModal={this.showModal}
                        />
                    </View> 
                </Modal>

                <Card style={{padding: 5}}>
                    <Button success style= {{margin: 10, padding: 5}} onPress={()=>this.showModal(true)}>
                        <Text style={{color: 'white'}}>Add Customer</Text>
                    </Button>
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
                        {
                            this.state.listPosition.map((item, index) => {
                                var color = "black";
                                if (index == this.state.indexDirections) color="red";
                                if (index == this.state.indexDirections+1) color="green";
                                return (
                                    <Marker
                                        coordinate={{latitude: item.latitude, longitude: item.longitude}}
                                        description=""
                                        pinColor= {color}
                                        key = {index}
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

                    <View style={{ borderWidth: 1, borderColor: 'black', height: 35, backgroundColor: 'lightgreen'}}>
                        <Picker
                            mode="dropdown"
                            style={{height: 35}}
                            selectedValue = {this.state.tourIndex}
                            onValueChange = {(value) => this.ChangeIndexTours(value)}
                        >
                            
                            {
                                this.state.data.map((item, index)=>{
                                    return(
                                        <Picker.Item label={item.title} value={index} key={index}/>
                                    );
                                })
                            }
                        </Picker>
                    </View>
                    
                    <ScrollView style={{height: 300}}>
                    {
                            this.state.directions.map( (item, index) => {
                                var backgroundColor = "white";
                                if (index == this.state.indexDirections) backgroundColor = "lightgray";

                                return(
                                    <TouchableOpacity style = {{backgroundColor : backgroundColor, marginTop: 5, borderWidth: 1, borderColor:'black'}} key={index} onPress= {() => this.ChangeIndexDirections(index)}>
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

