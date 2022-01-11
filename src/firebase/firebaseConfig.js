import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBxM39mx_AMGuS9HGctRDcZEsb6H1Qru3c",
    authDomain: "crud-react-fc9ea.firebaseapp.com",
    projectId: "crud-react-fc9ea",
    storageBucket: "crud-react-fc9ea.appspot.com",
    messagingSenderId: "166602816716",
    appId: "1:166602816716:web:f2b839b78de8cb43c1d669"
};
  
  // Initialize Firebase
app.initializeApp(firebaseConfig);

const db = app.firestore()
const auth = app.auth()

export { db, auth }