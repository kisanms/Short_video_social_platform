import { View, Text, Image, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import React from 'react';
import Colors from '../../Utils/Colors';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { supabase } from '../../Utils/SupabaseConfig';

export default function VideoThumbnailItem({ video, showDeleteIcon = false, refreshData }) {
  const { user } = useUser();
  const navigation = useNavigation();
  const profileImage = video?.Users?.profileImage || 'default_image_url'; // Provide a default image URL if profileImage is undefined
  const userName = video?.Users?.name || 'Unknown'; // Provide a default name if userName is undefined
  const onDeleteHandler = (video) => {
    Alert.alert('Do you want to Delete ?', 'Do you really want to Delete?', [{
      text: 'Cancel',
      style: 'cancel',
      onPress: () => console.log('Cancel')
    }, {
      text: 'Yes',
      style: 'destructive',
      onPress: () => deletePostVideo(video)
    }])

  }

  const deletePostVideo = async (video) => {
    console.log("Delete!");

    await supabase
      .from('VideoLikes')
      .delete()
      .eq('postIdRef', video.id)

    const { error } = await supabase
      .from('PostList')
      .delete()
      .eq('id', video.id)


    ToastAndroid.show('Post deleted!', ToastAndroid.SHORT);
    refreshData();
  }
  return (
    <View style={{ flex: 1 }}>
      {showDeleteIcon && user.primaryEmailAddress.emailAddress === video.Users.email && (
        <TouchableOpacity onPress={() => onDeleteHandler(video)} style={{ position: "absolute", zIndex: 10, right: 0, padding: 10 }}>
          <FontAwesome5 name="trash" size={24} color="white" />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate('play-video', { selectedVideo: video })}
        style={{ flex: 1, margin: 4 }}
      >
        <View
          style={{
            position: 'absolute',
            zIndex: 10,
            bottom: 0,
            padding: 5,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Image
              source={{ uri: profileImage }}
              style={{ width: 20, height: 20, backgroundColor: Colors.WHITE, borderRadius: 99 }}
            />
            <Text style={{ color: Colors.WHITE, fontFamily: 'outfit', fontSize: 12 }}>{userName}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Text style={{ fontFamily: 'outfit', color: Colors.WHITE, fontSize: 10 }}>
              {video?.VideoLikes?.length}
            </Text>
            <AntDesign name="hearto" size={24} color="white" />
          </View>
        </View>
        <Image
          source={{ uri: video?.thumbnail }}
          style={{ width: '100%', height: 250, borderRadius: 10 }}
        />
      </TouchableOpacity>
    </View>
  );
}
