import React, { useEffect, useState } from 'react';
import { View, BackHandler, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Theme from '../core/theme';
import Button from '../components/Button';
import ImageCard from '../components/ImageCard';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TextInput from '../components/TextInput';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import ImagesMerge from 'react-native-images-merge';

function HomeScreen({ navigation }) {
    //#region BackButton Disable
    const isFocused = useIsFocused();
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => isFocused)
        return () => backHandler.remove()
    })
    //#endregion
    const { colors } = Theme;
    const [images, setImages] = useState({ front: null, back: null });
    const [form, setForm] = useState({ customer: '', error: '', data: [], _wait: false });
    const [settings, setSettings] = useState({ protocol: '', ip: '', port: '' });

    useEffect(() => {
        EncryptedStorage.getItem('settings').then((data) => {
            let settingsJson = JSON.parse(data);

            if (settingsJson) {
                setSettings({ ...settingsJson });
            }
        })
    }, []);

    const handleUpload = () => {
        if (images.front && images.back) {
            if (form.customer) {
                ImagesMerge.mergeImages([
                    { uri: images.front },
                    { uri: images.back }],
                    (base64) => {
                        setForm({ ...form, _wait: true, error: '' });
                        axios.post(`${settings.protocol + settings.ip}:${settings.port}` + '/resimapp.php', {
                            customerNumber: form.customer,
                            photo: base64
                        }).then((resp) => {
                            setForm({ ...form, _wait: false, error: '' });

                            if (resp.data.status === 'success') {
                                Alert.alert('Bilgi', 'Yükleme işlemleri başarı ile tamamlandı!', [
                                    {
                                        text: "Tamam", onPress: () => {
                                            setForm({ ...form, _wait: false, customer: '', error: '' });
                                            setImages({ ...images, front: null, back: null });
                                        },
                                    }
                                ]);
                            }
                            else if (resp.data.status === 'customer-not-found') {
                                setForm({ ...form, error: 'Müşteri numarası bulunamadı!', _wait: false });
                            }
                            else if (resp.data.status === 'photo-upload-error') {
                                Alert.alert('Uyarı', 'Yükleme başarısız, sunucu ayarlarınız hatalı olabilir!', [
                                    { text: "Tamam", onPress: () => { }, }
                                ]);
                            }
                        }).catch(() => {
                            setForm({ ...form, _wait: false });
                            Alert.alert('Uyarı', 'Sunucuya ulaşılamıyor, lütfen internet bağlantınızı kontrol edin!', [
                                { text: "Tamam", onPress: () => { }, }
                            ]);
                        })
                    })
            }
            else {
                Alert.alert('Uyarı', 'Lütfen müşteri numarasını boş bırakmayın!', [
                    { text: "Tamam", onPress: () => { }, }
                ]);
            }
        }
        else {
            Alert.alert('Uyarı', 'Lütfen kimlik fotoğraflarını boş bırakmayın!', [
                { text: "Tamam", onPress: () => { }, }
            ]);
        }
    }

    return (
        <View style={{ backgroundColor: '#fff', flex: 1, paddingHorizontal: 15, }}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <ImageCard title="Ön Taraf" uri={images.front} onSelect={(image) => setImages({ ...images, front: image })} disabled={form._wait} />
                <ImageCard title="Arka Taraf" uri={images.back} onSelect={(image) => setImages({ ...images, back: image })} disabled={form._wait} />

                <View style={{ marginVertical: 10 }}>
                    <TextInput
                        label='Müşteri Numarası'
                        disabled={form._wait}
                        returnKeyType='done'
                        onChangeText={text => setForm({ ...form, customer: text })}
                        value={form.customer}
                        error={!!form.error}
                        errorText={form.error}
                        autoCapitalize='none'
                        keyboardType='numeric'
                    />
                    <Button mode="contained" onPress={form._wait ? null : handleUpload} style={{ backgroundColor: colors.primary }} >
                        {form._wait ? 'Lütfen bekleyin...' : 'Yükle'}
                    </Button>
                </View>

            </KeyboardAwareScrollView>
        </View>
    )
}

export default HomeScreen