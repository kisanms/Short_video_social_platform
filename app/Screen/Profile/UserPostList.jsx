import { View, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import VideoThumbnailItem from '../HomeScreen/VideoThumbnailItem';

export default function UserPostList({ postList, GetLatestVideoList, loading, showDeleteIcon }) {
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={postList}
        numColumns={2}
        onRefresh={GetLatestVideoList}
        refreshing={loading}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <VideoThumbnailItem video={item} showDeleteIcon={showDeleteIcon}
          refreshData={() => GetLatestVideoList()} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
});
