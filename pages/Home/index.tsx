import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ThemeColors } from '../../constants';
import { HomeProps } from './interfaces';
import Post from '../../components/Post';
import { getTokens, refreshToken } from '../../utils/authUtils';

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColors.background,
    height: '100%',
    paddingTop: 30,
  },
});

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const [afterToken, setAfterToken] = React.useState<string>();
  const [postData, setPostData] = React.useState<any[]>([]);

  // Will fetch r/home posts for current user
  const getPosts = (after?: string) => {
    const afterString = `after=${after}`;
    getTokens().then(tokens => {
      fetch(`https://oauth.reddit.com/best?${after ? afterString : ''}`, {
        headers: {
          'Authorization': `bearer ${tokens.accessToken}`,
          'User-Agent': 'android:skim@v1.0.0',
        }
      })
      .then(res => {
        if (res.status === 401 || res.status === 400) {
          refreshToken().then(() => {
            // getPosts();
          });
        }
        else {
          return res.json();
        }
      })
      .then(res => {
        setAfterToken(res.data.after);
        setPostData(postData.concat(res.data.children));
      });
    });
  };

  React.useEffect(() => {
    getPosts();
  }, []);
  
  return (
    <FlatList
      style={styles.container}
      data={postData}
      keyExtractor={item => item.data.id}
      renderItem={({ item }) => (
        <Post item={item} />
      )}
      onEndReached={() => {
        getPosts(afterToken);
      }}>
    </FlatList>
  );
};

export default Home;
