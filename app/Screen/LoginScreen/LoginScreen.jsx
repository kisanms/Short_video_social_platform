import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Video, ResizeMode } from 'expo-av';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Colors from '../../Utils/Colors';
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from '../../hooks/useWarmUpBrowser';

import { useOAuth } from "@clerk/clerk-expo";
import { supabase } from '../../Utils/SupabaseConfig';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
        if (signUp?.emailAddress) {

          const { data, error } = await supabase
            .from('Users')
            .insert([
              {
                name: signUp?.firstName, email: signUp?.emailAddress,
                username: (signUp?.emailAddress).split('@')[0]
              },
            ])
            .select()
          if (data) {
            console.log(data);
          }

        }
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);
  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <Video
        style={styles.video}
        source={{ uri: 'https://cdn.pixabay.com/video/2024/03/31/206294_large.mp4' }}
        shouldPlay
        resizeMode={ResizeMode.COVER}
        isLooping={true}
      />
      <View style={{ display: 'flex', alignItems: "center", justifyContent: "center", marginTop: hp(10) }}>
        <Text style={{
          fontFamily: 'outfit-bold',
          color: Colors.BLACK,
          fontSize: 35
        }}>
          Time<Text style={{ color: 'maroon' }}>Pass</Text>
        </Text>
        <Text style={{ fontFamily: 'outfit-bold', fontSize: hp(2.1), textAlign: 'center', marginTop: 15 }}>
          Where Every Moment is a New Trend!
        </Text>
        <TouchableOpacity onPress={onPress} style={{ display: 'flex', alignItems: 'center', gap: 10, flexDirection: 'row', backgroundColor: Colors.WHITE, padding: 10, paddingHorizontal: 55, borderRadius: 99, position: 'absolute', bottom: hp(-65) }}>
          <Image source={require('./../../../assets/images/search.png')} style={{ width: hp(5), height: hp(5) }} />
          <Text style={{ fontFamily: 'outfit', fontSize: hp(1.9) }}>Sign In with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    height: hp(100),
    width: wp(100),
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
