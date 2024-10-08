import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { Agenda } from 'react-native-calendars';
import { Avatar, Card } from 'react-native-paper';


const Row = ({ children }) => (
  <View style={styles.row}>{children}</View>
)

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
}

const Stack =  createStackNavigator();
const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name='HomeScreen' component={HomeScreen} />
    <Stack.Screen name='CalendarScreen' component={CalendarScreen} />
  </Stack.Navigator>
);

const CalendarScreen = () => {
  const [items, setItems] = useState({});

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
      
        items[strTime].push({
          name: 'test for ' + strTime,
          height: 50,
          day: strTime
        });
      }
    
      const newItems = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
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
          />
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
          onPress={() => navigation.navigate('CalendarScreen')}>
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


export default function App() {

  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
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
