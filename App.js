import { useEffect, useState, useRef } from 'react';
import { 
  Image, 
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { createDrawerNavigator, DrawerToggleButton } from '@react-navigation/drawer';


import CalendarScreen from './app/screens/CalendarScreen';
import HomeScreen from './app/screens/HomeScreen';

import { NotificationProvider } from './app/contexts/NotificationContext';

import { TabBar, TabView, SceneMap } from 'react-native-tab-view';

import { BlurView } from 'expo-blur';

import { db } from './app/database/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';


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

const CustomHeader = ({ title }) => (
  <View style={styles.headerWrapper}>
    <BlurView
      style={StyleSheet.absoluteFill}
      blurType="light"
      blurAmount={10}
      reducedTransparencyFallbackColor="rgba(97, 232, 225, 0.5)"
    />
    <View style={styles.headerContent}>
      {/* <DrawerToggleButton onPress={() => navigation.toggleDrawer()} /> */}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  </View>
);

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => (
  <Drawer.Navigator screenOptions={{
    drawerStyle: { backgroundColor: '#C5E6FB', width: 200 },
    gestureEnabled: true,
    swipeEdgeWidth: 1000,
  }} >
    <Drawer.Screen 
      name='Home' 
      component={HomeScreen} 
      options={{
        header: () => <CustomHeader title="Home" />,
        headerStyle: { backgroundColor: '#61E8E1' },
        headerTintColor: '#3498db',
        //drawerLabel: () => <LogoTitle />,
      }} 
    />
    <Drawer.Screen 
      name='Calendar' 
      component={CalendarScreen}
      options={{
        header: () => <CustomHeader title="Calendar" />,
        headerStyle: { backgroundColor: '#61E8E1' },
        headerTintColor: '#3498db',
        //drawerLabel: () => <LogoTitle />,
      }} 
    />
  </Drawer.Navigator>
);

// const renderScene = ({ route }) => {
//   if (route.key === 'first') {
//     console.log('Rendering CalendarScreen');
//     return <CalendarScreen />;
//   } else if (route.key === 'second') {
//     console.log('Rendering HomeScreen');
//     return <HomeScreen />;
//   }
//   return null;
// };


const Tab = createMaterialTopTabNavigator();

const MyTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
    </Tab.Navigator>
  );
};

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
  );
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function scheduleAlarmPushNotification(time, id) {
  const notificationID = await Notifications.scheduleNotificationAsync({
    content: {
      title: "RxReminder",                                 
      body: `Time To Take ${time.getHours()}:${time.getMinutes()} Medication(s)`,
      data: { 
        alarmId: id,
      },
    },
    trigger: { 
      hour: time.getHours(),
      minute: time.getMinutes(),
      repeats: true,
    },
  });

  console.log('notif iD: ', notificationID);

  listScheduledNotifications();

  return notificationID;
}

async function deleteAlarmPushNotifications(id) {
  let notifID = '';

  try {
    const docRef = doc(db, 'alarms', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      notifID = docSnap.data().notificationID;
      await Notifications.cancelScheduledNotificationAsync(notifID);
      console.log('deleted notification from schedular on alarm delete')
    } else {
      console.log('snapshot for notificationID does not exist')
    }
    listScheduledNotifications();
  } catch (e) {
    console.log('failed to delete notification on alarm delete')
  }
}

async function removeAlarmPushNotificationOnToggle(id, switchEnabled) {
  let notifID = '';

  try {
    const docRef = doc(db, 'alarms', id);
    const docSnap = await getDoc(docRef);
    console.log('in remove func');

    if (docSnap.exists()) {
      notifID = docSnap.data().notificationID;
      await Notifications.cancelScheduledNotificationAsync(notifID);
      console.log('deleted notification from schedular on alarm toggle');
      await updateDoc(docRef, {
        notificationID: null,
        switchEnabled: !switchEnabled,
      });
      console.log(`Alarm notification id at ${id} updated successfully`)
    } else {
      console.log('snapshot for notificationID does not exist');
    }
    listScheduledNotifications();
  } catch (e) {
    console.log('failed to delete notification on alarm toggle');
  }
}

async function listScheduledNotifications() {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Scheduled Notifications:', scheduledNotifications);

    const notificationIds = scheduledNotifications.map(({ identifier }) => identifier);
    
    console.log('Notification IDs:', notificationIds);
  } catch (error) {
    console.error('Error fetching scheduled notifications:', error);
  }
}

async function clearNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  listScheduledNotifications();
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

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
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
    <NotificationProvider value={{ clearNotifications, listScheduledNotifications, deleteAlarmPushNotifications, removeAlarmPushNotificationOnToggle, scheduleAlarmPushNotification }}>
      
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <SafeAreaView style={styles.container}>
              <MainScreen />
            </SafeAreaView>
          </NavigationContainer>
          
        </GestureHandlerRootView>
      
    </NotificationProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabBar: {
    backgroundColor: 'transparent',
  },
  tabBarWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 1,
  },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 1,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#072AC8',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
