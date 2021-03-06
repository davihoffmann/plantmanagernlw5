import React, { ReactElement, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Alert } from 'react-native';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Header from '../components/Header';
import PlantCardSecundary from '../components/PlantCardSecundary';
import Load from '../components/Load';

import { PlantsProps, plantLoad, removePlant } from '../libs/storage';

import waterdropImg from '../assets/waterdrop.png'
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export default function MyPlants(): ReactElement {
  const [plants, setPlants] = useState<PlantsProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWaterd, setNextWaterd] = useState<string>();

  useEffect(() => {
    async function loadStorageData() {
      const plantsStorage = await plantLoad();
      
      if (plantsStorage[0]) {
        const nextTime = formatDistance(
          new Date(plantsStorage[0].dateTimeNotification).getTime(),
          new Date().getTime(),
          { locale: ptBR }
        );

        setNextWaterd(`Não esqueça de regar a ${plantsStorage[0].name} à ${nextTime} horas`);
      }
      setPlants(plantsStorage);
      setLoading(false);
    }

    loadStorageData();
  }, []);

  const handleRemove = useCallback((plant: PlantsProps) => {
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
      { text: 'Não 👀', style: 'cancel'},
      { text: 'Sim 🖖🏼', onPress: async () => {
        try {
          await removePlant(plant.id);

          setPlants(oldData => oldData.filter(item => item.id !== plant.id));
        } catch(error) {
          Alert.alert('Não foi possível remover! 👀');
        }
      }}
    ]);
  }, []);

  if(loading) {
    return <Load />
  }

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image 
          source={waterdropImg}
          style={styles.spotlightImage}
        />
        <Text style={styles.spotlightText}>
          {nextWaterd}
        </Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>
            Próximas regadas
        </Text>

        <FlatList
          data={plants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({item}) => (
            <PlantCardSecundary 
              data={item} 
              handleRemove={() => handleRemove(item)} 
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  spotlightImage: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },
  plants: {
    flex: 1,
    width: '100%',
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20
  }
})
 