import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import Colors from '../../Utils/Colors'

export default function OtherUserProfileIntro({ user, postList }) {
  const [totalPostlikes, setTotalPostLikes] = useState(0);
  useEffect(() => {
    postList && calculateLikes();
  }, [postList])
  const calculateLikes = () => {
    let totalLikes = 0;
    postList.forEach(element => {
      // console.log(element.VideoLikes?.length)
      totalLikes = totalLikes + element.VideoLikes?.length;
    });
    setTotalPostLikes(totalLikes);
  }
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ fontFamily: 'outfit-bold', fontSize: 24, marginLeft: 20 }}>Profile</Text>
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Image source={{ uri: user.profileImage }} style={{ width: 90, height: 90, borderRadius: 99 }} />
        <Text style={{ fontFamily: 'outfit-medium', fontSize: 20, marginTop: 10 }}>{user?.name}</Text>
        <Text style={{ fontFamily: 'outfit', fontSize: 17, marginTop: 10, color: Colors.BACKGROUND_TRANSP }}>{user?.email}</Text>
      </View>
      <View style={{ marginTop: 20, display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <FontAwesome name="video-camera" size={24} color="black" />
          <Text style={{ fontFamily: 'outfit-bold', fontSize: 20 }}>{postList.length} Post</Text>
        </View>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <AntDesign name="like1" size={24} color="black" />
          <Text style={{ fontFamily: 'outfit-bold', fontSize: 20 }}>{totalPostlikes} Likes</Text>
        </View>
      </View>
    </View>
  )
}