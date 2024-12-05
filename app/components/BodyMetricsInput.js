import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const BodyMetricsInput = () => {
  const [weight, setWeight] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [bmi, setBmi] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true); 
  };

  const handleCloseModal = () => {
    setModalVisible(false); 
  };

  const calculateBMI = (weight, feet, inches) => {
    if (weight && feet && inches) {
      const totalHeightInInches = parseFloat(feet) * 12 + parseFloat(inches);
      const calculatedBMI = ((weight * 703) / (totalHeightInInches * totalHeightInInches)).toFixed(2);
      setBmi(calculatedBMI);
    }
  };

  const handleSubmit = () => {
    if (!weight || !feet || !inches || !bodyFat) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setModalVisible(false);
    //Alert.alert('Success', `Weight: ${weight} lbs, Height: ${feet}ft ${inches}in, Body Fat: ${bodyFat}%, BMI: ${bmi}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bmiLabel}>Your BMI</Text>
      <Text style={styles.bmiValue}>{bmi || 'Not calculated yet'}</Text>
      <View style={styles.prevBmiContainer}>
        <Text style={styles.prevBmiLabel}>Previous BMI</Text>
        <Text style={styles.prevBmiValue}>{bmi || '--'}</Text>
      </View>
      <TouchableOpacity style={styles.plusIcon} onPress={handleOpenModal}>
        <MaterialCommunityIcons name="plus" size={35} color="#072AC8" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Body Fat Percentage (%)</Text>
            <TextInput
              style={styles.input}
              label="BMI"
              keyboardType="numeric"
              value={bodyFat}
              onChangeText={setBodyFat}
              mode='outlined'
              selectionColor='dodgerblue'
              outlineColor='black'
              activeOutlineColor='dodgerblue'
            />

            <Text style={styles.label}>Weight (lbs)</Text>
            <TextInput
              style={styles.input}
              label="Lbs"
              keyboardType="numeric"
              value={weight}
              onChangeText={(value) => {
                setWeight(value);
                calculateBMI(value, feet, inches);
              }}
              mode='outlined'
              selectionColor='dodgerblue'
              outlineColor='black'
              activeOutlineColor='dodgerblue'
            />

            <Text style={styles.label}>Height (Feet and Inches)</Text>
            <View style={styles.heightInputContainer}>
              <TextInput
                style={styles.heightInput}
                label="Ft."
                keyboardType="numeric"
                value={feet}
                onChangeText={(value) => {
                  setFeet(value);
                  calculateBMI(weight, value, inches);
                }}
                mode='outlined'
                selectionColor='dodgerblue'
                outlineColor='black'
                activeOutlineColor='dodgerblue'
              />
              <TextInput
                style={styles.heightInput}
                label="In."
                keyboardType="numeric"
                value={inches}
                onChangeText={(value) => {
                  setInches(value);
                  calculateBMI(weight, feet, value);
                }}
                mode='outlined'
                selectionColor='dodgerblue'
                outlineColor='black'
                activeOutlineColor='dodgerblue'
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Submit" onPress={handleSubmit} />
            </View>
            <Button title="Cancel" onPress={handleCloseModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    width: '100%', 
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bmiLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  bmiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ff6347',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  heightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heightInput: {
    margin: 10,
    width: 80,
  },
  buttonContainer: {
    marginTop: 20,
  },
  input: {
    height: 40,
    width: 200,
    marginBottom: 30,
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
  plusIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  prevBmiLabel: {
    color: 'gray',
  },
  prevBmiValue: {
    color: '#ff6347',
  },
  prevBmiContainer : {
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
  }
});

export default BodyMetricsInput;
