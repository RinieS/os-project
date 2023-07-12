import React, { useContext, useState, useEffect } from 'react';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
	updateProfile,
	signInWithEmailLink,
	GoogleAuthProvider,
	TwitterAuthProvider,
	signInWithPopup,
	getAdditionalUserInfo,
	sendSignInLinkToEmail,
	isSignInWithEmailLink,
	fetchSignInMethodsForEmail
	
} from 'firebase/auth';
import { store, auth, db, fbFunctions } from '../firebaseconfig';
import {
	doc,
	addDoc,
	getDoc,
	//   onSnapshot,
	setDoc,
	serverTimestamp,
	updateDoc,
	collection,
	//   query,
	//   getDocs,
	//   where,
	//   orderBy,
} from 'firebase/firestore';
// import { Toast } from 'react-toastify/dist/components';

export const authContext = React.createContext();

export default function AuthControl(props) {
	const children = props.children;
	const [user, setUser] = useState({});


	const onAuthStateChangedCallback = (currentUser) => {
		if (currentUser) {
			setUser(currentUser);
		} else {
			setUser(null);
		}
	  };
	// This is the firebase method that checks
	// The current user in our application from our
	// Project's authentication
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, onAuthStateChangedCallback);
		return () => unsubscribe();
	  }, []);

	const isAuthenticated = () => {
		return !!user;
	  };

	// This Function is declared to be called in the below
	// function --createUserInDatabase-- To add the creted
	// id of the "tech" object, to the object itself
	const addDocumentIdFieldToObject = async (id, userType) => {
		const userDocRef = doc(db, userType, id);
		const docSnapshot = await getDoc(userDocRef);
	  
		if (docSnapshot.exists()) {
		  console.log('Document already exists');
		} else {
		  const data = {
			id: id,
		  };
		  await setDoc(userDocRef, data);
		  console.log('Document created with ID:', id);
		}
	};

	const loginWithGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const userCredential = await signInWithPopup(auth, provider);
			const { isNewUser } = getAdditionalUserInfo(userCredential)  
			const currentUser = userCredential.user;
			const { displayName, email, uid} = currentUser;
			 
		
			 if(isNewUser){
				
				const selectedUserType = await promptUserType();
				await createUserInDatabase(displayName, email, currentUser?.uid, selectedUserType);
			 }

		
			console.log('Logged in with Google');
		  } catch (error) {
			console.log(error.message);
		}
	};

	const loginWithTwitter = async () => {
		try {
			const provider = new TwitterAuthProvider();
			const userCredential = await signInWithPopup(auth, provider);
			const { isNewUser } = getAdditionalUserInfo(userCredential);
			
			const currentUser = userCredential.user;
			
			const { displayName, email, uid} = currentUser;
			 
		
			 if(isNewUser){
				
				const selectedUserType = await promptUserType();
				await createUserInDatabase(displayName, email, currentUser?.uid, selectedUserType);
			 }

		
			console.log('Logged in with twitter');
		  } catch (error) {
			console.log(error.message);
		}
	};


	const promptUserType = async() => {
		// Prompt the user to choose a user type

		const userTypeInput = prompt('Please choose a user type: 1 for Contractor, 2 for Recruiter');
	
		// Validate and return the selected user type
		if (userTypeInput === '1') {
			return 'techs';
		} else if (userTypeInput === '2') {
			return 'recruiter';
		} else {
			// Invalid user type selected, prompt again or handle accordingly
			return promptUserType();
		}
	};

	
	// This function is declared to be called in the below
	// Register function to create out "tech" object with our
	// defined schema relateing it to the "user" by firebase
	// with the "firebaseUID"
	const createUserInDatabase = async (
		displayName,
		registerEmail,
		firebaseUID,
		userType
	) => {
		//console.log(userType, 'userType');
		const data = {
			name: displayName,
			email: registerEmail,
			firebaseUID: firebaseUID,
			userType: userType,
		};
		const createUserRequest = await addDoc(collection(db, userType), data);
		// console.log('Document written with ID: ', createUserRequest.id);
		const idToAdd = createUserRequest.id;
		addDocumentIdFieldToObject(idToAdd, userType);
	};

	// This function registers the user with firebase
	const register = async (
		registerEmail,
		displayName,
		registerPassword,
		userType
	) => {
		try {
			const signInMethods = await fetchSignInMethodsForEmail(auth, registerEmail);

			if (signInMethods.length > 0) {
				console.log('Email address is already registered');
				return false;
			}
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				registerEmail,
				registerPassword
			);
			console.log('user created');

			const currentUser = userCredential.user;
			
			await updateProfile(currentUser, { displayName: displayName })
				.then(() => {
					// ...
					
					const FUID = currentUser.uid;
					//console.log(FUID);
					createUserInDatabase(displayName, registerEmail, FUID, userType);
				})
				.catch((error) => {
					console.log(error.message);
					return false;
				});

				return true;
		} catch (error) {
			console.log(error.message);
			return false;
		}
	};

	// This function Logs the user in
	const login = async (loginEmail, loginPassword) => {
		try {
			// Check if the email address exists
		const signInMethods = await fetchSignInMethodsForEmail(auth, loginEmail);
		if (signInMethods.length === 0) {
			console.log('Email address does not exist');
			return;
		}


			await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
			console.log('logging in ..... ', loginEmail,' ', loginPassword);
		} catch (error) {
			console.log(error.message);
		}
	};

	// This function logs the user out
	const logout = async () => {
		await signOut(auth);
	};

	// Currently not in use passwordless sign In
	const signInWithEmail = async () => {
		let email = window.localStorage.getItem('emailForSignIn');
		signInWithEmailLink(auth, email, window.location.href)
			.then((result) => {
				// console.log("got here signinwith");
				// Clear email from storage.
				window.localStorage.setItem('emailForSignIn', email);
				//window.localStorage.removeItem('emailForSignIn');
				// You can access the new user via result.user
				// Additional user info profile not available via:
				// result.additionalUserInfo.profile == null
				// You can check if the user is new or existing:
				// result.additionalUserInfo.isNewUser
			})
			.catch((error) => {
				console.log(error.message);
			});
	};

	const authFunctions = {
		user,
		register,
		login,
		logout,
		isAuthenticated,
		loginWithGoogle, 
		loginWithTwitter
		// signInWithEmail,
		// emailLogin,
	};

	return (
		<authContext.Provider value={authFunctions}>
			{children}
		</authContext.Provider>
	);
}

export const UserAuth = () => {
	return useContext(authContext);
};
