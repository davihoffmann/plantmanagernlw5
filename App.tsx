import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AppLoading from 'expo-app-loading';
import { useFonts, Jost_400Regular, Jost_600SemiBold } from '@expo-google-fonts/jost';

import Routes from './src/routes';

import { PlantsProps } from './src/libs/storage';

export default function App() {
  const [ fontsLoaded ] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });

  useEffect(() => {
    // const subscription = Notifications.addNotificationReceivedListener(
    //   async notifications => {
    //     const data = notifications.request.content.data.palnt as PlantsProps

    //     console.log(data);
    //   });

      // async function notifications() {
        // const data = await Notifications.getAllScheduledNotificationsAsync();
        // console.log(data);
        // await Notifications.cancelAllScheduledNotificationsAsync();
      //}

      // notifications();
      // return () => subscription.remove();
  }, []);

  if(!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <Routes />
  );
}
