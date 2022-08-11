import React, {useEffect, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  ActivityIndicator,
  Button
} from 'react-native';

import {CoreContext, CoreConsumer} from '../context/CoreManagement';

import {useNavigation} from '@react-navigation/native';

export default function View2(props) {

  const navigation = useNavigation();

  const {route} = props;

  const {params} = route;

  const result = useContext(CoreContext);

  console.log(result.tag + ' View2 ');

  useEffect(() => {
    const focus = props.navigation.addListener('focus', async () => {
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> View2 Refresh');
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>> props ' + JSON.stringify(props),
      );
    });
    return focus;
  }, [props, props.navigation]);

  return (
    <CoreConsumer>
      {({value, SetValue}) => (
        // eslint-disable-next-line react-native/no-inline-styles
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            backgroundColor: '#273623',
          }}>
          <Text>View2 : {value} </Text>
          <Button
            title="Next"
            onPress={() => {
              SetValue(["dfd","fas"]);
            }}
          />
        </View>
      )}
    </CoreConsumer>
  );
}