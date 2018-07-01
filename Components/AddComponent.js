import React, {Component} from 'react';
import {Text, View , TouchableOpacity, TextInput} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';

// UI
import {Input, Item, Button, Card} from 'native-base';
import MapView,{Marker} from 'react-native-maps';
import Autocomplete from 'react-native-autocomplete-input';

const GOOGLE_MAPS_APIKEY = 'AIzaSyAPYoGZt-UG4-URgqc1xFW5xWLvk4VLfzE';

export default class AddComponent extends Component{

    constructor(props){
        super(props);

        this.state={
            mapPosition: {
                latitude: 21.037649, 
                longitude: 105.7816119
            },
            query: "",
            data: [],
            loadApi: true,
            latitude: null, 
            longitude: null,
            dataAPI: [],
            demand: "",
            message: ""
        };
    }

    getAddressPredictions = () =>{
        RNGooglePlaces.getAutocompletePredictions(this.state.query
        )
        .then((results)=>{
            var listPosition = [];
            for(var index=0; index<results.length; index++){
                listPosition = listPosition.concat(results[index].fullText);
            }
            this.setState({data:listPosition, dataAPI: results});
            return results;
        })
        .catch((error)=> console.log(error.message));
    }

    changeText = (text) => {
        this.setState({ query: text });
        if (this.state.loadApi == true)
            this.getAddressPredictions();
        else 
            this.setState({loadApi: true});
    }

    clickItem = (item) => {
        for(var index = 0; index<this.state.dataAPI.length; index++){
            var item1 = this.state.dataAPI[index];
            if (item1.fullText == item){
                RNGooglePlaces.lookUpPlaceByID(item1.placeID)
                .then((result)=>{
                    this.setState(
                        {
                            latitude: result.latitude, 
                            longitude: result.longitude, 
                            mapPosition: {
                                latitude: result.latitude,
                                longitude: result.longitude
                            }
                        }
                    );
                })
                .catch((error)=>console.log(error.message));
            }
        }

        this.setState({query:item, data: [], loadApi: false});
    }

    renderMaker= () => {
        if (this.state.longitude == null) {
            return (<View></View>);
        };

        return (
            <Marker
                coordinate={{latitude: this.state.latitude, longitude: this.state.longitude}}
                description={this.state.query}
                title={this.state.query}
                pinColor= {"red"}
                >
            </Marker>
        );
    }

    add = () => {
        if (this.state.latitude == null || this.state.longitude == null){
            this.setState({message:"Please enter Address"});
            return;
        }
        if (this.state.demand == ""){
            this.setState({message:"Please enter Demand"});
            return;
        }

        var value = parseFloat(this.state.demand); 
        console.log("value", value);
        if (isNaN(value)){
            this.setState({message:"Demand must is number"});
            return;
        }

        this.props.addCustomer(this.state.latitude, this.state.longitude, this.state.query, this.state.demand, this.props.listCustomer.length+1);
        this.props.showModal(false);
    }

    render(){
        return (
            <View>
                <Text style={{color:'black', fontWeight:'bold', fontSize:35, textAlign:'center', marginBottom: 10}}>
                    ADD CUSTOMER
                </Text>

                <Item style={{margin: 10, paddingLeft: 5}}>
                    <Autocomplete
                        data={this.state.data}
                        defaultValue={this.state.query}
                        onChangeText={text => this.changeText(text)}
                        renderItem={item => (
                            <Card>
                                <TouchableOpacity onPress={() => this.clickItem(item)}>
                                    <Text style={{color:'black'}}>{item}</Text>
                                </TouchableOpacity>
                            </Card>
                        )}
                    />
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
                    <this.renderMaker />
                </MapView>

                <TextInput 
                    style={{color:'black'}}
                    placeholder="Enter demand"
                    keyboardType = 'numeric'
                    onChangeText = {(text)=> this.setState({demand:text})}
                    value = {this.state.demand}
                /> 
   

                <View style={{flexDirection:"row", alignItems:'center'}}>
                    <Button primary style= {{margin: 10, padding: 30, width: "45%", alignItems:'center'}} 
                        onPress={() => this.add()}
                    >
                        <Text style={{color: 'white', textAlign:'center'}}>Add customer</Text>
                    </Button>
                    <Button danger style= {{margin: 10, padding: 50, width: "45%", alignItems:'center'}} onPress={()=>this.props.showModal(false)}>
                        <Text style={{color: 'white', textAlign:'center'}}>Cancel</Text>
                    </Button>
                </View>

                <Text style={{color: "red"}}>{this.state.message}</Text>
                
            </View>
        );
    }
}