import React, { useEffect, useState } from "react";
import { 
  Alert,
  View, 
  Text, 
  Button, 
  Modal, 
  StyleSheet, 
} from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { IconButton, TextInput } from "react-native-paper";

import { db } from '../database/firebaseConfig';
import { addGraphPoint, clearGraphPoints } from "../database/firebaseFunctions";
import { collection, getDocs } from "firebase/firestore";

const DotGraph = ({ dotSize = 10 }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [xValue, setXValue] = useState('');
  const [yValue, setYValue] = useState('');
  const [graphPoints, setGraphPoints] = useState([]);

  useEffect(() => {
    fetchGraphPoints();
  }, []);

  const fetchGraphPoints = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'graphPoints'));
      const fetchedGraphPoints = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setGraphPoints(fetchedGraphPoints);
    } catch (e) {
      console.error('Error fetching graph points', e);
    }
  };

  const handleAddPoint = async () => {
    const mappedX = ((xValue - 40) / (120 - 40)) * 200;
    const mappedY = 300 - ((yValue - 70) / (190 - 70)) * 300;
    
    await addGraphPoint(mappedX, mappedY);

    fetchGraphPoints();

    //setGraphPoints([...graphPoints, { x: mappedX, y: mappedY }]);
    setModalVisible(false);
    setXValue('');
    setYValue('');
  };

  const handleUndo = () => {
    setGraphPoints(graphPoints.slice(0, -1));
  };

  const handleOpenModal = () => {
    setModalVisible(true); 
  };

  const handleCloseModal = () => {
    setModalVisible(false); 
  };

  const createTwoButtonAlert = () =>
    Alert.alert('Clear', 'Are you sure you want to clear the graph?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Clear', 
        onPress: async () => {
          await clearGraphPoints();
          fetchGraphPoints();
        }
      },
    ]);

  return (
    <View style={styles.graphContainer}>
      <View style={styles.graphAndKey}>
        <Svg height="300" width="200" viewBox="0 0 200 300">
          <Rect x="0" y="0" width="200" height="300" fill="#B71C1C" rx="10" ry="10" />
          <Rect x="0" y="75" width="150" height="225" fill="#E57373" rx="10" ry="10" />
          <Rect x="0" y="125" width="125" height="175" fill="#FFEB3B" rx="10" ry="10" />
          <Rect x="0" y="175" width="100" height="125" fill="#4CAF50" rx="10" ry="10" />
          <Rect x="0" y="250" width="50" height="50" fill="#BBDEFB" rx="10" ry="10" />
          {graphPoints.map((point, index) => (
            <Circle key={index} cx={point.x} cy={point.y} r={dotSize} fill="black" />
          ))}
        </Svg>
        <View style={styles.keyContainer}>
          <Text style={styles.keyTitle}>Blood Pressure Key</Text>
          <View style={styles.keyItem}>
            <View style={[styles.colorBox, { backgroundColor: "#B71C1C" }]} />
            <Text style={styles.keyText}>Hypertension Stage 2{"\n"}(Diastolic 120+,{"\n"}Systolic 180+)</Text>
          </View>
          <View style={styles.keyItem}>
            <View style={[styles.colorBox, { backgroundColor: "#E57373" }]} />
            <Text style={styles.keyText}>Hypertension Stage 1{"\n"}(Diastolic 90-119,{"\n"}Systolic 140-179)</Text>
          </View>
          <View style={styles.keyItem}>
            <View style={[styles.colorBox, { backgroundColor: "#FFEB3B" }]} />
            <Text style={styles.keyText}>Prehypertension{"\n"}(Diastolic 80-89,{"\n"}Systolic 120-139)</Text>
          </View>
          <View style={styles.keyItem}>
            <View style={[styles.colorBox, { backgroundColor: "#4CAF50" }]} />
            <Text style={styles.keyText}>Normal{"\n"}(Diastolic 60-79,{"\n"}Systolic 90-119)</Text>
          </View>
          <View style={styles.keyItem}>
            <View style={[styles.colorBox, { backgroundColor: "#BBDEFB" }]} />
            <Text style={styles.keyText}>Low{"\n"}(Diastolic &lt; 60,{"\n"}Systolic &lt; 90)</Text>
          </View>
        </View>
      </View>
      <IconButton 
        style={styles.plusIcon}
        icon={() => (
          <MaterialCommunityIcons 
            name="plus" 
            size={50} 
            color={'#072AC8'}
          />
        )}
        size={50}
        onPress={handleOpenModal}
        onLongPress={createTwoButtonAlert}
      />

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
          
            <TextInput 
              style={styles.input}
              onChangeText={(text) => setXValue(Number(text))}
              value={xValue}
              label='Systolic'
              mode='outlined'
              selectionColor='dodgerblue'
              outlineColor='black'
              activeOutlineColor='dodgerblue'
              keyboardType="numeric"
            />
            <TextInput 
              style={styles.input}
              onChangeText={(text) => setYValue(Number(text))}
              value={yValue}
              label='Diastolic'
              mode='outlined'
              selectionColor='dodgerblue'
              outlineColor='black'
              activeOutlineColor='dodgerblue'
              keyboardType="numeric"
            />
            <View style={{marginTop: 20}}>
              <Button title="Submit" onPress={() => {handleAddPoint();}} />
            </View>
            <Button title="Close" onPress={handleCloseModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  graphContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphAndKey: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  keyContainer: {
    marginLeft: 10,
    maxWidth: 100,
  },
  keyTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 12, 
  },
  keyItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  colorBox: {
    width: 15,
    height: 15,
    marginRight: 5,
    borderRadius: 3,
  },
  keyText: {
    fontSize: 9, 
    color: "#333",
    lineHeight: 12, 
  },
  plusIcon: {
    position: 'absolute',
    bottom: -20,
    right: 10,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: 200,
    margin: 10,
  },
});

export default DotGraph;
