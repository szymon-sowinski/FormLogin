import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export default function RegisterScreen({ onGoBack }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!firstName || !lastName || !login || !password) {
      Alert.alert('Błąd', 'Uzupełnij wszystkie pola');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await addDoc(collection(db, 'users'), {
        firstName,
        lastName,
        login,
        password: hashedPassword,
      });

      Alert.alert('Sukces', 'Użytkownik został zarejestrowany');
      onGoBack();
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się zarejestrować');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rejestracja</Text>
      <TextInput style={styles.input} placeholder="Imię" onChangeText={setFirstName} value={firstName} />
      <TextInput style={styles.input} placeholder="Nazwisko" onChangeText={setLastName} value={lastName} />
      <TextInput style={styles.input} placeholder="Login" onChangeText={setLogin} value={login} />
      <TextInput style={styles.input} placeholder="Hasło" onChangeText={setPassword} value={password} secureTextEntry />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleRegister}>
        <Text style={styles.buttonText}>Zarejestruj</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onGoBack}>
        <Text style={styles.linkText}>Masz już konto? Zaloguj się</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', maxWidth: 300, height: 40, borderWidth: 1, borderColor: '#aaa', borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#fff', marginBottom: 10 },
  buttonContainer: { backgroundColor: '#28a745', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  linkText: { color: '#007bff', textAlign: 'center', marginTop: 10 },
});
