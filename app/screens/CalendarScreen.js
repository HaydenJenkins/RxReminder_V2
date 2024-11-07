import { Text, StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Avatar, Card, } from 'react-native-paper';

function CalendarScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.calendar}>
        <Calendar
          markingType={'period'}
          markedDates={{
            '2024-10-15': {marked: true, dotColor: '#50cebb'},
            '2024-10-16': {marked: true, dotColor: '#50cebb'},
            '2024-10-21': {startingDay: true, color: '#50cebb', textColor: 'white'},
            '2024-10-22': {color: '#70d7c7', textColor: 'white'},
            '2024-10-23': {color: '#70d7c7', textColor: 'white', marked: true, dotColor: 'white'},
            '2024-10-24': {color: '#70d7c7', textColor: 'white'},
            '2024-10-25': {endingDay: true, color: '#50cebb', textColor: 'white'}
          }}
          onDayPress={(day) => console.log(day)}
          style={{borderRadius: 5, backgroundColor: '#F2E863'}}
        />
      </View>
      <View>
        <Text style={styles.listTitle}>This Week:</Text>
        <Text style={{color: 'gray', fontSize: 35, marginLeft: 10, marginTop: -30}}>___________________</Text>
      </View>
      <Card style={[styles.card, {backgroundColor: 'orange'}]}>
        <Card.Content>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Avatar.Text label='25' style={{backgroundColor: 'red'}} />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardText}>Doctor Ismail Friday @ 3pm</Text>
              </View>
          </View>
        </Card.Content>
      </Card>
      <Card style={[styles.card, {backgroundColor: 'cyan'}]}>
        <Card.Content>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Avatar.Text label='26' style={{backgroundColor: 'yellow'}} />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardText}>Check blood pressure Satureday before bed</Text>
              </View>
          </View>
        </Card.Content>
      </Card>
    </View>
    
  );
};

const styles = StyleSheet.create({
  calendar: {
    margin: 10,
  },
  card: {
    marginLeft: 10,
    marginRight: 30,
    marginTop: 15,
  },
  cardText: {
    flexWrap: 'wrap',
    fontSize: 18,
  },
  cardTextContainer: {
    flexShrink: 1,
    marginLeft: 20, 
  },
  container: {
    backgroundColor: '#EAF2E3',
    flex: 1,
    marginTop: 50,
  }, 
  listTitle: {
    color: 'gray',
    fontSize: 30,
    marginLeft: 10,
    marginTop: 20,
  },
});

export default CalendarScreen;