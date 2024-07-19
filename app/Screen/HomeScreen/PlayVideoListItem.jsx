import { View, Text, StyleSheet, Dimensions, Image, TouchableHighlight, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ResizeMode, Video } from 'expo-av';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../Utils/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function PlayVideoListItem({ video, activeIndex, index, userLikeHandler, user }) {
  const videoRef = useRef(null);
  const navigation = useNavigation();
  const [status, setStatus] = useState({});
  const BottomTabHeight = useBottomTabBarHeight();
  const ScreenHeight = Dimensions.get('window').height - BottomTabHeight;

  useEffect(() => {
    const handlePlayPause = async () => {
      if (videoRef.current) {
        const status = await videoRef.current.getStatusAsync();
        if (activeIndex === index && status.isLoaded) {
          try {
            await videoRef.current.playAsync();
          } catch (error) {
            console.error('Error playing video:', error);
          }
        } else if (status.isLoaded) {
          try {
            await videoRef.current.pauseAsync();
          } catch (error) {
            console.error('Error pausing video:', error);
          }
        }
      }
    };

    handlePlayPause();
  }, [activeIndex, index]);

  const checkIsUserAlreadyLike = (videoPost) => {
    const result = video.VideoLikes?.find(item => item.userEmail == user.primaryEmailAddress.emailAddress)
    return result;
  }

  const OnOtherUserProfileClick = (OtherUser) => {
    navigation.navigate('other-user', {
      user: OtherUser
    })
  }
  return (
    <View style={{ height: ScreenHeight }}>
      <Video
        ref={videoRef}
        style={[styles.video, { height: ScreenHeight }]}
        source={{ uri: video?.videoUrl }}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={activeIndex === index}
        onPlaybackStatusUpdate={status => setStatus(() => status)}
        onError={(error) => {
          console.error('Error loading video:', error);
        }}
      />
      <View style={styles.overlay}>
        <View>
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={() => OnOtherUserProfileClick(video.Users)}>
              <Image
                source={{ uri: video?.Users?.profileImage }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => OnOtherUserProfileClick(video.Users)}>
              <Text style={styles.username}>{video?.Users?.name}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>{video?.description}</Text>
        </View>
        <View style={styles.iconContainer}>
          <>
            {checkIsUserAlreadyLike() ?
              <TouchableHighlight onPress={() => userLikeHandler(video, true)}>
                <Ionicons name="heart" size={40} color="red" />
              </TouchableHighlight> :
              <TouchableHighlight onPress={() => userLikeHandler(video, false)}>
                <Ionicons name="heart-outline" size={40} color="white" />
              </TouchableHighlight>}
            <Text style={{ color: Colors.WHITE, textAlign: 'center', marginTop: -10 }}>{video?.VideoLikes?.length}
            </Text>
          </>
          <Ionicons name="chatbubble-ellipses-outline" size={35} color="white" />
          <Ionicons name="paper-plane-outline" size={35} color="white" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    alignSelf: 'center',
    width: Dimensions.get('window').width,
  },
  overlay: {
    position: 'absolute',
    zIndex: 10,
    bottom: 20,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'flex-end',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    backgroundColor: Colors.WHITE,
    borderRadius: 99,
  },
  username: {
    fontFamily: 'outfit-medium',
    color: Colors.WHITE,
    fontSize: 20,
  },
  description: {
    fontFamily: 'outfit',
    color: Colors.WHITE,
    fontSize: 15,
    marginTop: 7,
  },
  iconContainer: {
    flexDirection: 'column',
    gap: 10,
  },
});
