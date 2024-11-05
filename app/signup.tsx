import React, { useState } from "react";
import { View, Image, TextInput, ScrollView } from "react-native";
import MyButton from "@/components/MyButton";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, router } from "expo-router";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUP = () => {
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    console.log("Name:", name, "Email:", email, "Password:", password);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.navigate("/Home");
        console.log("Signed up:", user.email);
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Image
        source={require("@/assets/images/signup.jpg")}
        style={{ width: "100%", height: 400 }}
        resizeMode="cover"
      />
      <View style={{ padding: 30, gap: 20 }}>
        <TextInput
          placeholder="Enter Name"
          style={{
            borderWidth: 1,
            height: 50,
            borderRadius: 10,
            paddingHorizontal: 20,
          }}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Enter Email"
          style={{
            borderWidth: 1,
            height: 50,
            borderRadius: 10,
            paddingHorizontal: 20,
          }}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Enter Password"
          secureTextEntry
          style={{
            borderWidth: 1,
            height: 50,
            borderRadius: 10,
            paddingHorizontal: 20,
          }}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="Enter Password Again"
          secureTextEntry
          style={{
            borderWidth: 1,
            height: 50,
            borderRadius: 10,
            paddingHorizontal: 20,
          }}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <MyButton title="Signup" onPress={handleSignUP} />
        <Link href="/login">Already have an account? Login</Link>
      </View>
    </ScrollView>
  );
};

export default SignUp;
