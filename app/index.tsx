import { View, Text } from "react-native";
import { Link, useRouter } from "expo-router";
import MyButton from "@/components/MyButton";

const index = () =>{
    const router = useRouter();
    const onContinue = () => {
        router.navigate("/signup");
    }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
      <MyButton title={"Continue"} onPress={onContinue}   />
      
    </View>
  )
}
export default index