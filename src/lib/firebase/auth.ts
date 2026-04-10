import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User,
  ConfirmationResult
} from 'firebase/auth';
import { auth } from './config';

export const signUpWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signInWithGoogle = () =>
  signInWithPopup(auth, new GoogleAuthProvider());

export const initiatePhoneAuth = (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> =>
  signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);

export const logout = () => signOut(auth);

export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);

export const resetPassword = (email: string) =>
  sendPasswordResetEmail(auth, email);

export const updateUserProfile = (user: User, profile: { displayName?: string; photoURL?: string }) =>
  updateProfile(user, profile);
