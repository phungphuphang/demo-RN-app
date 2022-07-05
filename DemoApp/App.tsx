/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';

import { useWalletConnect, withWalletConnect } from '@walletconnect/react-native-dapp'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheme } from './app.json'

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4, address.length
  )}`
}

const App = () => {
  const connector = useWalletConnect();

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector])

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector])

  return (
    <View style={[StyleSheet.absoluteFill, styles.center]}>
      {!connector.connected && (
       <TouchableOpacity onPress={connectWallet}>
        <Text>Connect a Wallet</Text>
       </TouchableOpacity>
      )}
      {!!connector.connected && (
        <View style={styles.center}>
          <Text>{shortenAddress(connector.accounts[0])}</Text>
          <TouchableOpacity style={styles.paddingTop} onPress={killSession}>
            <Text>Log out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  paddingTop: {
    marginTop: 18
  },
  center: {
    alignItems: 'center', justifyContent: 'center'
  }
});

export default withWalletConnect(App, {
  redirectUrl: Platform.OS === 'web' ? window.location.origin : `${scheme}://`,
  storageOptions: {
    asyncStorage: AsyncStorage
  }
});
