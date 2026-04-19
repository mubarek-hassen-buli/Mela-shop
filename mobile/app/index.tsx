import { Redirect } from 'expo-router';

/**
 * Entry point — redirects to the onboarding screen.
 * Later this will check auth state and redirect accordingly.
 */
export default function Index() {
  return <Redirect href="/(auth)/onboarding" />;
}
