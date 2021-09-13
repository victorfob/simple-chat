import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5PgQl0wh_EEl_cLfNBMMmlcmsXTKR614",
  authDomain: "projeto-bd-3ac91.firebaseapp.com",
  databaseURL: "https://projeto-bd-3ac91-default-rtdb.firebaseio.com",
  projectId: "projeto-bd-3ac91",
  storageBucket: "projeto-bd-3ac91.appspot.com",
  messagingSenderId: "447850949441",
  appId: "1:447850949441:web:c1d0025fc2b10a5ca04fc0",
  measurementId: "G-04GJB9RW2M",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
