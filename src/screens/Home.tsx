import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Heading, HStack, IconButton, Text, useTheme, VStack, FlatList, Center } from 'native-base';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';

import Logo from '../assets/logo_secondary.svg';

import { Filter, FilterType } from '../components/Filter';
import { Order, OrderProps } from '../components/Order';
import { Button } from '../components/Button';

export function Home() {
    const [statusSelected, setStatusSelected] = useState<FilterType>('open');
    const [orders, setOrders] = useState<OrderProps[]>([
        {
            id: 1,
            patrimony: '123456789',
            when: '2020-01-01',
            status: 'open',
        },
        {
            id: 2,
            patrimony: '123456789',
            when: '2020-01-02',
            status: 'closed',
        },
        {
            id: 3,
            patrimony: '123456789',
            when: '2020-01-02',
            status: 'closed',
        },
        {
            id: 4,
            patrimony: '123456789',
            when: '2020-01-02',
            status: 'closed',
        },
        {
            id: 5,
            patrimony: '123456789',
            when: '2020-01-02',
            status: 'closed',
        },
        {
            id: 6,
            patrimony: '123456789',
            when: '2020-01-02',
            status: 'closed',
        },
        {
            id: 7,
            patrimony: '123456789',
            when: '2020-01-02',
            status: 'closed',
        },
        {
            id: 8,
            patrimony: '123456789',
            when: '2020-01-02',
            status: 'closed',
        }
    ]);

    const navigation = useNavigation();
    const { colors } = useTheme();

    function handleNewOrder() {
        navigation.navigate('register');
    }

    function handleOpenDetails(orderId: string) {
        navigation.navigate('details', { orderId });
    }

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

                <Button title="New Call" onPress={handleNewOrder} />
            </VStack>
        </VStack>
    );
}