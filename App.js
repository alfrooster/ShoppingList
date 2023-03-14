import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: firebase_apiKey,
  authDomain: firebase_authDomain,
  databaseURL: firebase_databaseURL,
  projectId: firebase_projectId,
  storageBucket: firebase_storageBucket,
  messagingSenderId: firebase_messagingSenderId,
  appId: firebase_appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [products, setProducts] = useState([]);
  const [keys, setKeys] = useState([]);

  const itemsRef = ref(database, 'items/');

  //jos poistaa kaikki listasta, tulee erroria, en saanu korjattua
  useEffect(() => {
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      setProducts(Object.values(data));
      setKeys(Object.keys(data));
    })
  }, []);

  const saveItem = () => {
    push(
      itemsRef, {'name': name, 'amount': amount}
    )
    setAmount('');
    setName('');
  }

  const deleteItem = (id) => {
    remove(ref(database, 'items/' + keys[id]));
  }
    
  return (
    <View style={styles.container}>
      <TextInput
      style={{width: 200, borderColor: 'gray', borderWidth: 1, fontSize: 20}}
      placeholder='Product'
      onChangeText={name => setName(name)}
      value={name}/>
      <TextInput
      style={{width: 200, borderColor: 'gray', borderWidth: 1, fontSize: 20}}
      placeholder='Amount'
      onChangeText={amount => setAmount(amount)}
      value={amount}/>
      <Button onPress={saveItem} title="Save" />
      <Text style={{marginTop: 15, fontSize: 22}}>Shopping list</Text>
      <FlatList
        renderItem={({item, index}) =>
          <View style={styles.listcontainer}>
            <Text style={{fontSize: 20}}>{item.name}, {item.amount} </Text>
            <Text style={{color: '#0000ff', fontSize: 20}} onPress={() => deleteItem(index)}> bought</Text>
          </View>}
        data={products}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
});
