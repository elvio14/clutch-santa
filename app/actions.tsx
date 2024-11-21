"use server"
import { db } from "./firebase"

import { collection, addDoc, query, where, getDocs, updateDoc, arrayUnion, setDoc } from "firebase/firestore"; 

import { SHA256 } from "jshashes"

import { Wish, User } from "./types";

import { doc, getDoc } from "firebase/firestore";

const hasher = new SHA256()

async function hashPass(pass: string): Promise<string> {
  const hashedPassword = await hasher.b64(pass);
  return hashedPassword;
}

async function createUser(user: string, name: string, pass: string, sessionID: string){
  try{
    const hashed = await hashPass(pass)
    await setDoc(doc(db, "users", user), {
      username: user,
      displayName: name,
      password: hashed,
      wishes: [],
      giving: "",
      sessionID: sessionID
    });
    console.log("User doc written with docref: ", user);
  }catch(e){
    console.error("Error adding document: ", e);
  }
}

async function createSS(user: string, name: string, pass: string, isJoining: string){
    console.log("Running createSS...")
    let sessionID;
    try { 
      const hashed = await hashPass(pass)
      
      const docSessionRef = await addDoc(collection(db, "owners"), {
        username: user,
        displayName: name,
        passwrod: hashed,
        users: [""],
      })
      console.log("Session doc written with ID: ", docSessionRef.id);
      sessionID = docSessionRef.id
      if(isJoining === "joining"){      
        createUser(user, name, pass, sessionID)
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    return sessionID
}

async function getUsersBySessionID(sessionID: string){
  const q = query(collection(db, "users"), where("sessionID", "==", sessionID));

  const querySnapshot = await getDocs(q);
  const documents: object[] = []
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    documents.push(doc.data())
  })

  return documents
}

async function getUserData(id: string): Promise<any | null>{
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  let data;
  try{
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data()
    } else {
      // docSnap.data() will be undefined in this case
      return null
    }
  }catch(e){
    console.error('Error getUserData: ' + e)
    return null
  }


  return data
}

async function getUserDataByUsername(username: string){
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username)); // Query by the "username" field

  const querySnapshot = await getDocs(q);
  let data;
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0]; // Get the first matching document
    console.log("Data by username:", docSnap.data());
    data = docSnap.data(); // Return the document data
  } else {
    console.log("No such document!");
    return null; // Return null if no matching document was found
  }

  return data
  }

async function getUserIDByUsername(username: string){
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username)); // Query by the "username" field

  const querySnapshot = await getDocs(q);
  try{
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0]; // Get the first matching document
      console.log("Data by username:", docSnap.data());
      return docSnap.id; // Return the document data
    } else {
      console.log("No such document!");
      return null; // Return null if no matching document was found
    }
  }catch(e){
    console.error(e)
  }
  }

async function addWish(userID: string, wishname: string, link: string) {
  console.log("Running addWish...")
  const newItem = {
    wishname: wishname,
    link: link
  }
  try { 
    const docRef = doc(db, "users", userID)
    await updateDoc(docRef, {
      wishes: arrayUnion(newItem)
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function userLogin(userID:string, username: string, password: string){
  const inputPass = hashPass(password)
  try{
    const data = await getUserData(userID)
    const pass = data?.password
    const user = data?.username
    if(user === username && pass === inputPass){
      console.log("input user: " + username)
      console.log("user: " + user)
      console.log("input pass: " + inputPass)
      console.log("pass: " + pass)
      return true
    }
  }catch(e){
    console.error("Error logging in: " + e)
  }
  return false
}
export { hashPass, createUser, createSS, getUsersBySessionID, getUserData, getUserDataByUsername, addWish, userLogin, getUserIDByUsername }