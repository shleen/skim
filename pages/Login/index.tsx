import React from 'react';
import { LoginProps } from './interfaces';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ThemeColors } from '../../constants';
import { TouchableHighlight } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import base64 from 'react-native-base64'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTokens } from '../../utils/authUtils';

const STATE_STRING = 'state_string';
const SCOPE_STRING = 'read vote';
const REDIRECT_URL = Linking.createURL('/login');

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: ThemeColors.background,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logoText: {
    color: ThemeColors.accent,
    fontFamily: 'PTSans_400Regular',
    fontSize: 48,
    marginTop: 40,
  },
  underlinedLogoText: {
    maxWidth: 93,
    borderBottomColor: ThemeColors.accent,
    borderBottomWidth: 3,
    marginBottom: 20,
  },
  captionText: {
    color: ThemeColors.text,
    fontFamily: 'PTSans_400Regular',
    fontSize: 20,
  },
  signInButtonWrapper: {
    maxHeight: '30%',
    width: '60%',
  },
  signInButton: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

const openLink = async (navigation: any) => {
  try {
    const result = await WebBrowser.openAuthSessionAsync(
      `https://www.reddit.com/api/v1/authorize.compact?client_id=bNUVcYx8dKc4gw&response_type=code&state=${STATE_STRING}&redirect_uri=${REDIRECT_URL}&duration=permanent&scope=${SCOPE_STRING}`,
      REDIRECT_URL
    );

    // In app browser was dismissed, or for some other reason did not succeed. Prevent login procedure from continuing.
    if (!(result as any).url) return;

    const redirectData = Linking.parse((result as any).url);

    fetch(`https://www.reddit.com/api/v1/access_token?grant_type=authorization_code&code=${redirectData.queryParams['code']}&redirect_uri=${REDIRECT_URL}`, {
      headers: {
        'Authorization': `Basic ${base64.encode('bNUVcYx8dKc4gw:')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    })
    .then(response => ( response.text() ))
    .then(async text => {
      // Parse response
      let response = JSON.parse(text);

      // Store tokens
      await AsyncStorage.setItem('tokens', JSON.stringify({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
      }), () => navigation.navigate('Home'));
    });

  } catch (error) {
    console.error(`Something went wrong. Error: ${error}`);
  }
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
  React.useEffect(() => {
    // Check if we already have tokens stored
    getTokens().then(tokens => {
      if (tokens?.accessToken && tokens?.refreshToken) {
        navigation.navigate('Home');
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.underlinedLogoText}><Text style={styles.logoText}>skim.</Text></View>
      <Text style={styles.captionText}>📍 Where you login</Text>
      <TouchableHighlight
        onPress={async () => await openLink(navigation)}
        style={styles.signInButtonWrapper}
      >
        <Image
          resizeMode='cover'
          style={styles.signInButton}
          source={require('../../assets/images/google_signin_button.png')} />
      </TouchableHighlight>
    </View>
  );
};

export default Login;
