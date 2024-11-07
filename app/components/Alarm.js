import { useEffect, useState, } from 'react';
import {
  Alert,
  Button,
  Modal,
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

import { useNotification } from '../contexts/NotificationContext';

function Alarm() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [alarms, setAlarms] = useState([]); // Array of alarms
	const [showTimePicker, setShowTimePicker] = useState(false);
  const [pendingTime, setPendingTime] = useState(new Date()); // To store the temporary alarm until confirmation

  const [medicationList, setMedicationList] = useState([]);
  const [text, setText] = useState('');

  const { scheduleAlarmPushNotification, testAddAlarm } = useNotification();

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
    setAlarms(prevAlarms => [...prevAlarms, { id: Date.now(), time: pendingTime, medications: medicationList, switchEnabled: true }]); // Add the pending time to alarms
    hideTimePickerModal();
    console.log(alarms);
  };

  const deleteAlarm = (alarmId) => {
    setAlarms(alarms.filter(alarm => alarm.id !== alarmId));
  };

  const changeMeds = () => {
    setMedicationList(text.split(',').map(medication => medication.trim()).filter(medication => medication));
  };

  const getMedColor = (index) => {
    const colors = ['#ffc107', '#03a9f4', '#ff5722', '#4caf50', '#9c27b0'];
    return colors[index % colors.length];
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

  const createTwoButtonAlert = () =>
    Alert.alert('Alert Title', 'My Alert Msg', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Confirm', onPress: () => console.log('COMFIRMED Pressed')},
    ]);

  const renderAlarmItem = ({ item }) => (
    <TouchableOpacity onLongPress={createTwoButtonAlert}>
      <View style={styles.alarmItem}>
        <View style={styles.alarmHeader}>
          <Text style={styles.alarmTime}>
            {item.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
          {/* <TouchableOpacity onPress={() => deleteAlarm(item.id)} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity> */}
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={item.switchEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleSwitch(item.id)}
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
              <Text style={styles.pillIcon}>💊</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
    
  );

	return (
		<View style={styles.container}>
			{/* <View style={styles.header}>
				<Text style={styles.appName}>AlarmClock</Text>
			</View> */}
      <IconButton 
        icon={() => (
          <MaterialCommunityIcons 
            name="plus" 
            size={50} 
            color={'#3498db'} 
          />
        )}
        size={50}
        onPress={showTimePickerModal}
      />
      <Button title='schedule notif' onPress={() => {scheduleAlarmPushNotification({hour: 12, minute: 43})}} />
      <Button title='test alarm db add' onPress={() => {testAddAlarm()}} />
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
            <TextInput 
              style={styles.input}
              onChangeText={setText}
              value={text}
              label='Medications'
              mode='outlined'
              selectionColor='green'
              outlineColor='blue'
              activeOutlineColor='red'
            />
            <Button title="Confirm" onPress={() => {changeMeds(); confirmTime();}} />
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
        nestedScrollEnabled={true}
        contentContainerStyle={{alignItems: 'center'}}
        showsVerticalScrollIndicator={false}
      />

      
		</View>
	);
}

const styles = StyleSheet.create({
  alarmItem: {
    margin: 10,
    borderRadius: 10,
    width: 200,
    //overflow: 'hidden',
    //backgroundColor: '#f1f1f1',
    //padding: 5,
  },
  alarmList: {
    marginTop: 10,
    marginBottom: 10,
    height: "100%",
    width: 300,
  },
  alarmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    zIndex: 1,
  },
  alarmTime: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'flex-end'
  },
  input: {
    height: 40,
    width: 200,
    margin: 10,
  },
  medicationsContainer: {
    //padding: 10
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
  },
});

export default Alarm;