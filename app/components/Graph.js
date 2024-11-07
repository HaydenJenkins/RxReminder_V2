import React, { useState } from "react";
import { View, Text, TextInput, Button, Modal, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const DotGraph = ({ dotSize = 10 }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [xValue, setXValue] = useState('');
  const [yValue, setYValue] = useState('');
  const [graphPoints, setGraphPoints] = useState([{ x: 100, y: 150 }]);

  const handleAddPoint = () => {
    const mappedX = ((xValue - 40) / (120 - 40)) * 200;
    const mappedY = 300 - ((yValue - 70) / (190 - 70)) * 300;
    setGraphPoints([...graphPoints, { x: mappedX, y: mappedY }]);
    setModalVisible(false);
    setXValue('');
    setYValue('');
  };

  const handleUndo = () => {
    setGraphPoints(graphPoints.slice(0, -1));
  };

  return (
    <View style={styles.graphContainer}>
      <View style={styles.graphAndKey}>
        <Svg height="300" width="200" viewBox="0 0 200 300">
          {/* Background Bands with Rounded Corners */}
          <Rect x="0" y="0" width="200" height="300" fill="#B71C1C" rx="10" ry="10" />
          <Rect x="0" y="75" width="150" height="225" fill="#E57373" rx="10" ry="10" />
          <Rect x="0" y="125" width="125" height="175" fill="#FFEB3B" rx="10" ry="10" />
          <Rect x="0" y="175" width="100" height="125" fill="#4CAF50" rx="10" ry="10" />
          <Rect x="0" y="250" width="50" height="50" fill="#BBDEFB" rx="10" ry="10" />

          {/* Points */}
          {graphPoints.map((point, index) => (
            <Circle key={index} cx={point.x} cy={point.y} r={dotSize} fill="blue" />
          ))}
        </Svg>

        {/* Key on the Right */}
        <View style={styles.keyContainer}>
          <Text style={styles.keyTitle}>Blood Pressure Key</Text>
          <View style={styles.keyItem}>
            <View style={[styles.colorBox, { backgroundColor: "#B71C1C" }]} />
            <Text style={styles.keyText}>Hypertension Stage 2{"\n"}(Systolic 180+,{"\n"}Diastolic 120+)</Text>
          </View>
          <View style={styles.keyItem}>
            <View style={[styles.colorBox, { backgroundColor: "#E57373" }]} />
            <Text style={styles.keyText}>Hypertension Stage 1{"\n"}(Systolic 140-179,{"\n"}Diastolic 90-119)</Text>
          </View>
          <View style={styles.keyItem}>
            <View style={[styles.colorBox, { backgroundColor: "#FFEB3B" }]} />
            <Text style={styles.keyText}>Prehypertension{"\n"}(Systolic 120-139,{"\n"}Diastolic 80-89)</Text>
          </View>
          <View style={styles.keyItem}>
            <View style={[styles.colorBox, { backgroundColor: "#4CAF50" }]} />
            <Text style={styles.keyText}>Normal{"\n"}(Systolic 90-119,{"\n"}Diastolic 60-79)</Text>
          </View>
          <View style={styles.keyItem}>
            <View style={[styles.colorBox, { backgroundColor: "#BBDEFB" }]} />
            <Text style={styles.keyText}>Low{"\n"}(Systolic &lt; 90,{"\n"}Diastolic &lt; 60)</Text>
          </View>
        </View>
      </View>

      {/* Plus icon to open modal */}
      <TouchableOpacity style={styles.plusIcon} onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="plus" size={30} color="#3498db" />
      </TouchableOpacity>

      {/* Modal for input fields */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a Point</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter X value (40-120)"
              keyboardType="numeric"
              onChangeText={(text) => setXValue(Number(text))}
              value={String(xValue)}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter Y value (70-190)"
              keyboardType="numeric"
              onChangeText={(text) => setYValue(Number(text))}
              value={String(yValue)}
            />

            <Button title="Submit" onPress={handleAddPoint} />
            <View style={{ marginTop: 10 }}>
              <Button title="Undo" onPress={handleUndo} />
            </View>
            <View style={{ marginTop: 10 }}>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
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
    top: 10,
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
    margin: 12,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: 'silver',
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
});

export default DotGraph;
