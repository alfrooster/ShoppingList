import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('ostosdb');

export default function App() {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
    tx.executeSql('create table if not exists product (id integer primary key not null, amount text, name text);');
    }, null, updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into product (amount, name) values (?, ?);',
      [amount, name]);
    }, null, updateList);
    setAmount('');
    setName('');
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from product;', [], (_, { rows }) =>
        setProducts(rows._array)
      );
    }, null, null);
  }

  const deleteItem = (id) => {
    db.transaction(tx => {
      tx.executeSql('delete from product where id = ?;', [id]);
    }, null, updateList)
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
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) =>
          <View style={styles.listcontainer}>
            <Text style={{fontSize: 20}}>{item.name}, {item.amount} </Text>
            <Text style={{color: '#0000ff', fontSize: 20}} onPress={() => deleteItem(item.id)}> bought</Text>
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
