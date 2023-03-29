import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';
import { Header, Input, Button, Icon, ListItem, Text } from '@rneui/themed';

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
      <Header centerComponent={{ text: 'Shopping list', style: { color: '#fff', fontSize: 24 } }} />
      <Input
      label='Product'
      placeholder='Product'
      onChangeText={name => setName(name)}
      value={name}/>
      <Input
      label='Amount'
      placeholder='Amount'
      onChangeText={amount => setAmount(amount)}
      value={amount}/>
      <Button containerStyle={{alignItems: 'center'}} radius={'md'} type="solid" onPress={saveItem}>
        Save
        <Icon name="save" color="white" style={{ marginLeft: 7 }} />
      </Button>
      <FlatList
        renderItem={({item, index}) =>
          <ListItem.Swipeable
            rightWidth={80}
            minSlideWidth={40}
            rightContent={(action) => (
              <Button
                containerStyle={{
                  flex: 1,
                  justifyContent: 'center',
                  backgroundColor: '#f4f4f4',
                }}
                type='clear'
                icon={{ name: 'delete', color: 'red' }}
                onPress={() => {
                  deleteItem(index);
                  {action}
                }}
              />
            )}
          >
            <ListItem.Content>
              <ListItem.Title><Text style={{fontSize: 20}}>{item.name}</Text></ListItem.Title>
              <ListItem.Subtitle><Text style={{fontSize: 16}}>{item.amount}</Text></ListItem.Subtitle>
            </ListItem.Content>
          </ListItem.Swipeable>
        }
        data={products}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});
