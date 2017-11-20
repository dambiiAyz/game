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

class StartGame extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
    	userId: null,
      lal : -1,
    };

  }


  render() {

  	var user = { _id: this.state.userId || -1 };

    return (
      
      	<View style={styles.overlayContainer}>
             <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                <Text style={styles.resultText}> {this.state.userId} </Text>
             </View>
             <View style={{height: 100, justifyContent: 'center', alignItems: 'center',}}>
                
                 <TouchableOpacity style={{paddingVertical: 10, paddingHorizontal: 60, borderColor: '#fff', borderWidth: 0}} onPress={() => this.props.onChangeStage(0)}>
                    <Text style={styles.menuText}> { this.state.lal } Түр хүлээнэ үү! </Text>
                 </TouchableOpacity>
             </View>
        </View>

    );
  }
}

const styles = StyleSheet.create({

	overlayContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        borderRadius: 25,
        width: screen.width - 20,
        height: screen.height - 50,
        backgroundColor: 'rgba(0,0,0, 0.8)'
    },

    menuText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 24,
    },

    resultText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 32,
    }
    
});


export default StartGame;