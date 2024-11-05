import { View, Text, TouchableOpacity, Button } from 'react-native'
import React from 'react'
import Icons from 'react-native-vector-icons/FontAwesome';

const MyIconButton = ({ onPress, icon, size}) => {
  return (
    <View>
      {/* <Text style={{ fontSize: 15, fontStyle: 'italic' }}>Go to Login</Text> */}
      <TouchableOpacity
        style={{
          // backgroundColor: "orange",
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 5, fontStyle: "italic",fontWeight:"bold", color: "white" }} onPress={onPress}>
          <Icons name={icon} size={size} color="black" />
        </Text>
      </TouchableOpacity>
    </View>
  );
}


export default MyIconButton