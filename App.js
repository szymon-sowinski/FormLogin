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
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  loginContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  registerContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
