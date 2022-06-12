import React, { useState, useEffect } from "react";
import {
	signInWithPopup,
	GoogleAuthProvider,
	onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../DB/firebase.js";
import "./Styles.css";

const Navbar = ({ user, setUser }) => {
	useEffect(() => {
		onAuthStateChanged(auth, (users) => {
			if (users) {
				// Users is signed in, see docs for a list of available properties
				// https://firebase.google.com/docs/reference/js/firebase.Users
				const uid = users.uid;
				console.log("This is users from onAuthStateChange");
				console.log(users);
				setUser([users,true]);
				// ...
			}
		});
	}, []);

	const authHandle = async () => {
		console.log("Authenticating...");
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
			.then((result) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential =
					GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				// The signed-in user info.
				const user = result.user;
				// ...
				console.log(user);
				setUser([user, true]);
			})
			.catch((error) => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				const email = error.customData.email;
				// The AuthCredential type that was used.
				const credential =
					GoogleAuthProvider.credentialFromError(error);
				// ...
			});
	};

	return (
		<div className="authed-container">
			<button
				className="cta-button connect-wallet-button"
				onClick={authHandle}
			>
				{user[1] ? "Welcome, " + user[0].displayName : "Login"}
			</button>
		</div>
	);
};

export default Navbar;
