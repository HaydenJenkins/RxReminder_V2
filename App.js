import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { 
  Image, 
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import AccountScreen from './app/screens/AccountScreen';
import CalendarScreen from './app/screens/CalendarScreen';
import HomeScreen from './app/screens/HomeScreen';

import { NotificationProvider } from './app/contexts/NotificationContext';

import { TabBar, TabView, SceneMap } from 'react-native-tab-view';

import { BlurView } from 'expo-blur';


const LogoTitle = () => {
  return (
    <Image
      style={{ width: 25, height: 25 }}
      source={require('./app/assets/favicon.png')}
    />
  );
}

// const Stack = createStackNavigator();
// const StackNavigator = () => (
//   <Stack.Navigator>
//     <Stack.Screen name='Drawer' component={DrawerNavigator} options={{ headerShown: false, title: 'Home' }} />
//     <Stack.Screen name='Calendar' component={CalendarScreen} options={{ headerBackTitle: 'Back' }} />
//   </Stack.Navigator>
// );

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => (
  <Drawer.Navigator screenOptions={{
    drawerStyle: { backgroundColor: '#F2CD60', width: 200 },
    gestureEnabled: true,
    swipeEdgeWidth: 1000,
  }} >
    <Drawer.Screen name='Home' component={HomeScreen} options={{ headerTitle: () => <LogoTitle />, headerStyle: {backgroundColor: '#61E8E1'}, headerTintColor: '#3498db', drawerLabel: () => <LogoTitle /> }}/>
    <Drawer.Screen name='Calendar' component={CalendarScreen} options={{ headerStyle: {backgroundColor: '#61E8E1'}, headerTintColor: '#3498db' }}/>
    <Drawer.Screen name='Account' component={AccountScreen} options={{ headerStyle: {backgroundColor: '#61E8E1'}, headerTintColor: '#3498db' }}/>
  </Drawer.Navigator>
);

const renderScene = SceneMap({
  first: HomeScreen,
  second: CalendarScreen,
});

const routes = [
  { key: 'first', title: 'Home' },
  { key: 'second', title: 'Calendar' },
];

const renderTabBar = props => (
  // <TabBar
  //   {...props}
  //   indicatorStyle={{ backgroundColor: 'red' }}
  //   style={{ backgroundColor: 'rgba(97, 232, 225, 0.5)', position: 'absolute' }}
  //   activeColor='blue'
  //   inactiveColor='white'
  // />
  <View style={styles.tabBarWrapper}>
    <BlurView
      style={StyleSheet.absoluteFill}
      blurType="light" 
      blurAmount={10} 
      reducedTransparencyFallbackColor="rgba(97, 232, 225, 0.5)"
    />
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'silver' }}
      style={styles.tabBar}
      activeColor="gray"
      inactiveColor="lightgray"
    />
  </View>
);

const MainScreen = () => {

  return (
    <DrawerNavigator />
    //<StackNavigator />
  );
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function scheduleAlarmPushNotification( time ) {
  //cancel all scheduled notifications
  //await Notifications.cancelAllScheduledNotificationsAsync();

  //cancel specific notification using passed ID
  //await Notifications.cancelScheduledNotificationAsync(notificationId);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "RxReminder",                                 
      body: `Time To Take ${time} Medication(s)`,
      data: { 
        data: 'goes here', 
        test: { 
          test1: 'more data' 
        } 
      },
    },
    trigger: { 
      hour: time.hour,
      minute: time.minute,
      //repeats: true,
    },
  });
  listScheduledNotifications();
}

// Function to get and log all scheduled notifications
async function listScheduledNotifications() {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Scheduled Notifications:', scheduledNotifications);

    // Extract and save identifiers
    const notificationIds = scheduledNotifications.map(({ identifier }) => identifier);
    
    // Save these IDs for later use (e.g., state or variable)
    console.log('Notification IDs:', notificationIds);
  } catch (error) {
    console.error('Error fetching scheduled notifications:', error);
  }
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}


export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState([]);
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [index, setIndex] = useState(0);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync()
        .then((value) => {
          // Add a check to ensure we handle undefined or null values
          if (value && Array.isArray(value)) {
            setChannels(value); // Only set if it's a valid array
          } else {
            setChannels([]); // Fallback to an empty array
          }
        })
        .catch((error) => {
          console.error('Error fetching notification channels', error);
          setChannels([]); // Ensure an empty array in case of error
        });
    }
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NotificationProvider value={{ scheduleAlarmPushNotification }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
          />
        </SafeAreaView>
      </GestureHandlerRootView>
    </NotificationProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF2E3',
  },
  tabBar: {
    backgroundColor: 'transparent', // Make sure the TabBar itself is transparent
  },
  tabBarWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50, // Adjust as needed
    zIndex: 1,
  },
});
