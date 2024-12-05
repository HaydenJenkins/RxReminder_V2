import { useEffect, useState, } from 'react';
import { 
  Alert,
  Button,
  FlatList,
  Modal, 
  Text, 
  TouchableOpacity,
  StyleSheet, 
  View 
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Avatar, Card, TextInput, } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import { db } from '../database/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { addCalendarEvent, deleteCalendarEvent } from '../database/firebaseFunctions';

import { BlurView } from 'expo-blur';

function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState('');
  const [showEventInput, setShowEventInput] = useState(false);
  const [text, setText] = useState('');
  const [currDay, setCurrDay] = useState('');
  const [currEventTitle, setCurrEventTitle] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  const calendarDatesWithEvents = {};

  const toastConfig = {
    success: ({ text1 }) => (
      <View style={{ 
        height: 60, 
        width: '80%', 
        backgroundColor: 'white', 
        borderRadius: 50, 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingHorizontal: 15 }}>
        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>{text1}</Text>
      </View>
    ),
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const fetchedEvents = querySnapshot.docs.map(doc => {
        calendarDatesWithEvents[doc.data().calendarDateFormat] = {selected: true, marked: true, selectedColor: '#A2D6F9', dotColor: '#072AC8',};
        console.log('events: ', calendarDatesWithEvents);
        setMarkedDates(calendarDatesWithEvents);
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      const sortedEventsList = fetchedEvents.sort((a, b) => a.day - b.day);
      setEvents(sortedEventsList);
      console.log(calendarDatesWithEvents);
    } catch (e) {
      console.error('Error fetching events', e);
    }
  };

  const hideEventInputModal = () => {
    setShowEventInput(false);
  }

  const showEventInputModal = () => {
    setText('');
    setShowEventInput(true);
  }

  const changeEventTitle = () => {
    setCurrEventTitle(text);
  }

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Event Added To Calendar',
    });
  }

  const confirmEvent = async () => {
    hideEventInputModal();
    
    await addCalendarEvent(currDay, currEventTitle, selected);
    await fetchEvents();

    showToast();
  }

  const createTwoButtonAlert = (id) =>
    Alert.alert('Delete Event', 'Are you sure you want to delete this Event?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete', 
        onPress: async () => {
          await deleteCalendarEvent(id);
          fetchEvents();
        }
      },
    ]);

    const CustomHeader = ({ title }) => (
      <View style={styles.headerWrapper}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="rgba(97, 232, 225, 0.5)"
        />
        <View style={styles.headerContent}>
          <View style={styles.headerBubble}>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
          
        </View>
      </View>
    );

  const renderEventItem = ({ item, index }) => (
    <TouchableOpacity onLongPress={() => {createTwoButtonAlert(item.id);}}>
      <Card style={[styles.card, {backgroundColor: '#A2D6F9'}, index === 0 ? { marginTop: 50 } : {},]}>
        <Card.Content>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Avatar.Text label={item.day} style={{backgroundColor: '#1E96FC'}} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardText}>{item.eventTitle}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
    
  );

  return (
    <View style={styles.container}>
      <View style={styles.calendar}>
        <Calendar
          markingType={'dot'}
          onDayPress={day => {setSelected(day.dateString)}}
          onDayLongPress={day => {showEventInputModal(); setSelected(day.dateString); setCurrDay(day.day)}}
          markedDates={{
            ...markedDates,
            [selected]: {selected: true, selectedColor: '#FFC600'},
          }}
          style={{borderRadius: 25, backgroundColor: '#FCF300', paddingLeft: -10, paddingRight: -10}}
        />
        <Modal
          transparent={true}
          animationType="fade"
          visible={showEventInput}
          onRequestClose={hideEventInputModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <TextInput 
                style={styles.input}
                onChangeText={setText}
                onSubmitEditing={changeEventTitle}
                value={text}
                label='Event'
                mode='outlined'
                selectionColor='dodgerblue'
                outlineColor='black'
                activeOutlineColor='dodgerblue'
              />
              <Button title="Confirm" onPress={() => {confirmEvent(); showToast();}} />
              <Button title="Close" onPress={hideEventInputModal} />
            </View>
          </View>
        </Modal>
      </View>
      <View>
        <CustomHeader title={'This Week:'}/>
        <View style={styles.eventListContainer}>
          <FlatList 
          data={events}
          renderItem={renderEventItem}
          //keyExtractor={item => item.id.toString()}
          style={styles.eventList}
          //nestedScrollEnabled={true}
          contentContainerStyle={{alignItems: 'left',}}
          showsVerticalScrollIndicator={false}
        />
        </View>
      </View>
      <Toast
        config={toastConfig}
        position='bottom'
        bottomOffset={20}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  eventList: {
    marginTop: 10,
    marginBottom: 10,
    height: '72%',
    width: '100%',
  },
  eventListContainer: {
    
  },
  calendar: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  card: {
    margin: 10,
  },
  cardText: {
    flexWrap: 'wrap',
    fontSize: 20,
    paddingLeft: 10,
    fontWeight: 'bold',
  },
  cardTextContainer: {
    flexShrink: 1,
    marginLeft: 10,
    marginRight: 10,
    width: '80%',
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    marginTop: 50,
  },
  input: {
    height: 40,
    width: 300,
    margin: 10,
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
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60, 
    zIndex: 1,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerBubble: {
    paddingTop: 5,
    paddingBottom: 5, 
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#FFC600',
    borderRadius: 50,
  },
});

export default CalendarScreen;



// markedDates={{
//   '2024-10-21': {startingDay: true, color: '#50cebb', textColor: 'white'},
//   '2024-10-22': {color: '#70d7c7', textColor: 'white'},
//   '2024-10-23': {color: '#70d7c7', textColor: 'white', marked: true, dotColor: 'white'},
//   '2024-10-24': {color: '#70d7c7', textColor: 'white'},
//   '2024-10-25': {endingDay: true, color: '#50cebb', textColor: 'white'}
// }}

// onDayPress={day => {console.log('SELECTED ', day.dateString); setSelected(day.dateString);}}
// onDayLongPress={showEventInputModal}
// markedDates={{
//   [selected]: {selected: true, selectedColor: 'orange'},
//   '2024-11-15': {marked: true, dotColor: 'red',}
// }}