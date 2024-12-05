import { db } from './firebaseConfig';
import { addDoc, batch, collection, deleteDoc, doc, getDocs, updateDoc, writeBatch, } from 'firebase/firestore';

export async function testAddAlarm(time, medications, switchEnabled, notificationID) {
  try {
    const docRef = await addDoc(collection(db, "alarms"), { 
      time: time, 
      medications: medications, 
      switchEnabled: switchEnabled,
      notificationID: notificationID,
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

export async function testUpdateAlarm(id, switchEnabled, notificationID) {
  try {
    const alarm = doc(db, 'alarms', id);
    await updateDoc(alarm, {
      switchEnabled: !switchEnabled,
      notificationID: notificationID,
    });
    console.log(`Alarm ${id} updated successfully`)
  } catch (e) {
    console.log('Failed to update doc');
  }
}

export async function testDeleteAlarm(id) {
  try {
    await deleteDoc(doc(db, 'alarms', id));
    console.log(`Alarm ${id} deleted successfully`);
  } catch (e) {
    console.log('Failed to delete alarm doc', e);
  }
}


export async function addCalendarEvent(day, eventTitle, calendarDateFormat) {
  try {
    const docRef = await addDoc(collection(db, "events"), { 
      day: day,
      eventTitle: eventTitle,
      calendarDateFormat: calendarDateFormat,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding event document: ", e);
  }
}

export async function deleteCalendarEvent(id) {
  try {
    await deleteDoc(doc(db, 'events', id));
    console.log(`Event ${id} deleted Successfully`);
  } catch (e) {
    console.log('Failded to delete event doc', e);
  }
}


export async function addGraphPoint(xVal, yVal) {
  try {
    const docRef = await addDoc(collection(db, 'graphPoints'), {
      x: xVal,
      y: yVal,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.log('Error adding graph points document', e);
  }
}

export async function clearGraphPoints() {
  try {
    const querySnapshot = await getDocs(collection(db, 'graphPoints'));
    if (querySnapshot.empty) {
      console.log('No documents to clear');
      return;
    }
    const batch = writeBatch(db);
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log('Graph points cleared successfully');
  } catch (e) {
    console.error('Error clearing graph points', e);
  }
}