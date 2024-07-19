import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import ProfileIntro from './ProfileIntro';
import { supabase } from '../../Utils/SupabaseConfig';
import { useUser } from '@clerk/clerk-expo';
import UserPostList from './UserPostList';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [postList, setPostList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && GetUserPost();
  }, [user]);

  const GetUserPost = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('PostList')
      .select('*,VideoLikes(postIdRef,userEmail),Users(*)')
      .eq('emailRef', user?.primaryEmailAddress?.emailAddress)
      .order('id', { ascending: false });

    if (data) {
      setPostList(data);
      setLoading(false);
    }

    if (error) {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        onRefresh={() => GetUserPost()}
        refreshing={loading}
        data={[{ id: 1 }]}
        renderItem={({ item, index }) => (
          <View>
            <ProfileIntro postList={postList} />
            <UserPostList
              postList={postList}
              GetLatestVideoList={GetUserPost}
              loading={loading}
              showDeleteIcon={true} // Pass showDeleteIcon prop
            />
          </View>
        )} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
