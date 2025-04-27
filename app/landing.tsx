import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Modal from "react-native-modal";
import { db, auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuthStore } from "@/store/useAuthStore";

const landing = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [fullnameRegister, setFullnameRegister] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);

  const handleLogin = async () => {
    if (!emailLogin || !passwordLogin) {
      alert("Please fill in both email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailLogin.trim(),
        passwordLogin
      );

      const user = userCredential.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        useAuthStore.getState().setUser({
          uid: user.uid,
          email: user.email!,
          name: userData.name,
        });
      } else {
        alert("User data not found in Firestore");
        return;
      }

      console.log("Logged in user:", user);
      setLoginModalVisible(false);
      router.replace("/");
    } catch (error: any) {
      console.error("Login error:", error.message);
      alert(error.message);
    }
  };

  const handleRegister = async () => {
    if (!fullnameRegister || !emailRegister || !passwordRegister) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailRegister.trim(),
        passwordRegister
      );

      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name: fullnameRegister,
        email: emailRegister.trim(),
      });

      console.log("Registered user:", user);

      setRegisterModalVisible(false);
      alert("Registration successful!");
    } catch (error: any) {
      console.error("Registration error:", error.message);
      alert(error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/auth-background.png")}
      resizeMode="cover"
      className="flex-1"
    >
      <View className="flex-[4] justify-end items-center p-6 gap-5">
        <View className="flex justify-end items-center">
          <Text className="text-gray-800 text-3xl font-bold">
            Your Next Wise Move
          </Text>
          {/* <Text className="text-gray-800 text-3xl font-bold">
            Is One Tap Away
          </Text> */}
        </View>
        <View className="flex justify-end items-center px-8">
          <Text className="text-gray-400 text-base text-center">
            Easily take control of your spending and start growing your money
            today — the Wise way.
          </Text>
        </View>
      </View>
      <LinearGradient
        colors={["transparent", "#FFFFFF"]}
        start={[0, 0]}
        end={[0, 1]}
        className="flex-[1]"
      >
        <View className="flex-[1] items-center justify-center px-6">
          <TouchableOpacity
            onPress={() => setLoginModalVisible(true)}
            className="w-full rounded-xl overflow-hidden mb-4"
          >
            <LinearGradient
              colors={["#3b82f6", "#60a5fa", "#93c5fd"]}
              start={[0, 0]}
              end={[0, 1]}
              className="w-full py-3 rounded-xl items-center"
            >
              <Text className="text-white text-xl font-semibold">Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setRegisterModalVisible(true);
              setLoginModalVisible(false);
            }}
          >
            <View className="flex flex-row gap-1">
              <Text className="text-gray-600">Don't have an account?</Text>
              <Text className="text-blue-600">Sign up</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <Modal
        isVisible={isLoginModalVisible}
        onBackdropPress={() => setLoginModalVisible(false)}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View className="bg-white p-6 pb-10 rounded-t-xl">
          <Text className="text-4xl font-bold">Hey,</Text>
          <Text className="text-4xl font-bold mb-4">Welcome Back</Text>
          <Text className="text-lg mb-4">
            Log in to your account to track all your assets
          </Text>
          <TextInput
            placeholder="Email"
            className="border border-gray-300 rounded-xl p-3 mb-4 text-lg"
            value={emailLogin}
            onChangeText={setEmailLogin}
          />
          <TextInput
            placeholder="Password"
            className="border border-gray-300 rounded-xl p-3 mb-4 text-lg"
            secureTextEntry
            value={passwordLogin}
            onChangeText={setPasswordLogin}
          />
          <Text className="text-base text-gray-500 mb-7 text-right">
            Forget Password?
          </Text>
          <TouchableOpacity
            onPress={handleLogin}
            className="rounded-xl overflow-hidden"
          >
            <LinearGradient
              colors={["#3b82f6", "#60a5fa", "#93c5fd"]}
              className="py-3 rounded-xl items-center"
            >
              <Text className="text-lg text-white font-semibold">Login</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setLoginModalVisible(false);
              setRegisterModalVisible(true);
            }}
          >
            <View className="flex flex-row gap-1 justify-center items-center my-5">
              <Text className="text-gray-600">Don't have an account?</Text>
              <Text className="text-blue-600">Sign up</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        isVisible={isRegisterModalVisible}
        onBackdropPress={() => setRegisterModalVisible(false)}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View className="bg-white p-6 pb-10 rounded-t-xl">
          <Text className="text-4xl font-bold">Let's</Text>
          <Text className="text-4xl font-bold mb-4">Get Started</Text>
          <Text className="text-lg mb-4">
            Create an account to track your cashflow
          </Text>
          <TextInput
            placeholder="Full Name"
            className="border border-gray-300 rounded-xl p-3 mb-4 text-lg"
            value={fullnameRegister}
            onChangeText={setFullnameRegister}
          />
          <TextInput
            placeholder="Email"
            className="border border-gray-300 rounded-xl p-3 mb-4 text-lg"
            value={emailRegister}
            onChangeText={setEmailRegister}
          />
          <TextInput
            placeholder="Password"
            className="border border-gray-300 rounded-xl p-3 mb-4 text-lg"
            secureTextEntry
            value={passwordRegister}
            onChangeText={setPasswordRegister}
          />
          <TouchableOpacity
            onPress={handleRegister}
            className="rounded-xl overflow-hidden mt-4"
          >
            <LinearGradient
              colors={["#3b82f6", "#60a5fa", "#93c5fd"]}
              className="py-3 rounded-xl items-center"
            >
              <Text className="text-lg text-white font-semibold">Register</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setRegisterModalVisible(false);
              setLoginModalVisible(true);
            }}
          >
            <View className="flex flex-row gap-1 justify-center items-center my-5">
              <Text className="text-gray-600">Already have an account?</Text>
              <Text className="text-blue-600">Login</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default landing;
 
