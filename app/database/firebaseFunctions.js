import { db } from './firebaseConfig';
import { addDoc, collection, getDocs, } from 'firebase/firestore';

export async function testAddAlarm() {
  try {
    const docRef = await addDoc(collection(db, "alarms"), {
      id: 'test', 
      time: 'test1', 
      medications: 'test2', 
      switchEnabled: 'test3',
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function testReadAlarm() {
  try {
    console.log(db);
    const querySnapshot = await getDocs(collection(db, "alarms"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
  } catch (e) {
    console.error("Error reading document(s): ", e);
  }
}