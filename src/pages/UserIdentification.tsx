import React, { ReactElement, useCallback, useState } from 'react';
import { 
  KeyboardAvoidingView, 
  SafeAreaView, 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Button from '../components/Button';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
 
export default function UserIdentification(): ReactElement {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [name, setName] = useState<string>();

  const { navigate } = useNavigation();

  const handleSubmit = useCallback(async () => {
    if(!name) {
      return Alert.alert('Me diz como chamar você 🧐');
    }

    await AsyncStorage.setItem('@plantmanager:user', name)

    navigate('Confirmation');
  }, [name]);

  const hanldeInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!name);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  function handleInputChange(value: string){
    setIsFilled(!!value);
    setName(value);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ?  'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.form}>
              <View style={styles.header}>
                <Text style={styles.emoji}>
                  {isFilled ? '😆' : '😃'}
                </Text>
                <Text style={styles.title}>
                  Como podemos {'\n'}
                  chamar você?
                </Text>
              </View>

              <TextInput 
                style={[
                  styles.input, 
                  (isFocused || isFilled) && { borderColor: colors.green }
                ]} 
                placeholder="Digite um nome"
                onBlur={hanldeInputBlur}
                onFocus={handleInputFocus}
                onChangeText={handleInputChange}
              />

              <View style={styles.footer}>
                <Button title="Confirmar" onPress={handleSubmit} />
              </View>
            </View>
            
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  content: {
    flex: 1,
    width: '100%',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 54,
    alignItems: 'center'
  },
  header: {
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 32,
    marginTop: 20
  },
  emoji: {
    fontSize: 40
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.gray,
    color: colors.heading,
    width: '100%',
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: 'center'
  },
  footer: {
    marginTop: 40,
    width: '100%',
    paddingHorizontal: 20
  }
})