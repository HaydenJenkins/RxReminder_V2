import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';

const BodyMetricsInput = () => {
  const [weight, setWeight] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [bmi, setBmi] = useState('');

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

    Alert.alert('Success', `Weight: ${weight} lbs, Height: ${feet}ft ${inches}in, Body Fat: ${bodyFat}%, BMI: ${bmi}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bmiLabel}>Your BMI</Text>
      <Text style={styles.bmiValue}>{bmi || 'Not calculated yet'}</Text>

      <Text style={styles.label}>Body Fat Percentage (%)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter body fat percentage"
        keyboardType="numeric"
        value={bodyFat}
        onChangeText={setBodyFat}
      />

      <Text style={styles.label}>Weight (lbs)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter weight in lbs"
        keyboardType="numeric"
        value={weight}
        onChangeText={(value) => {
          setWeight(value);
          calculateBMI(value, feet, inches);
        }}
      />

      <Text style={styles.label}>Height (Feet and Inches)</Text>
      <View style={styles.heightInputContainer}>
        <TextInput
          style={styles.heightInput}
          placeholder="Feet"
          keyboardType="numeric"
          value={feet}
          onChangeText={(value) => {
            setFeet(value);
            calculateBMI(weight, value, inches);
          }}
        />
        <TextInput
          style={styles.heightInput}
          placeholder="Inches"
          keyboardType="numeric"
          value={inches}
          onChangeText={(value) => {
            setInches(value);
            calculateBMI(weight, feet, value);
          }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button color="#3498db" title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#EAF2E3',
    width: '100%', 
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    textAlign: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
  },
  heightInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  heightInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    width: '48%',
    textAlign: 'center',
    backgroundColor: 'white',
  },
  buttonContainer: {
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
  },
});

export default BodyMetricsInput;
