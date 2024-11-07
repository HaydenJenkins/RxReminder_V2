import { 
  FlatList,
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
} from "react-native";
import Alarm from "../components/Alarm";

const Row = ({ children }) => (
  <View style={styles.row}>{children}</View>
)

const data = Array(3).fill(null);

const renderItem = ({ index }) => {
  if (index === 0) {
    return (
      <View style={styles.alarmContainer}>
        <View style={styles.alarmCell}>
          <Alarm />
        </View>
      </View>
      
    );
  }
  return (
    <View style={styles.rowContainer}>
      <View style={styles.row}>
        <View style={styles.cell}>
        
        </View>
      </View>
    </View>
    
  );
};

function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{backgroundColor: '#EAF2E3'}}
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
  row: {
    flexDirection: 'row',
  },
  rowContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alarmCell: {
    
    borderColor: 'red',
    borderWidth: 2,
    height: 400,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 60,
    marginBottom: 10,
  },
  alarmContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
});

export default HomeScreen;