import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, View, TextInput, Alert, SafeAreaView, Button } from 'react-native';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import * as Crypto from 'expo-crypto';

export default function App() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [registerLogin, setRegisterLogin] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const hashPassword = async (password) => {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
  };

  const handleLogin = async () => {
    if (!login || !password) {
      return Alert.alert('Błąd', 'Uzupełnij wszystkie pola');
    }
    try {
      const q = query(collection(db, 'users'), where('login', '==', login));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return Alert.alert('Błąd', 'Niepoprawne dane logowania');
      }
      
      const userData = querySnapshot.docs[0].data();
      
      if (userData.password.length === 64) { 
        const hashedInputPassword = await hashPassword(password);
        if (hashedInputPassword === userData.password) {
          setUser(userData);
        } else {
          Alert.alert('Błąd', 'Niepoprawne dane logowania');
        }
      } else {
        if (userData.password === password) {
          setUser(userData);
        } else {
          Alert.alert('Błąd', 'Niepoprawne dane logowania');
        }
      }
    } catch {
      Alert.alert('Błąd', 'Wystąpił błąd, spróbuj ponownie później');
    }
    setLogin('');
    setPassword('');
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !registerLogin || !registerPassword) {
      return Alert.alert('Błąd', 'Uzupełnij wszystkie pola');
    }
    try {
      const q = query(collection(db, 'users'), where('login', '==', registerLogin));
      if (!(await getDocs(q)).empty) {
        return Alert.alert('Błąd', 'Ten login jest już zajęty');
      }

      const hashedPassword = await hashPassword(registerPassword);

      await addDoc(collection(db, 'users'), {
        firstName, 
        lastName, 
        email, 
        login: registerLogin, 
        password: hashedPassword 
      });

      Alert.alert('Sukces', 'Rejestracja zakończona pomyślnie!');
      setFirstName('');
      setLastName('');
      setEmail('');
      setRegisterLogin('');
      setRegisterPassword('');
    } catch {
      Alert.alert('Błąd', 'Wystąpił problem podczas rejestracji');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <>
          <View style={styles.welcomeContainer}>
            <Text style={styles.title}>
              Witaj, {user.firstName} {user.lastName}!
            </Text>
            <Button title="Wyloguj się" onPress={() => setUser(null)} />
          </View>
  
          <View style={styles.registerContainer}>
            <Text style={styles.title}>Rejestracja</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Imię" 
              onChangeText={setFirstName} 
              value={firstName} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Nazwisko" 
              onChangeText={setLastName} 
              value={lastName} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Email" 
              onChangeText={setEmail} 
              value={email} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Login" 
              onChangeText={setRegisterLogin} 
              value={registerLogin} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Hasło" 
              onChangeText={setRegisterPassword} 
              value={registerPassword} 
              secureTextEntry 
            />
            <Button title="Zarejestruj się" onPress={handleRegister} />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>Logowanie</Text>
          <View style={styles.loginContainer}>
            <TextInput 
              style={styles.input} 
              placeholder="Login" 
              onChangeText={setLogin} 
              value={login} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Hasło" 
              onChangeText={setPassword} 
              value={password} 
              secureTextEntry 
            />
            <Button title="Zaloguj się" onPress={handleLogin} />
          </View>
        </>
      )}
  
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 40,
    borderWidth: 1,
    width: 250,
    marginBottom: 15,
    paddingHorizontal: 8,
    borderColor: '#ccc',
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 10,
  },
  loginContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
  },
  registerContainer: {
    width: '80%',
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButtonContainer: {
    marginTop: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },  
});
