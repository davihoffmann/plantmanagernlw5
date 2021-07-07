import React, { ReactElement } from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import wateringImg from '../assets/watering.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { useCallback } from 'react';

 
export default function Welcome(): ReactElement {
  const { navigate } = useNavigation();

  const handleNavigate = useCallback(() => {
    navigate('UserIdentification');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Gerencie{'\n'}
          suas plantas de {'\n'}
          forma fácil
        </Text>

        <Image 
          source={wateringImg} 
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.subtitle}>
          Não esqueça mais de regar suas plantas.
          Nós cuidamos de lembrar você sempre que precisar.
        </Text>

        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={handleNavigate}>
            <Feather name="chevron-right" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    color: colors.heading,
    fontFamily: fonts.heading,
    marginTop: 38,
    lineHeight: 34
  },
  subtitle: {
    textAlign: 'center',
    fontFamily: fonts.text,
    fontSize: 18,
    paddingHorizontal: 20,
    color: colors.heading,
  },
  image: {
    height: Dimensions.get('window').width * 0.7,
  },
  button: {
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 10,
    height: 56,
    width: 56
  },
  buttonIcon: {
    color: colors.white,
    fontSize: 32
  }
});
 