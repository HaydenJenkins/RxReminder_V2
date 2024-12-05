import React from 'react';
import { 
  FlatList,
  SafeAreaView, 
  StyleSheet, 
  View,
} from "react-native";
import Alarm from "../components/Alarm";
import DotGraph from "../components/Graph";
import BodyMetricsInput from "../components/BodyMetricsInput";
import HealthInfoInput from "../components/HealthInfoInput";

const data = Array(4).fill(null);

const renderItem = ({ index }) => {
  if (index === 0) {
    return (
      <View style={styles.alarmContainer}>
        <View style={styles.alarmCell}>
          <Alarm />
        </View>
      </View>
    );
  } else if (index === 1) {
    return (
      <View style={styles.rowContainer}>
        <View style={styles.graphCell}>
          <DotGraph 
            dotSize={3}
            points={[{ x: 100, y: 150 }]}                  
          />
        </View>
      </View>
    );
  } else if (index === 2) {
    return (
      <View style={styles.rowContainer}>
        <View style={styles.bmiCell}>
          <BodyMetricsInput />
        </View>
      </View>
    );
  } else if (index === 3) {
    return (
      <View style={styles.rowContainer}>
        <View style={styles.healthCell}>
          <HealthInfoInput />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.rowContainer}>
      <View style={styles.cell} />
    </View>
  );
};

function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{ backgroundColor: 'white' }}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cell: {
    borderColor: 'red',
    borderWidth: 2,
    margin: 10,
    height: 150,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#EAF2E3',
  },
  rowContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alarmCell: {
    borderColor: 'lightgray',
    borderWidth: 1,
    height: 400,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 10,
    marginTop: 50,
    marginBottom: 10,
  },
  graphCell: {
    borderColor: 'lightgray',
    borderWidth: 1,
    height: 350,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  bmiCell: {
    borderColor: 'lightgray',
    borderWidth: 1,
    height: 200,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    overflow: 'hidden',
  },
  healthCell: {
    borderColor: 'lightgray',
    borderWidth: 1,
    height: 300,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
});

export default HomeScreen;
