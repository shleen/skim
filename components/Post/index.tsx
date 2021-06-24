import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeColors } from '../../constants';
import { PostProps } from './interfaces';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { getTokens } from '../../utils/authUtils';

const styles = StyleSheet.create({
  postWrapper: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  voteWrapper: {
    marginRight: 5,
    marginTop: 16,
  },
  contentWrapper: {
    flexShrink: 1,
  },
  subredditText: {
    color: ThemeColors.text,
    fontSize: 14,
    fontFamily: 'PTSans_400Regular',
  },
  titleText: {
    color: ThemeColors.text,
    fontSize: 20,
    fontFamily: 'PTSans_700Bold',
    paddingRight: 3,
  },
  selfText: {
    color: ThemeColors.text,
    fontSize: 16,
    fontFamily: 'PTSans_400Regular',
  },
  pill: {
    backgroundColor: ThemeColors.text,
    borderRadius: 15,
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginTop: 5,
  },
});

const Post: React.FC<PostProps> = ({ item }) => {
  const [currentVote, setCurrentVote] = React.useState<number>(item.data.likes ? 1 : (item.data.likes == null ? 0 : -1));

  const toggleVote = (vote: number, postId: string) => {
    const oldVote = currentVote;

    // Update state
    setCurrentVote(vote == currentVote ? 0 : vote);

    getTokens().then(tokens => {
      fetch('https://oauth.reddit.com/api/vote', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `dir=${vote == currentVote ? 0 : vote}&id=t3_${postId}&rank=2`
      })
      .then(res => {
        if (res.status !== 200) {
          // Revert vote
          setCurrentVote(oldVote);

          console.error(`Something went wrong while retrieving posts. Status: ${res.status}, StatusText: ${res.statusText}`);
        }
      });
    });
  };

  return (
    <View style={styles.postWrapper}>
      <View style={styles.voteWrapper}>
        <Icon
          name='chevron-up'
          color={currentVote == 1 ? ThemeColors.accent : ThemeColors.text}
          size={24}
          style={{ marginBottom: 10 }}
          onPress={() => toggleVote(1, item.data.id)} />
        <Icon
          name='chevron-down'
          color={currentVote == -1 ? ThemeColors.accent : ThemeColors.text}
          size={24}
          onPress={() => toggleVote(-1, item.data.id)} />
      </View>
      <View style={styles.contentWrapper}>
        <Text style={styles.subredditText}>r/{item.data.subreddit}</Text>
        <Text style={styles.titleText}>{item.data.title}</Text>
        {!!item.data.selftext && <Text style={styles.selfText} numberOfLines={3}>{item.data.selftext}</Text>}
        {item.data.preview &&
          <Icon name={item.data.is_video ? 'video' : 'image'} size={14} color={ThemeColors.background} style={styles.pill} />
        }
      </View>
    </View>
  );
};

export default Post;
