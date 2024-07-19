import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import OtherUserProfileIntro from './OtherUserProfileIntro';
import { supabase } from '../../Utils/SupabaseConfig';
import UserPostList from '../Profile/UserPostList';

export default function OtherUserProfile() {
  const params = useRoute().params;
  const [loading, setLoading] = useState(false);
  const [postList, setPostList] = useState([]);


  useEffect(() => {
    params && GetUserPost();
  }, [params]);

  const GetUserPost = async () => {
    // console.log(params.user)
    setLoading(true);
    const { data, error } = await supabase
      .from('PostList')
      .select('*,VideoLikes(postIdRef,userEmail),Users(*)')
      .eq('emailRef', params.user.email)
      .order('id', { ascending: false });

    if (data) {
      // console.log(data)
      setPostList(data);
      setLoading(false);
    }

    if (error) {
      setLoading(false);
    }
  };
  return (
    <View>
      <FlatList
        data={[{ id: 1 }]}
        renderItem={({ item, index }) => (
          <View>
            <OtherUserProfileIntro
              user={params.user}
              postList={postList} />
            <UserPostList
              postList={postList}
              GetLatestVideoList={GetUserPost}
              loading={loading}
              showDeleteIcon={true} // Pass showDeleteIcon prop
            />
          </View>
        )} />

    </View>
  )
}