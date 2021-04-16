import firebase, { auth as firebaseAuth } from '../screens/firebaseClient'
import { createContext, Context, useState, useEffect, useContext } from 'react'

export interface Auth {
  uid?: string
  email?: string | null
  name: string | null
  photoUrl?: string | null
}

interface AuthContextValue {
  auth: Auth | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext: Context<AuthContextValue> = createContext<AuthContextValue>({
  auth: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
})

const formatAuthState = (user: firebase.User): Auth => ({
  uid: user.uid,
  email: user.email,
  name: user.displayName,
  photoUrl: user.photoURL,
})

export function useProvideAuth() {
  const [auth, setAuth] = useState<Auth | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  /**
   * Callback function used for firebase.auth.onAuthStateChanged().
   * Takes the user object returned and formats it for my state.
   * We fetch the idToken and append it to my auth state and store it.
   */
  const handleAuthChange = async (authState: firebase.User | null) => {
    if (!authState) {
      return
    }

    // Formats response into my required state.
    const formattedAuth = formatAuthState(authState)
    // Stores auth into state.
    setAuth(formattedAuth)
    // Sets loading state to false.
    setLoading(false)
  }

  /**
   * Callback for when firebase signOut.
   * Sets auth state to null and loading to true.
   */
  const clear = () => {
    setAuth(null)
    setLoading(true)
  }

  /**
   * Triggers firebase Oauth for twitter and calls signIn when successful.
   * sets loading to true.
   */
  const signIn = () => {
    setLoading(true)
    return firebaseAuth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => console.log('Successfully logged in'))
      .catch((e) => console.log(e))
  }

  /**
   * Calls firebase signOut and with clear callback to reset state.
   */
  const signOut = () => {
    return firebaseAuth.signOut().then(clear)
  }

  /**
   * Watches for state change for firebase auth and calls the handleAuthChange callback
   * on every change.
   */
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(handleAuthChange)
    return () => unsubscribe()
  }, [])

  // returns state values and callbacks for signIn and signOut.
  return {
    auth,
    loading,
    signIn,
    signOut,
  }
}

export function AuthProvider({ children }: any) {
  const auth = useProvideAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
