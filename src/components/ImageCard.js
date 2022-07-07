import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, SafeAreaView, Pressable, Alert } from 'react-native';
import AntDesing from 'react-native-vector-icons/AntDesign';
import Theme from '../core/theme';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import Button from '../components/Button';


function ImageCard({ title, uri, onSelect }) {
    const { colors } = Theme;
    const { width, height } = Dimensions.get('window');
    const [modal, setModal] = useState(false);

    const styles = StyleSheet.create({
        container: {
            marginTop: 15
        },
        title: {
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            color: '#000',
            marginBottom: 8
        },
        imageContainer: {
            borderColor: 'gray',
            borderStyle: 'dashed',

        },
        image: {
            height: height / 3.5,
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center'
        },
        options: {
            backgroundColor: 'white',
            flexDirection: 'row',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            padding: 20
        },
        option: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        optionText: {
            fontSize: 16,
            color: '#000'
        }
    });

    const pickerConfig = {
        width: width,
        height: height / 3,
        cropping: true,
        cropperToolbarTitle: 'Fotoğrafı Kırp',
        loadingLabelText: 'Lütfen bekleyin...',
        mediaType: 'photo',
        includeBase64: true
    }

    const handleLibrary = () => {
        ImagePicker.openPicker(pickerConfig).then(image => {
            setModal(false);
            onSelect(image.data);
        }).catch(() => {
            setModal(false);
            /*Alert.alert('Uyarı', 'Bir sorun oluştu, lütfen tekrar deneyin', [
                { text: "Tamam", onPress: () => { }, }
            ]);*/
        })
    }

    const handleCamera = () => {
        ImagePicker.openCamera(pickerConfig).then(image => {
            setModal(false);
            onSelect(image.data);
        }).catch(() => {
            setModal(false);
            /*Alert.alert('Uyarı', 'Bir sorun oluştu, lütfen tekrar deneyin', [
                { text: "Tamam", onPress: () => { }, }
            ]);*/
        })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity activeOpacity={0.5} onPress={() => setModal(true)} disabled={uri}>
                <View style={[styles.imageContainer, { borderWidth: uri ? 0 : 1 }]}>
                    <ImageBackground style={styles.image} source={{ uri: `data:image/png;base64,${uri}` }} resizeMode="stretch">
                        {!uri ? (
                            <React.Fragment>
                                <AntDesing name='picture' size={20} />
                                <Text style={{ textAlign: 'center' }}>Fotoğraf seçmek için tıklayın</Text>
                            </React.Fragment>
                        ) : null}
                    </ImageBackground>
                </View>
            </TouchableOpacity>
            {uri ? <Button mode="contained" onPress={() => onSelect(null)} style={{ backgroundColor: colors.secondary }} >
                Fotoğrafı Sil
            </Button> : null}
            <Modal
                isVisible={modal}
                onBackButtonPress={() => setModal(false)}
                onBackdropPress={() => setModal(false)}
                style={{ justifyContent: 'flex-end', margin: 0 }}>
                <SafeAreaView style={styles.options}>
                    <Pressable style={styles.option} onPress={handleLibrary}>
                        <AntDesing name='picture' size={30} color='#000' />
                        <Text style={styles.optionText}>Fotoğraflar </Text>
                    </Pressable>
                    <Pressable style={styles.option} onPress={handleCamera}>
                        <AntDesing name="camera" size={30} color='#000' />
                        <Text style={styles.optionText}>Kamera</Text>
                    </Pressable>
                </SafeAreaView>
            </Modal>
        </View>
    )
}

export default ImageCard;