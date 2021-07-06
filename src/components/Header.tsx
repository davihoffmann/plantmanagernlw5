import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
 
export default function Header(): ReactElement {
  const [name, setName] = useState<string>();

  const loadStorage = useCallback(async () => {
    const user = await AsyncStorage.getItem('@plantmanager:user');

    if(user) {
      return setName(user);
    }
  }, []);

  useEffect(() => {
    loadStorage();
  }, [])

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greting}>Olá,</Text>
        <Text style={styles.username}>{name}</Text>
      </View>
      <Image source={{ uri: 'https://github.com/davihoffmann.png' }} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },
  greting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text
  },
  username: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 40
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 23
  }
});