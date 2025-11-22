import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';
import { MotiView } from 'moti';
import * as LocalAuthentication from 'expo-local-authentication';
import { StorageService } from '../services/StorageService';
import { router } from 'expo-router';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const { login, register, biometricLogin } = useAuthStore();
  const [canUseBiometrics, setCanUseBiometrics] = useState(false);

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setCanUseBiometrics(hasHardware && isEnrolled);

    if (hasHardware && isEnrolled) {
      const lastUser = await StorageService.getLastUser();
      if (lastUser) {
        setUsername(lastUser);
        authenticateWithBiometrics(lastUser);
      }
    }
  };

  const authenticateWithBiometrics = async (userToLogin: string) => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Login as ${userToLogin}`,
        fallbackLabel: 'Use PIN',
      });

      if (result.success) {
        await biometricLogin(userToLogin);
      }
    } catch (e) {
      console.log('Biometric auth failed', e);
    }
  };

  const handleAuth = async () => {
    if (!username || !pin) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isLogin) {
      const success = await login(username, pin);
      if (!success) {
        Alert.alert('Login Failed', 'Invalid username or PIN');
      }
    } else {
      const success = await register(username, pin);
      if (success) {
        Alert.alert('Success', 'Account created! Please login.');
        setIsLogin(true);
      } else {
        Alert.alert('Error', 'Username already exists');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-50 justify-center items-center p-6">
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 500 }}
        className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl shadow-primary-200"
      >
        <Text className="text-3xl font-bold text-primary-900 mb-2 text-center">
          SafeNote
        </Text>
        <Text className="text-slate-500 mb-8 text-center">
          {isLogin ? 'Welcome back' : 'Create your secure space'}
        </Text>

        <View className="space-y-4">
          <View>
            <Text className="text-slate-600 mb-1 ml-1 font-medium">Username</Text>
            <TextInput
              className="w-full bg-slate-50 border border-primary-100 p-4 rounded-xl text-slate-800 focus:border-primary-500"
              placeholder="Enter username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View>
            <Text className="text-slate-600 mb-1 ml-1 font-medium">PIN</Text>
            <TextInput
              className="w-full bg-slate-50 border border-primary-100 p-4 rounded-xl text-slate-800 focus:border-primary-500"
              placeholder="Enter 4-6 digit PIN"
              value={pin}
              onChangeText={setPin}
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <TouchableOpacity
            onPress={handleAuth}
            className="w-full bg-primary-600 p-4 rounded-xl mt-4 active:opacity-90 shadow-lg shadow-primary-300"
          >
            <Text className="text-white text-center font-bold text-lg">
              {isLogin ? 'Unlock' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setIsLogin(!isLogin)}
          className="mt-6"
        >
          <Text className="text-slate-500 text-center">
            {isLogin ? "New here? Create account" : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </MotiView>
    </SafeAreaView>
  );
}
