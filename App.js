import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default class App extends Component {
  state = {
    image: null,
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri })

      let base64Img = `data:image/jpg;base64,${result.base64}`

      //Add your cloud name
      let apiUrl = 'https://api.cloudinary.com/v1_1/kcstoreapp/image/upload';

      let data = {
        "file": base64Img,
        "upload_preset": "lfwdyc0a",
      }

      fetch(apiUrl, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
      }).then(async r => {
        let data = await r.json()
        console.log(data.secure_url)
        return data.secure_url
      }).catch(err => console.log(err))
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.pickImage()} style={{ width: 200, alignSelf: 'center' }}>
          <View style={{ backgroundColor: 'transparent' }}>
            {this.state.image ?
              <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200, borderRadius: 100, alignSelf: 'center' }} />
              :
              <View style={{ backgroundColor: 'grey', width: 200, height: 200, borderRadius: 100 }} />
            }
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  }
});
