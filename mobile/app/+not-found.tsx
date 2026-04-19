import { View, Text } from 'react-native';
import { Link, Stack } from 'expo-router';

/** Fallback screen for unmatched routes */
export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center bg-white p-5">
        <Text className="text-xl font-bold mb-4">Page not found</Text>
        <Link href="/" className="mt-4">
          <Text className="text-blue-500 text-base">Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}
