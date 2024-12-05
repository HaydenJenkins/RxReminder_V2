import { useEffect, useState, } from 'react';
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { IconButton, TextInput } from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlatList } from "react-native-gesture-handler";

import uuid from 'react-native-uuid';

import { useNotification } from '../contexts/NotificationContext';

import { db } from '../database/firebaseConfig';
import { collection, getDocs, Timestamp, } from 'firebase/firestore';
import { testAddAlarm, testDeleteAlarm, testUpdateAlarm } from '../database/firebaseFunctions';

function Alarm() {
  const [alarms, setAlarms] = useState([]);
	const [showTimePicker, setShowTimePicker] = useState(false);
  const [pendingTime, setPendingTime] = useState(new Date()); 

  const [medicationList, setMedicationList] = useState([]);
  const [text, setText] = useState('');

  const { deleteAlarmPushNotifications, removeAlarmPushNotificationOnToggle, scheduleAlarmPushNotification } = useNotification();


  useEffect(() => {
    fetchAlarms();
  }, []);

  const fetchAlarms = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'alarms'));
      const fetchedAlarms = querySnapshot.docs.map(doc => {
        const time = doc.data().time instanceof Timestamp ? doc.data().time.toDate() : doc.data().time;

        return {
          id: doc.id,
          ...doc.data(),
          time, 
        };
      });
      setAlarms(fetchedAlarms);
    } catch (e) {
      console.error('Error fetching alarms', e);
    }
  };

  const toggleSwitch = async (id, switchEnabled, time) => {
    setAlarms((prevAlarms) =>
      prevAlarms.map((alarm) =>
        alarm.id === id ? { ...alarm, switchEnabled: !switchEnabled } : alarm
      )
    );

    const newNotificationID = uuid.v4();

    if (!switchEnabled) {
      const notificationID = await scheduleAlarmPushNotification(time, newNotificationID);
        testUpdateAlarm(id, switchEnabled, notificationID);
    } else {
      await removeAlarmPushNotificationOnToggle(id, switchEnabled);
    }

    fetchAlarms();
  };

	const showTimePickerModal = () => {
    setText('');
    setPendingTime(new Date()); 
		setShowTimePicker(true);
	};

	const hideTimePickerModal = () => {
		setShowTimePicker(false);
	};

	const handleTimeChange = (event, newTime) => {
		if (event.type === "set" && newTime) {
      setPendingTime(newTime); 
    }
    console.log(pendingTime);
	};

  const confirmTime = async () => {
    const newNotificationID = uuid.v4();

    const notificationID = await scheduleAlarmPushNotification(pendingTime, newNotificationID);
    await testAddAlarm(pendingTime, medicationList, true, notificationID);
    hideTimePickerModal();
    fetchAlarms(); 
  };

  const changeMeds = () => {
    const currMedsList = text.split(',').map(medication => medication.trim()).filter(medication => medication);
    setMedicationList(currMedsList);
  };

  const getMedColor = (index) => {
    const colors = ['#1E96FC', '#A2D6F9', '#FCF300', '#FFC600'];
    return colors[index % colors.length];
  };

  const createTwoButtonAlert = (id) =>
    Alert.alert('Delete Alarm', 'Are you sure you want to delete this Alarm?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete', 
        onPress: async () => {
          await deleteAlarmPushNotifications(id)
          await testDeleteAlarm(id);
          fetchAlarms();
        }
      },
    ]);

  const renderAlarmItem = ({ item }) => (
    <TouchableOpacity onLongPress={() => {createTwoButtonAlert(item.id);}}>
      <View style={styles.alarmItem}>
        <View style={styles.alarmHeader}>
          <Text style={styles.alarmTime}>
            {item.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
          <Switch
            trackColor={{false: 'lightgray', true: 'chartreuse'}}
            thumbColor={item.switchEnabled ? 'white' : 'white'}
            ios_backgroundColor="lightgray"
            onValueChange={() => {toggleSwitch(item.id, item.switchEnabled, item.time);}}
            value={item.switchEnabled}
          />
        </View>
        <View style={styles.medicationsContainer}>
          {item.medications.map((med, index) => (
            <View key={index} style={[styles.medicationRow, { backgroundColor: getMedColor(index) }, 
              index===0 ? {zIndex: 5} : 
              index===1 ? {zIndex: 4} :
              index===2 ? {zIndex: 3} :
              index===3 ? {zIndex: 2} :
              index===4 ? {zIndex: 1} : 
              index===5 ? {zIndex: 0} : null ]}>
              <Text style={styles.medicationText}>{med}</Text>
              {/* <Text style={styles.pillIcon}>💊</Text> */}
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

	return (
		<View style={styles.container}>
      <FlatList
        data={alarms}
        renderItem={renderAlarmItem}
        keyExtractor={item => item.id.toString()}
        style={styles.alarmList}
        nestedScrollEnabled={true}
        contentContainerStyle={{alignItems: 'center'}}
        showsVerticalScrollIndicator={false}
      />
      <IconButton 
        style={styles.plusIcon}
        icon={() => (
          <MaterialCommunityIcons 
            name="plus" 
            size={50} 
            color={'white'}
          />
        )}
        size={50}
        onPress={showTimePickerModal}
      />
      <Modal
        transparent={true}
        animationType="fade"
        visible={showTimePicker}
        onRequestClose={hideTimePickerModal}
      >
        <View style={styles.modalBackground}>
          <KeyboardAvoidingView style={styles.modalContent} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <DateTimePicker
              value={pendingTime}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={handleTimeChange}
              textColor='black'
            />
            <TextInput 
              style={styles.input}
              onChangeText={setText}
              onSubmitEditing={changeMeds}
              value={text}
              label='Medications'
              mode='outlined'
              selectionColor='green'
              outlineColor='blue'
              activeOutlineColor='red'
            />
            <View style={{marginTop: 10}}>
              <Button title="Confirm" onPress={() => {confirmTime();}} />
            </View>
            <View style={{marginBottom: 10}}>
              <Button title="Close" onPress={hideTimePickerModal} />
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
		</View>
	);
}

const styles = StyleSheet.create({
  alarmItem: {
    margin: 10,
    borderRadius: 10,
    width: 200,
  },
  alarmList: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    height: "95%",
    width: 300,
  },
  alarmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    zIndex: 1,
    marginBottom: 1,
  },
  alarmTime: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  input: {
    height: 40,
    width: 200,
    margin: 10,
  },
  medicationsContainer: {
  },
  medicationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginTop: -8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  medicationText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    paddingTop: 5,
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
  pillIcon: {
    fontSize: 16,
    paddingTop: 5,
  },
  plusIcon: {
    backgroundColor: '#072AC8',
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
  },
});

export default Alarm;