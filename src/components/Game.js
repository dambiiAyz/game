import React, { PropTypes, Component } from 'react'
import SocketIOClient from 'socket.io-client'
import { 
	StyleSheet,
	View, 
	Text,
	TouchableOpacity,
  AsyncStorage,
  Dimensions
} from 'react-native'

import Grid from './Grid'
import GameControl from './GameControl'
import StartGame from './StartGame'
import PlayGame from "./PlayGame"
import Plane from './Plane'

const USER_ID = '@userId'
const blockSize = 50
const screen = Dimensions.get('window')

export default class Game extends Component {
  
  constructor(props) {
    super(props);
  
    this.state = {
        userId: null,
        start : 0,
        board: [],
        playerTurn: true, //true == x, false == y
        gameResult: 0, //0 - inProgress, 1 - x, 2 - o, 3-draw 
        gamePlay : 0,
        step: 0,
        user: '',
        heart: {
          x: 2,
          y: 2,
        },
        direction: 0,
        json : {
          userId2 : 0,
          heart2 : {
            x: 2,
            y: 2,
          },
          direction2 : 0,
        }
    }

    this._play = this._play.bind(this)
    this.onPlane = this.onPlane.bind(this)
    this.onPlayAgain = this.onPlayAgain.bind(this)
    this.onGridPressed = this.onGridPressed.bind(this)
    this._renderOverlay = this._renderOverlay.bind(this)
    
    this.onLeftPress = this.onLeftPress.bind(this)
    this.onRightPress = this.onRightPress.bind(this)
    this.onBottomPress = this.onBottomPress.bind(this)
    this.onUpPress = this.onUpPress.bind(this)
    this.onRotatePress = this.onRotatePress.bind(this)

    this.start = this.start.bind(this)
    this.socket = SocketIOClient('http://192.168.0.103:3000')
    this.determineUser = this.determineUser.bind(this)
    this.determineUser()

    this.socket.on('onStart Game', (data)=>{

        this.setState({  start : this.state.start + 1 })

       // alert(' id2 '+data.msg.userId2+' uuriih - '+this.state.userId+' start - '+this.state.start)

        if( this.state.userId == data.msg.userId2 ){
             this.setState({
              gameResult : 1
            })
        }
        if ( this.state.start == 2 ){
            this.setState({
              gamePlay : 1,
              gameResult : 0
            })
        }

    })
  }


  determineUser() {
    AsyncStorage.getItem(USER_ID)
      .then((userId) => {
        
        if (!userId) {
           this.socket.emit('userJoined', null);
           this.socket.on('userJoined', (userId) => {
             AsyncStorage.setItem(USER_ID, userId);
             this.setState({ userId });
        //      alert(userId+' if ');
           });
        } else {
           this.socket.emit('userJoined', userId);
           this.setState({ userId });
        //    alert(userId+ 'else ');
        }
      })
      .catch((e) => alert(e));
  }

  start(){

    let{
      json
    } = this.state

    json.userId2 = this.state.userId,
    json.heart2 = this.state.heart,
    json.direction2 = this.state.direction,

    this.setState({
        json
    })

    this.socket.emit('startGame', json )

  }

  componentWillMount() {
    this.onPlayAgain()
  }

  onLeftPress() {
    let {
      direction,
      heart
    } = this.state

      if(direction == 3){
         if(heart.x != 2)
            heart.x = heart.x - 1
      }
      else 
        if(heart.x != 1)
            heart.x = heart.x - 1
      
    this.setState({
      heart
    })
  }

  onRightPress() {
    let {
      direction,
      heart
    } = this.state

      if(direction == 1){
         if(heart.x != 2)
            heart.x = heart.x + 1
      }
      else
        if(heart.x != 3)
          heart.x = heart.x + 1
      
    this.setState({
      heart
    })
  }

  onUpPress() {
    let {
      direction,
      heart
    } = this.state

      if(direction == 0){
         if(heart.y != 2)
            heart.y = heart.y - 1
      }
      else
        if(heart.y != 1)
          heart.y = heart.y - 1
      
    this.setState({
      heart
    })
  }

  onBottomPress() {
    let {
      direction,
      heart
    } = this.state

    if(direction == 2){
       if(heart.y != 2)
          heart.y = heart.y + 1
    }
    else
      if(heart.y != 3)
          heart.y = heart.y + 1
    
    this.setState({
      heart
    })
  }

  onRotatePress() {
    let {
      direction,
      heart
    } = this.state

    direction += 1
    direction %= 4
    
    if( direction == 0) 
       if( heart.y == 1) heart.y ++;

    if( direction == 1) 
       if( heart.x == 3) heart.x --;

    if( direction == 2) 
       if( heart.y == 3) heart.y --;

    if( direction == 3) 
       if( heart.x == 1) heart.x ++;

    this.setState({
      direction,
      heart
    })
  }

  onStartPress(){
    let {
      gameResult,
      direction,
      board,
      heart
    } = this.state

      let x = heart.x
      let y = heart.y

      board[x][y] = 1

      if( direction == 0 || direction == 2 ){

        for(var i = -1; i < 2; i ++) 
            board[x+i][y-1] = 1        

        for(var i = -1; i < 2; i ++) 
            board[x+i][y+1] = 1       
        
        if( direction == 0 )
              board[x][y-2] = 2
        
        if( direction == 2 )
              board[x][y+2] = 2

      }

      if( direction == 1 || direction == 3 ){

        for(var i = -1; i < 2; i ++) 
            board[x-1][y+i] = 1

        for(var i = -1; i < 2; i ++) 
            board[x+1][y+i] = 1
               
        if( direction == 1 )
              board[x+2][y] = 2
        
        if( direction == 3 )
              board[x-2][y] = 2
            
      }
      
      result = 1

    this.setState({
      gameResult: result,
      direction,
      board,
      heart
    })
  }

  onPlayAgain() {
     let size = 5
     let board = new Array(size)
     for (var i = 0; i < size; i++) {
        board[i] = new Array(size)
     }

     for(var i = 0; i < size; i ++) {
        for(var j = 0; j < size; j ++) {
            board[i][j] = 0
        } 
     }

     this.setState({
        board: board,
        playerTurn: true, //true == x, false == y
        gameResult: 0, //0 - inProgress, 1 - x, 2 - o, 3-draw 
        step: 0
     })
  }


  _renderOverlay(gameResult) {       
      return (
          <StartGame />
      )
  }

  _play(gameResult) {       
      return (
          <PlayGame />
      )
  }


  onPlane(){
    let{
      heart,
      direction
    } = this.state
    return(

        <Plane heart={heart}
               direction={direction}
            />
      )
  }
  
  onGridPressed(x, y) {
     let {
        board,
        playerTurn,
        step
     } = this.state

     board[x][y] = playerTurn ? 1 : 2
     step ++
     let result = this.gameWinCondition(step, x, y, board, playerTurn)

     playerTurn = !playerTurn
     

     this.setState({
        board,
        playerTurn,
        gameResult: result,
        step
     })
  }


  render () {
    
    let {
        json,
        user,
        board,
        playerTurn,
        gameResult,
        blockSize,
        gamePlay,
        heart,
        direction
    } = this.state

    user = { _id: this.state.userId || -1 };

    return (
      <View style={styles.container}>
            <View style={{ height: 50, justifyContent: 'center', alignItems: 'center', }}>
                <Text style={{ fontSize: 20, fontWeight: '400'}}> Онгоцоо байрлуулна уу</Text>
            </View>
            
            <View style={{flex: 1}}>
              {
                  board.map((row, i) => (
                      <View key={i} style={styles.rowContainer}>
                      {
                          row.map((column, j) => (
                              <Grid key={j}
                                    size={blockSize}
                              />
                          ))
                      }
                      </View>
                  ))
              }

              {
                  gameResult == 0 && (
                      this.onPlane()
                  )
              }

            </View>


            <View style={[{ height: 200, }]}>
                <GameControl onLeftPress={this.onLeftPress}
                             onRightPress={this.onRightPress}
                             onBottomPress={this.onBottomPress}
                             onUpPress={this.onUpPress}
                             onRotatePress={this.onRotatePress}
                />
            </View>

            <View style={{ height: 60 }}>
                <TouchableOpacity style={{paddingVertical: 8, paddingHorizontal: 70, borderColor: '#ff3165', borderWidth: 3}} 
                                onPress={ this.start}>
                    <Text style={[styles.menuText, {color: '#ff3165'}]}> Эхлэх </Text>
                </TouchableOpacity>
            </View>

            {
                gameResult != 0 && (
                    this._renderOverlay(gameResult)
                )
            }

            {

                gamePlay != 0 &&(
                    this._play()
                )
            }

      </View>
    )
  }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        //flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //flex: 1,
    },

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
})
