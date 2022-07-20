import { useState } from 'react';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { VStack } from 'native-base';

import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function Register() {

    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);
    const [patrimony, setPatrimony] = useState("");
    const [description, setDescription] = useState("");

    function handleNewOrderRegister() {

        if (patrimony.length === 0 || description.length === 0) {

            return Alert.alert("Register", "Please put your patrimony and description");
        }

        setIsLoading(true);

        firestore()
            .collection("orders")
            .add({
                patrimony,
                description,
                created_at: firestore.FieldValue.serverTimestamp(),
                status: "open",
            })
            .then(() => {
                setPatrimony("");
                setDescription("");

                Alert.alert("Register", "Order registered successfully");
                navigation.goBack();
            })
            .catch(error => {
                Alert.alert("Register", "Can't possible register your order");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <VStack flex={1} p={6} bg="gray.600">
            <Header title="Register" />

            <Input
                placeholder='Patrimony number'
                mt={4}
                value={patrimony}
                onChangeText={(text) => setPatrimony(text)}
            />

            <Input
                placeholder='Problem description'
                flex={1}
                mt={5}
                multiline
                textAlignVertical='top'
                value={description}
                onChangeText={(text) => setDescription(text)}
            />

            <Button
                title="Save"
                mt={5}
                onPress={handleNewOrderRegister}
            />
        </VStack>
    );
}