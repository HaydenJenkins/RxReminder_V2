import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { Alert, 
  Button, 
  FlatList, 
  Image, 
  Modal,
  Platform,
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Switch, 
  Text, 
  View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

import DateTimePicker from '@react-native-community/datetimepicker'

import { Calendar } from 'react-native-calendars';
import { Avatar, Card, IconButton, MD3Colors } from 'react-native-paper';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';


const Row = ({ children }) => (
  <View style={styles.row}>{children}</View>
)

const LogoTitle = () => {
  return (
    <Image
      style={{ width: 25, height: 25 }}
      source={require('./assets/favicon.png')}
    />
  );
}

const Alarm = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [alarms, setAlarms] = useState([]); // Array of alarms
	const [showTimePicker, setShowTimePicker] = useState(false);
  const [pendingTime, setPendingTime] = useState(new Date()); // To store the temporary alarm until confirmation

  //const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const toggleSwitch = (id) => {
    setAlarms(prevAlarms =>
      prevAlarms.map(alarm =>
        alarm.id === id ? { ...alarm, switchEnabled: !alarm.switchEnabled } : alarm
      )
    );
  };

	const showTimePickerModal = () => {
    setPendingTime(new Date()); // Reset the pendingTime when opening the modal
		setShowTimePicker(true);
	};

	const hideTimePickerModal = () => {
		setShowTimePicker(false);
	};

	const handleTimeChange = (event, newTime) => {
		if (event.type === "set" && newTime) {
      setPendingTime(newTime); // Store the selected time temporarily
    }
	};

  const confirmTime = () => {
    setAlarms(prevAlarms => [...prevAlarms, { id: Date.now(), time: pendingTime, switchEnabled: false }]); // Add the pending time to alarms
    hideTimePickerModal();
  };

  const deleteAlarm = (alarmId) => {
    setAlarms(alarms.filter(alarm => alarm.id !== alarmId));
  };

	useEffect(() => {
    const checkAlarms = setInterval(() => {
      const currentTime = new Date();
      alarms.forEach(alarm => {
        if (
          currentTime.getHours() === alarm.time.getHours() &&
          currentTime.getMinutes() === alarm.time.getMinutes()
        ) {
          Alert.alert("Alarm", `Alarm at ${alarm.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} is ringing!`);
          deleteAlarm(alarm.id); // Remove the alarm once it rings
        }
      });
    }, 1000); // Check every second

    return () => clearInterval(checkAlarms); // Cleanup on unmount
  }, [alarms]);

  const renderAlarmItem = ({ item }) => (
    <View style={styles.alarmItem}>
      <Text style={styles.alarmTime}>
        {item.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </Text>
      <TouchableOpacity onPress={() => deleteAlarm(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
      <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={item.switchEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => toggleSwitch(item.id)}
        value={item.switchEnabled}
      />
    </View>
  );

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.appName}>AlarmClock</Text>
			</View>

			<Button
				title="Set Alarm"
				onPress={showTimePickerModal}
				color="#3498db"
			/>
      <Modal
        transparent={true}
        animationType="fade"
        visible={showTimePicker}
        onRequestClose={hideTimePickerModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <DateTimePicker
              value={pendingTime}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={handleTimeChange}
              textColor='black'
            />
            <Button title="Confirm" onPress={confirmTime} />
            <Button title="Close" onPress={hideTimePickerModal} />
          </View>
        </View>
      </Modal>

      {/* Displaying the list of alarms */}
      <FlatList
        data={alarms}
        renderItem={renderAlarmItem}
        keyExtractor={item => item.id.toString()}
        style={styles.alarmList}
      />

      
		</View>
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
    drawerStyle: { backgroundColor: '#c6cbef', width: 200 },
    gestureEnabled: true,
    swipeEdgeWidth: 1000,
  }} >
    <Drawer.Screen name='Home' component={HomeScreen} options={{ headerTitle: () => <LogoTitle />, drawerLabel: () => <LogoTitle /> }} />
    <Drawer.Screen name='Calendar' component={CalendarScreen} />
    <Drawer.Screen name='Account' component={AccountScreen} />
  </Drawer.Navigator>
);

const AccountScreen = ({ navigation }) => {
  return (
    <View style={{ 
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center', 
      }}>
      <Button onPress={() => navigation.goBack()} title='Go back home' />
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
};

const CalendarScreen = () => {
  return (
    <Calendar
      markingType={'period'}
      markedDates={{
        '2024-10-15': {marked: true, dotColor: '#50cebb'},
        '2024-10-16': {marked: true, dotColor: '#50cebb'},
        '2024-10-21': {startingDay: true, color: '#50cebb', textColor: 'white'},
        '2024-10-22': {color: '#70d7c7', textColor: 'white'},
        '2024-10-23': {color: '#70d7c7', textColor: 'white', marked: true, dotColor: 'white'},
        '2024-10-24': {color: '#70d7c7', textColor: 'white'},
        '2024-10-25': {endingDay: true, color: '#50cebb', textColor: 'white'}
      }}
      onDayPress={(day) => console.log(day)}
    />
  );
};


const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.alarmContainer}>
        {/* <View style={styles.calendarCell}>
          <Text>calendar preview (that day as preview)</Text>
        </View> */}
        <View style={styles.alarmCell}>
          <Alarm />
        </View>
      </View>
      <View style={styles.scrollContainer}>
        <ScrollView>
          <Row>
            <View style={styles.cell}>
              <Text>cells rendered in a list</Text>
            </View>
            <View style={styles.cell}></View>
          </Row>
          <Row>
            <View style={styles.cell}></View>
            <View style={styles.cell}></View>
          </Row>
          <Row>
            <View style={styles.cell}></View>
            <View style={styles.cell}></View>
          </Row>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

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

async function schedulePushNotification( time ) {
  //cancel all scheduled notifications
  //await Notifications.cancelAllScheduledNotificationsAsync();

  //cancel specific notification using passed ID
  //await Notifications.cancelScheduledNotificationAsync(notificationId);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { 
        data: 'goes here', 
        test: { 
          test1: 'more data' 
        } 
      },
    },
    trigger: { 
      seconds: 1,
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <MainScreen />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  alarmCell: {
    backgroundColor: 'yellow',
    borderColor: 'red',
    borderWidth: 2,
    height: '90%',
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alarmContainer: {
    flex: 1,
    //backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    backgroundColor: 'skyblue',
    borderColor: 'red',
    borderWidth: 2,
    margin: 20,
    height: 150,
    width: '40%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  scrollContainer: {
    flex: 1,
    //backgroundColor: 'gold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  alarmList: {
    marginTop: 20,
    width: "100%",
  },
  alarmItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#e8e8e8",
    marginVertical: 5,
    width: "90%",
    borderRadius: 10,
  },
  alarmTime: {
    fontSize: 20,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteText: {
    color: "white",
    fontSize: 16,
  },
});
