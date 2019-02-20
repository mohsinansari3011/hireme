import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAZNORQAH7vJisy0Jk-RMWbsL-oZ7wRzmY",
    authDomain: "hireme-3011.firebaseapp.com",
    databaseURL: "https://hireme-3011.firebaseio.com",
    projectId: "hireme-3011",
    storageBucket: "hireme-3011.appspot.com",
    messagingSenderId: "954926979787"
};

firebase.initializeApp(config);


const firedb = firebase.database();


const firebaselooper = (snapshot) => {
    const data = [];
    snapshot.forEach((childSnapshot) => {
        data.push({
            ...childSnapshot.val(),
            id: childSnapshot.key
        })
    });

    return data;
}



export {
    firebase, firedb
}