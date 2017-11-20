import React, { PropTypes, Component } from 'react'
import { 
	StyleSheet,
	View, 
	Text,
	Image,
	TouchableOpacity
} from 'react-native'



export default class Grid extends Component {
  constructor(props) {
    super(props)
    
    this._renderDisabled = this._renderDisabled.bind(this)
  }


  _renderDisabled() {
  	let {
  		size,
  	} = this.props

  	return (
  		  <View style={[styles.container, {height: size, width: size}]}>
		 
        </View>
  	)	
  }

  render () {
  	let {
  		size,
  	} = this.props

    return (
       this._renderDisabled()	
    )
  }
}

Grid.propTypes = {
	size: PropTypes.number,
},

Grid.defaultProps = {
	size: 50,
}

let styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#b5b5b5',
        padding: 10,
    },

    image: {
    	width: null,
    	height: null,
    	flex: 1,
    }
})
