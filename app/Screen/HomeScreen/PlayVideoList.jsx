import { View, Text, FlatList, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import PlayVideoListItem from './PlayVideoListItem';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../Utils/Colors';
import { supabase } from '../../Utils/SupabaseConfig';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useUser } from '@clerk/clerk-expo';

export default function PlayVideoList() {
  const navigation = useNavigation();
  const { user } = useUser();
  const route = useRoute();
  const { selectedVideo } = route.params;
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const flatListRef = useRef(null);
  const WindowHeight = Dimensions.get('window').height;
  const BottomTabHeight = useBottomTabBarHeight();

  useEffect(() => {
    GetLatestVideoList();
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      const index = videoList.findIndex(video => video.id === selectedVideo.id);
      if (index !== -1) {
        setCurrentVideoIndex(index);
        flatListRef.current.scrollToIndex({ index, animated: false });
      }
    }
  }, [videoList, selectedVideo]);

  const GetLatestVideoList = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('PostList')
      .select('*,Users(username,name,profileImage,email),VideoLikes(postIdRef,userEmail)')
      .range(0, 9)
      .order('id', { ascending: false });
    if (data) {
      setVideoList(data);
      setLoading(false);
    }
  };

  const handleMomentumScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / (WindowHeight - BottomTabHeight));
    setCurrentVideoIndex(index);
    flatListRef.current.scrollToIndex({ index, animated: true });
  };

  const userLikeHandler = async (videoPost, isLike) => {
    if (!isLike) {
      const { data, error } = await supabase
        .from('VideoLikes')
        .insert([{
          postIdRef: videoPost.id,
          userEmail: user.primaryEmailAddress.emailAddress
        }])
        .select();
      console.log(error, data)
      GetLatestVideoList();
    }
    else {
      const { error } = await supabase
        .from('VideoLikes')
        .delete()
        .eq('postIdRef', videoPost.id)
        .eq('userEmail', user?.primaryEmailAddress?.emailAddress)
      GetLatestVideoList();
    }
  }

  return (
    <View>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', zIndex: 10 }}>
        <Ionicons name="arrow-back" size={40} color={Colors.BACKGROUND_TRANSP} />
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        style={{ zIndex: -1 }}
        pagingEnabled
        snapToInterval={WindowHeight - BottomTabHeight}
        snapToAlignment="start"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        data={videoList}
        renderItem={({ item, index }) => (
          <PlayVideoListItem
            video={item}
            index={index}
            activeIndex={currentVideoIndex}
            userLikeHandler={userLikeHandler}
            user={user}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={1}
        getItemLayout={(data, index) => ({
          length: WindowHeight - BottomTabHeight,
          offset: (WindowHeight - BottomTabHeight) * index,
          index,
        })}
        extraData={currentVideoIndex}
      />
    </View>
  );
}
