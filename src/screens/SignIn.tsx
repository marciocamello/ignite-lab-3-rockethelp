import { useState } from 'react';
import { Heading, Icon, VStack, useTheme } from "native-base";
import { Envelope, Key } from "phosphor-react-native";

import Logo from "../assets/logo_primary.svg";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function SignIn() {

    const { colors } = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSignIn() {
        console.log("Sign in", email, password);
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
                value={email}
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
                value={password}
                onChangeText={setPassword}
            />

            <Button
                title="Enter"
                w="full"
                onPress={handleSignIn}
            />
        </VStack>
    );
}