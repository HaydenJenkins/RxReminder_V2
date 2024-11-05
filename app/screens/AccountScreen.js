import { Button, StyleSheet, View } from "react-native";

function AccountScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button onPress={() => navigation.goBack()} title='Go back home' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EAF2E3',
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
  }, 
});

export default AccountScreen;