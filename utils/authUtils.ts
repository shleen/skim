import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'react-native-base64'

export const getTokens = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('tokens');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Something went wrong while trying to get the tokens: ', e)
  }
};

export const refreshToken = async () => {
  getTokens().then(tokens => {
    fetch(`https://www.reddit.com/api/v1/access_token?grant_type=refresh_token&refreshToken=${tokens.refreshToken}`,
    {
      headers: {
        'Authorization': `Basic ${base64.encode('bNUVcYx8dKc4gw:')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    })
    .then(response => response.text() )
    .then(async text => {
      // Parse response
      let response = JSON.parse(text);

      // Store tokens
      await AsyncStorage.setItem('tokens', JSON.stringify({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
      }));
    });
  });
};
