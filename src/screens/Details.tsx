import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { VStack, Text, HStack, useTheme, ScrollView, Box } from 'native-base';
import { CircleWavyCheck, ClipboardText, DesktopTower, Hourglass } from 'phosphor-react-native';
import { Alert } from 'react-native';

import { dateFormat } from '../utils/firestoreDateFormat';

import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';

type RouteParams = {
    orderId: string;
}

type OrderDetails = OrderProps & {
    description: string;
    solution: string;
    closed: string;
}

export function Details() {
    const { colors } = useTheme();

    const [isLoading, setIsLoading] = useState(true);
    const [solution, setSolution] = useState<string>('');
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

    const route = useRoute();
    const navigation = useNavigation();

    const { orderId } = route.params as RouteParams;

    function handleOrderClose() {
        if (!solution) {
            return Alert.alert('Order', 'Please, provide a solution');
        }

        firestore()
            .collection<OrderFirestoreDTO>('orders')
            .doc(orderId)
            .update({
                status: "closed",
                solution,
                closed_at: firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                Alert.alert('Order', 'Order closed successfully');
                navigation.goBack();
            })
            .catch(() => {
                Alert.alert('Order', 'Error closing order');
            });
    }

    useEffect(() => {
        firestore()
            .collection<OrderFirestoreDTO>('orders')
            .doc(orderId)
            .get()
            .then(doc => {
                if (doc.exists) {
                    const {
                        patrimony,
                        description,
                        status,
                        created_at,
                        closed_at,
                        solution
                    } = doc.data() as OrderFirestoreDTO;

                    const closed = closed_at ? dateFormat(closed_at) : null;

                    setOrder({
                        id: doc.id,
                        patrimony,
                        description,
                        status,
                        solution,
                        when: dateFormat(created_at),
                        closed
                    });
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <VStack flex={1} bg="gray.700">
            <Box px={6} bg="gray.600">
                <Header title="Order Details" />
            </Box>
            <HStack
                bg="gray.500"
                justifyContent="center"
                p={4}
            >
                {
                    order.status === "closed"
                        ? <CircleWavyCheck size={22} color={colors.green[300]} />
                        : <Hourglass size={22} color={colors.secondary[700]} />
                }

                <Text
                    fontSize="sm"
                    color={order.status === "closed" ? colors.green[300] : colors.secondary[700]}
                    ml={2}
                    textTransform="uppercase"
                >
                    {order.status === "closed" ? "Done" : "Doing"}
                </Text>
            </HStack>

            <ScrollView mx={5} showsVerticalScrollIndicator={false}>

                <CardDetails
                    title="Equipment"
                    description={`Patrimony ${order.patrimony}`}
                    icon={DesktopTower}
                />

                <CardDetails
                    title="Problem Description"
                    description={`${order.description}`}
                    icon={ClipboardText}
                    footer={`Registered in ${order.when}`}
                />

                <CardDetails
                    title="Solution"
                    icon={CircleWavyCheck}
                    description={order.solution}
                    footer={order.closed && `Closed at ${order.closed}`}
                >
                    {
                        order.status === "open" &&
                        <Input
                            placeholder='Solution description'
                            onChangeText={text => setSolution(text)}
                            h={24}
                            textAlignVertical='top'
                            multiline
                        />
                    }
                </CardDetails>
            </ScrollView>

            {
                order.status === "open" &&
                <Button
                    title="Close order"
                    m={5}
                    onPress={handleOrderClose}
                />
            }
        </VStack>
    );
}