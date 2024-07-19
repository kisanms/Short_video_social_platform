import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, StatusBar } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { supabase } from '../../Utils/SupabaseConfig';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Colors from '../../Utils/Colors';
import VideoThumbnailItem from './VideoThumbnailItem';

export default function HomeScreen() {
  const { user } = useUser();
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      updateProfileImage();
      GetLatestVideoList();
    }
  }, [user]);

  const updateProfileImage = async () => {
    const { data, error } = await supabase
      .from('Users')
      .update({ 'profileImage': user?.imageUrl })
      .eq('email', user?.primaryEmailAddress?.emailAddress)
      .is('profileImage', null)
      .select();
  }

  const GetLatestVideoList = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('PostList')
      .select('*,Users(*),VideoLikes(postIdRef,userEmail)')
      .range(0, 9)
      .order('id', { ascending: false });
    setVideoList(data);
    if (data) {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>
          Time<Text style={styles.titleHighlight}>Pass</Text>
        </Text>
        <Image
          source={{ uri: user?.imageUrl }}
          style={styles.profileImage}
        />
      </View>
      <FlatList
        data={videoList}
        numColumns={2}
        onRefresh={GetLatestVideoList}
        refreshing={loading}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <VideoThumbnailItem video={item} showDeleteIcon={false}
            refreshData={console.log} /> // Pass showDeleteIcon as false
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: widthPercentageToDP(1),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'outfit-bold',
    color: Colors.BLACK,
    fontSize: 37,
  },
  titleHighlight: {
    color: 'maroon',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 99,
  },
});
