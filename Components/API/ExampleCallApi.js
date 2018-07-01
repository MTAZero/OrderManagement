import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';

import data from './customer.json';
const api = 'http://137.74.174.141:18000/vrpsolver/api/v1/vrp';

export default class MainComponent extends Component{

    constructor(props){
        super(props);
        this.state= {
            ServerReply: 'Server haven\'t call'
        };
    }

    callserver = async () => {
        console.log('Start Call Server', api);

        await fetch(api, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                data
            ),
        })
        .then((data) => data.json())
        .then((dt) => {
            console.log(dt);
            this.setState({ServerReply: JSON.stringify(dt)});
        })
        .catch(err => {
            console.log("Error : "+err);
        })

    }

    render(){
        

        return (
            <View>
                <TouchableOpacity style={{backgroundColor: 'lightblue', margin: 10, padding: 5, alignItems:'center'}} onPress = {() => this.callserver()}>
                    <Text style={{fontSize: 20, color: 'black'}}>Call to Server</Text>
                </TouchableOpacity>
                <Text style= {{margin: 10, fontSize: 15, color:'black'}}>Server Response</Text>
                
                <ScrollView style={{height: 500, backgroundColor: 'lightgreen', marginLeft: 10, marginRight: 10}}>
                    <Text style={{color:'black', marginLeft: 10, marginTop: 10}}>
                        {this.state.ServerReply}
                    </Text>
                </ScrollView>
            </View>
        );
    }
}