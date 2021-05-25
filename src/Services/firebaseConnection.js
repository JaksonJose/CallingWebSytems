import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
  apiKey: "AIzaSyB5EdTBrmsVE6IwcVN4QU-gOxgGTXoAM5s",
  authDomain: "websytemsproject.firebaseapp.com",
  projectId: "websytemsproject",
  storageBucket: "websytemsproject.appspot.com",
  messagingSenderId: "985324191884",
  appId: "1:985324191884:web:062c86a2eec1f6c010bba9",
  measurementId: "G-C9E5VP8GVD"
};
// Initialize Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export default firebase;