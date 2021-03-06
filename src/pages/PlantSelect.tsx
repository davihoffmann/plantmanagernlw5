import React, { ReactElement, useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/Header';
import EnviromentButton from '../components/EnviromentButton';
import PlantCardPrimary from '../components/PlantCardPrimary';
import Load from '../components/Load';

import { PlantsProps } from '../libs/storage';
import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';


interface EnviromentProps {
  key: string;
  title: string;
}

 
export default function PlantSelect(): ReactElement {
  const {navigate} = useNavigation();
  const [enviroments, setEnviroments] = useState<EnviromentProps[]>([]);
  const [plants, setPlants] = useState<PlantsProps[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantsProps[]>([]);
  const [enviromentSelected, setEnviromentSelected] = useState('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleSelectPlant = useCallback((plant: PlantsProps) => {
    navigate('PlantSave', { plant });
  }, []);

  function handleEnviromentSelected(eviroment: string) {
    setEnviromentSelected(eviroment);

    if(eviroment === 'all') {
      setFilteredPlants(plants);
    } else {
      const filtered = plants.filter(plant => plant.environments.includes(eviroment));

      setFilteredPlants(filtered);
    }
  }

  async function handleFetchPlants() {
    const { data } = await api
      .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

    if(!data)
      return setLoading(true);
    
    if(page > 1) {
      setPlants(oldValue => [...oldValue, ...data]);
      setFilteredPlants(oldValue => [...oldValue, ...data]);
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }

    setLoading(false);
    setLoadingMore(false);
}

  function handleFetchMore(distance: number) {
    if(distance < 1) {
      return;
    }

    setLoadingMore(true);
    setPage(oldValue => oldValue + 1);
    handleFetchPlants();
  }

  useEffect(() => {
    async function fethEnviroment() {
      const { data } = await api.get('plants_environments?_sort=title&_order=asc');
      setEnviroments([
        {
          key: 'all',
          title: 'Todos'
        },
        ...data
      ])
    }

    fethEnviroment();
  }, []);

  useEffect(() => {
    handleFetchPlants();
  }, []);

  if(loading)
    return <Load />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />

        <Text style={styles.title}>Em qual ambiente</Text>
        <Text style={styles.subtitle}>voc?? quer colocar sua planta?</Text>
      </View>
      
      <View>
        <FlatList 
          data={enviroments}
          keyExtractor={(item) => item.key}
          renderItem={({item}) => (
            <EnviromentButton 
              title={item.title} 
              active={item.key === enviromentSelected} 
              onPress={() => handleEnviromentSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.enviromentList}
        />
      </View>

      <View style={styles.plants}>
          <FlatList 
            data={filteredPlants}
            keyExtractor={(item) => item.name}
            renderItem={({item}) => (
              <PlantCardPrimary data={item} onPress={() => handleSelectPlant(item)} />
            )}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            onEndReachedThreshold={0.1}
            onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
            ListFooterComponent={
              loadingMore 
              ? <ActivityIndicator color={colors.green} />
              : <></>
            }
          />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    paddingHorizontal: 30
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15
  },
  subtitle: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.text,
    lineHeight: 20,
  },
  enviromentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center'
  },
});