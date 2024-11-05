import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import MyButton from "@/components/MyButton";
import {
  signInWithEmailAndPassword,
  signInWithCredential,
} from "firebase/auth";
import { auth, GoogleAuthProvider } from "../firebase";
import { Link, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const webClientId =
    "969130805036-d0o4ggqoousu8jc8r61ucv2ob76rk20b.apps.googleusercontent.com";
  const androidClientId =
    "969130805036-ahqmm7uv6b3kk9jr5hpj158l0oa3vkbi.apps.googleusercontent.com";
  const clientId = Platform.OS === "android" ? androidClientId : webClientId;

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId,
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace("/Home");
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response as {
        authentication: AuthenticationResponse;
      };
      if (authentication.id_token) {
        const credential = GoogleAuthProvider.credential(
          authentication.id_token
        );
        setLoading(true);
        signInWithCredential(auth, credential)
          .then(() => {
            router.replace("/Home");
          })
          .catch((error) => {
            console.error("Error during Google sign-in:", error);
            Alert.alert("Login failed", "Please try again.");
          })
          .finally(() => setLoading(false));
      } else {
        Alert.alert(
          "Authentication error",
          "No valid authentication token received."
        );
      }
    }
  }, [response]);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Input error", "Email and password are required.");
      return;
    }
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.replace("/Home");
      })
      .catch((error) => {
        console.error("Login error:", error);
        Alert.alert("Login error", error.message);
      })
      .finally(() => setLoading(false));
  };

  const handleGoogleLogin = () => {
    promptAsync();
  };

  return (
    <ScrollView>
      <Image
        source={require("@/assets/images/login.jpg")}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.container}>
        <TextInput
          placeholder="Enter Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Enter Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <MyButton title="Login" onPress={handleLogin} />
            <Link href="/signup" style={styles.signupLink}>
              Don't have an account? Signup
            </Link>
            <MyButton title="Login with Google" onPress={handleGoogleLogin} />
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 400,
  },
  container: {
    padding: 30,
    gap: 20,
  },
  input: {
    borderWidth: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  signupLink: {
    textAlign: "center",
    marginVertical: 10,
  },
});

export default Login;
