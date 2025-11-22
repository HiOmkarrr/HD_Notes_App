import React from 'react';
import { View, Text, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, Fingerprint, Cloud, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { logout, username } = useAuthStore();
  const [biometricsEnabled, setBiometricsEnabled] = React.useState(false);
  const [cloudLinked, setCloudLinked] = React.useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-50" edges={['top']}>
      <View className="px-6 py-8">
        <Text className="text-3xl font-bold text-zinc-900 mb-2">Settings</Text>
        <Text className="text-zinc-500 mb-8">Logged in as @{username}</Text>

        <View className="bg-white rounded-2xl overflow-hidden border border-zinc-100 mb-6">
          <View className="flex-row items-center justify-between p-4 border-b border-zinc-100">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-3">
                <Fingerprint size={20} color="#3b82f6" />
              </View>
              <Text className="text-zinc-700 font-medium text-base">Biometric Unlock</Text>
            </View>
            <Switch 
              value={biometricsEnabled} 
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: '#e4e4e7', true: '#18181b' }}
            />
          </View>

          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center mr-3">
                <Cloud size={20} color="#f97316" />
              </View>
              <Text className="text-zinc-700 font-medium text-base">Link Google Account</Text>
            </View>
            <Switch 
              value={cloudLinked} 
              onValueChange={(val) => {
                if (val) Alert.alert('Coming Soon', 'Firebase linking will be implemented here.');
                setCloudLinked(val);
              }}
              trackColor={{ false: '#e4e4e7', true: '#18181b' }}
            />
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-white p-4 rounded-2xl border border-zinc-100 flex-row items-center justify-between active:bg-zinc-50"
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center mr-3">
              <LogOut size={20} color="#ef4444" />
            </View>
            <Text className="text-red-500 font-medium text-base">Logout</Text>
          </View>
          <ChevronRight size={20} color="#d4d4d8" />
        </TouchableOpacity>

        <View className="mt-auto pt-10 pb-6 items-center">
          <Text className="text-zinc-400 text-sm font-medium">
            Made by HiOmkarrr
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
