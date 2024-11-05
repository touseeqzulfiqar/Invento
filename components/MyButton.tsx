import { View, Text, TouchableOpacity, Button } from 'react-native'
import React from 'react'

const MyButton = ({title, onPress}) => {
  return (
    <View>
      {/* <Text style={{ fontSize: 15, fontStyle: 'italic' }}>Go to Login</Text> */}
      <TouchableOpacity
        style={{
            
          backgroundColor: "orange",
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 15, fontStyle: "italic",fontWeight:"bold", color: "white" }} onPress={onPress}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}


export default MyButton