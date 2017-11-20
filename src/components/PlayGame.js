'use strict';

import SocketIOClient from 'socket.io-client'
import React, { Component } from 'react';

import {
  TouchableOpacity,
  AsyncStorage,
  StyleSheet,
  Dimensions,
  View,
  Text
} from 'react-native';

const screen = Dimensions.get('window')

const USER_ID = '@userId';

class PlayGame extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
    	userId: null
    };

    this.start = this.start.bind(this)
    this.socket = SocketIOClient('http://192.168.0.103:3000')
    this.determineUser = this.determineUser.bind(this)
    this.determineUser()

    this.socket.on('onStart Game', (data)=>{

    		alert(data.msg)
    } )
  }

  determineUser() {
    AsyncStorage.getItem(USER_ID)
      .then((userId) => {
        
        if (!userId) {
           this.socket.emit('userJoined', null);
           this.socket.on('userJoined', (userId) => {
             AsyncStorage.setItem(USER_ID, userId);
             this.setState({ userId });
             // alert(userId);
           });
        } else {
           this.socket.emit('userJoined', userId);
           this.setState({ userId });
           // alert(userId+'else');
        }
      })
      .catch((e) => alert(e));
  }

  start(){
  	alert('start')
  }

  render() {

  	var user = { _id: this.state.userId || -1 };

    return (
      
      	<View style={styles.overlayContainer}>
             <View style={{ justifyContent: 'center', alignItems: 'center',}}>
                <Text style={styles.resultText}> 2 {this.state.userId} </Text>
             </View>
             <View style={{height: 100, justifyContent: 'center', alignItems: 'center',}}>
                
                 <TouchableOpacity style={{paddingVertical: 10, paddingHorizontal: 60, borderColor: 'black', borderWidth: 1}} onPress={ this.start}>
                    <Text style={styles.menuText}> Game </Text>
                 </TouchableOpacity>
             </View>
        </View>

    );
  }
}

const styles = StyleSheet.create({

	overlayContainer: {
        backgroundColor : 'white',
        position: 'absolute',
        flex : 1,
        width: screen.width,
        height: screen.height,
    },

    menuText: {
        color: 'black',
        fontWeight: '600',
        fontSize: 24,
    },

    resultText: {
        color: '#000',
        fontSize: 25,
    }
    
});


export default PlayGame;