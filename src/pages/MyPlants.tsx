import React, { ReactElement, useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Image, FlatList } from 'react-native';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Header from '../components/Header';
import PlantCardSecundary from '../components/PlantCardSecundary';
import Load from '../components/Load';

import waterdropImg from '../assets/waterdrop.png'
import colors from '../styles/colors';
import { PlantsProps, plantLoad } from '../libs/storage';
import { Jost_100Thin_Italic } from '@expo-google-fonts/jost';
import fonts from '../styles/fonts';
 
export default function MyPlants(): ReactElement {
  const [plants, setPlants] = useState<PlantsProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWaterd, setNextWaterd] = useState<string>();

  useEffect(() => {
    async function loadStorageData() {
      const plantsStorage = await plantLoad();

      const nextTime = formatDistance(
        new Date(plantsStorage[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: ptBR }
      );

      setNextWaterd(`Não esqueça de regar a ${plantsStorage[0].name} à ${nextTime} horas`);
      setPlants(plantsStorage);
      setLoading(false);
    }

    loadStorageData();
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
          renderItem={({item}) => <PlantCardSecundary data={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
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
    flex: Jost_100Thin_Italic,
    width: '100%',
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20
  }
})
 