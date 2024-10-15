import { StatusBar } from 'expo-status-bar';
import { useState, useRef } from 'react';
import { Button, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

import { Agenda } from 'react-native-calendars';
import { Avatar, Card, IconButton, MD3Colors } from 'react-native-paper';


const Row = ({ children }) => (
  <View style={styles.row}>{children}</View>
)

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
}

const LogoTitle = () => {
  return (
    <Image
      style={{ width: 25, height: 25 }}
      source={require('./assets/favicon.png')}
    />
  );
}

const Stack = createStackNavigator();
const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name='Drawer' component={DrawerNavigator} options={{ headerShown: false, title: 'Home' }} />
    <Stack.Screen name='Calendar' component={CalendarScreen} options={{ headerBackTitle: 'Back' }} />
  </Stack.Navigator>
);

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => (
  <Drawer.Navigator screenOptions={{
    drawerStyle: { backgroundColor: '#c6cbef', width: 200 },
    gestureEnabled: true,
    swipeEdgeWidth: 1000,
  }} >
    <Drawer.Screen name='Home' component={HomeScreen} options={{ headerTitle: () => <LogoTitle />, drawerLabel: () => <LogoTitle /> }} />
    <Drawer.Screen name='Account' component={AccountScreen} />
    {/* <Drawer.Screen name='Calendar' component={CalendarScreen} /> */}
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
    </View>
  );
};

const CalendarScreen = () => {
  const today = new Date();
  const [items, setItems] = useState({});
  const [date, setDate] = useState({
    timestamp: today.getTime(),
    dateString: today.toISOString().split('T')[0],
  });

  const loadItems = (day) => {
    setTimeout(() => {
      const time = day.timestamp
      const strTime = timeToString(time);
  
  
      if (!items[strTime]) {
        items[strTime] = [];
        
        //const numItems = Math.floor(Math.random() * 3 + 1);
        // for (let j = 0; j < numItems; j++) {
        //   items[strTime].push({
        //     name: 'Item for ' + strTime + ' #' + j,
        //     height: Math.max(50, Math.floor(Math.random() * 150)),
        //     day: strTime
        //   });
        // }
      
        
      }
    
      const newItems = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
  };
  
  const createItem = () => {
    const time = date.timestamp
    const strTime = timeToString(time);

    items[strTime].push({
      name: 'test for ' + strTime,
      height: 50,
      day: strTime
    });

    loadItems(date);
  };
  
  const renderItem = (item) => {
    return (
      <TouchableOpacity
          style={{
            marginRight: 10,
            marginTop: 15,
          }}
          onPress={handlePress}>
        <Card>
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text>{item.name}</Text>
              <IconButton
                icon="camera"
                iconColor={MD3Colors.error50}
                size={20}
                onPress={() => console.log('Pressed')}
              />
              <Avatar.Text label='H' />
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const handlePress = () => {
    console.log('Button pressed!');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <View style={{ flex: 1 }}>
        <Agenda
          items={items}
          loadItemsForMonth={loadItems}
          //selected={'2024-09-23'}
          renderItem={renderItem}
          onDayPress={(day) => setDate(day)}
        />
        <View style={{ padding: 20 }}>
          <Button title="Add Event" onPress={createItem} />
        </View>
      </View>
    </SafeAreaView>
  )
};

const HomeScreen = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
      <View style={styles.calendarContainer}>
        {/* <View style={styles.calendarCell}>
          <Text>calendar preview (that day as preview)</Text>
        </View> */}
        <TouchableOpacity 
          style={styles.calendarCell}
          onPress={() => navigation.navigate('Calendar')}>
          <Text>calendar preview (that day as preview)</Text>
        </TouchableOpacity>
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

const MainScreen = () => {
  // const navigationRef = useRef(null);

  // const onGestureEvent = (event) => {
  //   if (event.nativeEvent.translationX > 500) {
  //     navigationRef.current?.dispatch(DrawerActions.openDrawer());
  //   }
  // };

  return (
    // <PanGestureHandler onGestureEvent={onGestureEvent} >
    //   <DrawerNavigator />
    // </PanGestureHandler>
    <StackNavigator />
  );
}



export default function App() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <MainScreen />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  calendarCell: {
    backgroundColor: 'yellow',
    borderColor: 'red',
    borderWidth: 2,
    height: '90%',
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarContainer: {
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
});
