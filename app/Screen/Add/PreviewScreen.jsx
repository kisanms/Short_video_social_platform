import { View, Text, Image, TextInput, ScrollView, KeyboardAvoidingView, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Colors from '../../Utils/Colors';
import { Ionicons } from '@expo/vector-icons';
import { s3bucket } from '../../Utils/S3BucketConfig';
import { useUser } from '@clerk/clerk-expo';
import { supabase } from '../../Utils/SupabaseConfig';

export default function PreviewScreen() {
  const navigation = useNavigation();
  const params = useRoute().params;
  const { user } = useUser();
  const [description, setDescription] = useState();
  const [videoUrl, setVideoUrl] = useState();
  const [thumbnailUrl, setThumbnailUrl] = useState();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (videoUrl && thumbnailUrl && description && user) {
      saveVideoDetailsToSupabase();
    }
  }, [videoUrl, thumbnailUrl]);

  const postHandler = async () => {
    setUploading(true);
    await UploadFileToAws(params.video, 'video');
    await UploadFileToAws(params.thumbnail, 'image');
    setUploading(false);
    navigation.goBack();
  }

  const UploadFileToAws = async (file, type) => {
    const fileType = file.split('.').pop(); // ex: .mp4 , .jpg
    const params = {
      Bucket: 'timepass-app',
      Key: `km-${Date.now()}.${fileType}`, // ex: km-212221.mp4
      Body: await fetch(file).then(resp => resp.blob()),
      ACL: 'public-read',
      ContentType: type === 'video' ? `video/${fileType}` : `image/${fileType}`,
    }
    try {
      const data = await s3bucket.upload(params)
        .promise().then(resp => {
          console.log('file uploaded successfully..');
          if (type === 'video') {
            setVideoUrl(resp?.Location);
          } else {
            setThumbnailUrl(resp?.Location);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  const saveVideoDetailsToSupabase = async () => {
    const { data, error } = await supabase
      .from('PostList')
      .insert([
        {
          videoUrl: videoUrl,
          thumbnail: thumbnailUrl,
          description: description,
          emailRef: user.primaryEmailAddress.emailAddress,
        }
      ])
      .select();
    if (error) {
      console.log('Error saving video details to Supabase:', error);
    } else {
      console.log('Video details saved to Supabase:', data);
    }
  }

  return (
    <KeyboardAvoidingView style={{ backgroundColor: Colors.WHITE, flex: 1 }}
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 20}>
      <ScrollView style={{ padding: 5 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Ionicons name="arrow-back-circle-outline" size={40} color="black" />
          <Text style={{ fontFamily: 'outfit', fontSize: 15, }}>Back</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center', marginTop: heightPercentageToDP(3) }}>
          <Text style={{ fontFamily: 'outfit-bold', fontSize: 20 }}>Add Details</Text>
          <Image source={{ uri: params?.thumbnail }}
            style={{
              width: widthPercentageToDP(55),
              height: heightPercentageToDP(35),
              borderRadius: 20,
              marginTop: heightPercentageToDP(2),
              marginBottom: heightPercentageToDP(2)
            }} />
          <TextInput
            numberOfLines={3}
            placeholder='Description'
            onChangeText={(value) => setDescription(value)}
            style={{
              borderWidth: 1,
              width: '100%',
              borderRadius: 10,
              borderColor: Colors.BACKGROUND_TRANSP,
              paddingHorizontal: 20,
            }} />
          <TouchableOpacity
            onPress={postHandler}
            style={{
              backgroundColor: Colors.BLACK,
              padding: 7,
              paddingHorizontal: 20,
              borderRadius: 99,
              marginTop: 15,
              marginBottom: heightPercentageToDP(2)
            }}
            disabled={uploading}
          >
            <Text style={{ color: Colors.WHITE, fontSize: 18, fontFamily: 'outfit' }}>
              {uploading ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
