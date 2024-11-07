import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HealthInfoInput = () => {
  // State for input fields
  const [modalVisible, setModalVisible] = useState(false);
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [bloodType, setBloodType] = useState('');

  // Function to handle submission of the form
  const handleSubmit = () => {
    if (!systolic || !diastolic || !bloodSugar || !heartRate || !bloodType) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    Alert.alert(
      'Success',
      `Blood Type: ${bloodType}, Blood Pressure: ${systolic}/${diastolic}, Blood Sugar: ${bloodSugar}, Peak Heart Rate: ${heartRate}`
    );
    setModalVisible(false); // Close modal on successful submit
  };

  const handleOpenModal = () => {
    setModalVisible(true); // Open modal explicitly
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Close modal explicitly
  };

  return (
    <View style={styles.container}>
      {/* Display Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Blood Type: {bloodType || "N/A"}</Text>
        <Text style={styles.infoText}>Blood Pressure: {systolic || "N/A"} / {diastolic || "N/A"}</Text>
        <Text style={styles.infoText}>Blood Sugar: {bloodSugar || "N/A"} mg/dL</Text>
        <Text style={styles.infoText}>Peak Heart Rate: {heartRate || "N/A"} BPM</Text>
      </View>

      {/* Plus Icon to Open Modal */}
      <TouchableOpacity style={styles.plusIcon} onPress={handleOpenModal}>
        <MaterialCommunityIcons name="plus" size={30} color="#3498db" />
      </TouchableOpacity>

      {/* Modal for Editing Health Info */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {/* Input Fields for Modal */}
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.secondaryLabel}>Peak Heart Rate (BPM)</Text>
                <TextInput
                  style={styles.secondaryInput}
                  placeholder="Enter peak heart rate"
                  keyboardType="numeric"
                  value={heartRate}
                  onChangeText={setHeartRate}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.secondaryLabel}>Blood Type</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={bloodType}
                    style={styles.picker}
                    onValueChange={(itemValue) => setBloodType(itemValue)}
                  >
                    <Picker.Item label="Select Blood Type" value="" />
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
            <View style={styles.center}>
              <Text style={styles.primaryLabel}>Blood Pressure</Text>
              <View style={styles.bpContainer}>
                <TextInput
                  style={styles.primaryInput}
                  placeholder="Systolic"
                  keyboardType="numeric"
                  value={systolic}
                  onChangeText={setSystolic}
                />
                <TextInput
                  style={styles.primaryInput}
                  placeholder="Diastolic"
                  keyboardType="numeric"
                  value={diastolic}
                  onChangeText={setDiastolic}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.secondaryLabel}>Blood Sugar (mg/dL)</Text>
              <TextInput
                style={styles.secondaryInput}
                placeholder="Enter blood sugar"
                keyboardType="numeric"
                value={bloodSugar}
                onChangeText={setBloodSugar}
              />
            </View>

            {/* Submit and Close Buttons */}
            <View style={styles.buttonContainer}>
              <Button title="Submit" color="#3498db" onPress={handleSubmit} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Cancel" color="grey" onPress={handleCloseModal} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  plusIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
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
    flex: 1,
    paddingHorizontal: 5,
  },
  primaryLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  primaryInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
    width: '48%',
    backgroundColor: 'white',
  },
  bpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  secondaryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  secondaryInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 14,
    width: '100%',
    backgroundColor: 'white',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  buttonContainer: {
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 5,
  },
});

export default HealthInfoInput;
