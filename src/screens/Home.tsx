import { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Heading, HStack, IconButton, Text, useTheme, VStack, FlatList, Center } from 'native-base';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';

import { dateFormat } from '../utils/firestoreDateFormat';

import Logo from '../assets/logo_secondary.svg';

import { Filter, FilterType } from '../components/Filter';
import { Order, OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';
import { Button } from '../components/Button';

export function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [statusSelected, setStatusSelected] = useState<FilterType>('open');
    const [orders, setOrders] = useState<OrderProps[]>([]);

    const navigation = useNavigation();
    const { colors } = useTheme();

    function handleNewOrder() {
        navigation.navigate('register');
    }

    function handleOpenDetails(orderId: string) {
        navigation.navigate('details', { orderId });
    }

    function handleLogout() {

        auth()
            .signOut()
            .catch(error => {
                Alert.alert('Logout', 'Can\'t possible logout');
            });
    }

    useEffect(() => {
        setIsLoading(true);

        const subscriber = firestore()
            .collection('orders')
            .where('status', '==', statusSelected)
            .onSnapshot(snapshot => {

                const data = snapshot.docs.map(doc => {
                    const { patrimony, description, created_at, status } = doc.data();

                    return {
                        id: doc.id,
                        patrimony,
                        description,
                        status,
                        when: dateFormat(created_at),
                    }
                });

                setOrders(data);
                setIsLoading(false);
            });

        return subscriber;
    }, [statusSelected]);

    return (
        <VStack flex={1} pb={6} bg="gray.700">
            <HStack
                w="full"
                justifyContent="space-between"
                alignItems="center"
                bg="gray.600"
                pt={12}
                pb={5}
                px={6}
            >
                <Logo />
                <IconButton
                    icon={<SignOut size={26} color={colors.gray[300]} />}
                    onPress={handleLogout}
                />
            </HStack>

            <VStack flex={1} px={6}>
                <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center">
                    <Heading color="gray.100">
                        My Calls
                    </Heading>
                    <Text color="gray.200">
                        {orders.length}
                    </Text>
                </HStack>

                <HStack space={3} mb={8}>
                    <Filter
                        type="open"
                        title="doing"
                        onPress={() => setStatusSelected('open')}
                        isActive={statusSelected === 'open'}
                    />
                    <Filter
                        type="closed"
                        title="done"
                        onPress={() => setStatusSelected('closed')}
                        isActive={statusSelected === 'closed'}
                    />
                </HStack>

                {isLoading ? <Loading /> : (

                    <FlatList
                        data={orders}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(String(item.id))} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={() => (
                            <Center>
                                <ChatTeardropText color={colors.gray[300]} size={40} />
                                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                    You don't have any {'\n'}
                                    {statusSelected === 'open' ? "doing" : "done"} calls
                                </Text>
                            </Center>
                        )}
                    />
                )}

                <Button title="New Call" onPress={handleNewOrder} />
            </VStack>
        </VStack>
    );
}