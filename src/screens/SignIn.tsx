import { useState } from 'react';
import auth from "@react-native-firebase/auth";
import { Alert } from 'react-native';
import { Heading, Icon, VStack, useTheme } from "native-base";
import { Envelope, Key } from "phosphor-react-native";

import Logo from "../assets/logo_primary.svg";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function SignIn() {

    const { colors } = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function handleSignIn() {

        if (email.length === 0 || password.length === 0) {

            return Alert.alert("Login", "Please put your email and password");
        }

        setIsLoading(true);

        auth()
            .signInWithEmailAndPassword(email, password)
            .then(response => {
                console.log(response);
            })
            .catch(error => {

                if (error.code === "auth/invalid-email") {

                    return Alert.alert("Login", "Email invalid");
                }

                if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {

                    return Alert.alert("Login", "Email or password is invalid");
                }

                return Alert.alert("Login", "Something went wrong");
            })
            .finally(() => {

                setIsLoading(false);
            });

    }

    return (
        <VStack
            flex={1}
            alignItems="center"
            bg="gray.600"
            px={8}
            pt={24}
        >
            <Logo />

            <Heading
                color="gray.100"
                fontSize="xl"
                mt={20}
                mb={6}
            >
                Access you account
            </Heading>

            <Input
                placeholder="E-mail"
                mb={4}
                InputLeftElement={<Icon as={
                    <Envelope
                        color={colors.gray["300"]}
                    />}
                    ml={4}
                />}
                onChangeText={setEmail}
            />

            <Input
                placeholder="Password"
                InputLeftElement={<Icon as={
                    <Key
                        color={colors.gray["300"]}
                    />}
                    ml={4}
                />}
                mb={8}
                secureTextEntry
                onChangeText={setPassword}
            />

            <Button
                title="Enter"
                w="full"
                onPress={handleSignIn}
                isLoading={isLoading}
            />
        </VStack>
    );
}