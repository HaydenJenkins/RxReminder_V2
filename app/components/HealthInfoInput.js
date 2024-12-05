import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, TextInput } from 'react-native-paper';

const HealthInfoInput = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [bloodType, setBloodType] = useState('');

  const handleSubmit = () => {
    if (!systolic || !diastolic || !bloodSugar || !heartRate || !bloodType) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    Alert.alert(
      'Success',
      `Blood Type: ${bloodType}, Blood Pressure: ${systolic}/${diastolic}, Blood Sugar: ${bloodSugar}, Peak Heart Rate: ${heartRate}`
    );
    setModalVisible(false); 
  };

  const handleOpenModal = () => {
    setModalVisible(true); 
  };

  const handleCloseModal = () => {
    setModalVisible(false); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.plusIcon} onPress={handleOpenModal}>
        <MaterialCommunityIcons name="plus" size={35} color="#072AC8" />
      </TouchableOpacity>
      <View style={styles.bubblesContainer}>
        <Card style={[styles.infoContainer, {backgroundColor: '#1E96FC'}]}>
          <Card.Content>
            <Text style={[styles.infoText, {color: 'white'}]}>Blood Type: {bloodType || "N/A"}</Text>
          </Card.Content>
        </Card>
        <Card style={[styles.infoContainer, {backgroundColor: '#A2D6F9'}]}>
          <Card.Content>
            <Text style={[styles.infoText, {color: 'white'}]}>Blood Pressure: {systolic || "N/A"} / {diastolic || "N/A"}</Text>
          </Card.Content>
        </Card>
        <Card style={[styles.infoContainer, {backgroundColor: '#FCF300'}]}>
          <Card.Content>
          <Text style={[styles.infoText, {color: 'gray'}]}>Blood Sugar: {bloodSugar || "N/A"} mg/dL</Text>
          </Card.Content>
        </Card>
        <Card style={[styles.infoContainer, {backgroundColor: '#FFC600'}]}>
          <Card.Content>
          <Text style={[styles.infoText, {color: 'gray'}]}>Peak Heart Rate: {heartRate || "N/A"} BPM</Text>
          </Card.Content>
        </Card>
      </View>
      
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>

            <View style={styles.modalContainer}>
              <View style={{width: 180, alignItems: 'center', justifyContent: 'center', paddingLeft: 5}}>
                <View style={styles.inputContainer}>
                  <Text style={styles.secondaryLabel}>Peak Heart Rate (BPM)</Text>
                  <TextInput
                    style={styles.secondaryInput}
                    label="Peak BPM"
                    keyboardType="numeric"
                    placeholderTextColor={'red'}
                    value={heartRate}
                    onChangeText={setHeartRate}
                    mode='outlined'
                selectionColor='dodgerblue'
                outlineColor='black'
                activeOutlineColor='dodgerblue'
                  />
                  <Text style={styles.primaryLabel}>Blood Pressure</Text>
                  <View style={styles.bpContainer}>
                    <TextInput
                      style={styles.primaryInput}
                      label="Systolic"
                      keyboardType="numeric"
                      placeholderTextColor={'red'}
                      value={systolic}
                      onChangeText={setSystolic}
                      mode='outlined'
                selectionColor='dodgerblue'
                outlineColor='black'
                activeOutlineColor='dodgerblue'
                    />
                    <TextInput
                      style={styles.primaryInput}
                      label="Diastolic"
                      keyboardType="numeric"
                      placeholderTextColor={'red'}
                      value={diastolic}
                      onChangeText={setDiastolic}
                      mode='outlined'
                selectionColor='dodgerblue'
                outlineColor='black'
                activeOutlineColor='dodgerblue'
                    />
                  </View>
                  <View style={[styles.inputContainer, {marginBottom: 50}]}>
                    <Text style={styles.secondaryLabel}>Blood Sugar (mg/dL)</Text>
                    <TextInput
                      style={styles.secondaryInput}
                      label="Blood Sugar"
                      placeholderTextColor={'red'}
                      keyboardType="numeric"
                      value={bloodSugar}
                      onChangeText={setBloodSugar}
                      mode='outlined'
                selectionColor='dodgerblue'
                outlineColor='black'
                activeOutlineColor='dodgerblue'
                    />
                  </View> 
                </View>
              </View>
              <View style={{width: 150, alignItems: 'center', justifyContent: 'center', marginLeft: 10}}>
                <View style={styles.inputContainer}>
                  <Text style={styles.secondaryLabel}>Blood Type</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={bloodType}
                      style={styles.picker}
                      onValueChange={(itemValue) => setBloodType(itemValue)}
                      itemStyle={{color: 'red'}}
                    >
                      <Picker.Item label="--" value="" />
                      <Picker.Item label="A+" value="A+" />
                      <Picker.Item label="A-" value="A-" />
                      <Picker.Item label="B+" value="B+" />
                      <Picker.Item label="B-" value="B-" />
                      <Picker.Item label="AB+" value="AB+" />
                      <Picker.Item label="AB-" value="AB-" />
                      <Picker.Item label="O+" value="O+" />
                      <Picker.Item label="O-" value="O-" />
                    </Picker>
                  </View>
                </View>
              </View>
            </View>
            <Button title="Submit" onPress={handleSubmit} />
            <View style={{marginBottom: 20}}>
              <Button title="Cancel" onPress={handleCloseModal} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingRight: 10,
  },
  bubblesContainer: {
    justifyContent: 'space-around',
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    height: 135,
    width: 135,
    borderRadius: '50%',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
  },
  plusIcon: {
    position: 'absolute',
    top: 5,
    right: -18,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  primaryInput: {
  
    marginBottom: 10,
    fontSize: 14,
    width: '120',
    backgroundColor: 'white',
  },
  bpContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  secondaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  secondaryInput: {
    width: '120',
  },
  pickerContainer: {
    borderRadius: 5,
    backgroundColor: 'white',
    height: 200,
    width: 120,
    marginBottom: 50,
  },
  picker: {
    width: '100%',
    flex: 1,
  },
  buttonContainer: {
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 5,
  },
  modalContainer: {
    height: 500,
    flexDirection: 'row',
    marginBottom: -20
  },
});

export default HealthInfoInput;
