import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

export interface LoginProps {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
}
