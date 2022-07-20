import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { SignIn } from '../screens/SignIn';
import { Loading } from '../components/Loading';

import { AppRoutes } from './app.routes';

export function Routes() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

    useEffect(() => {
        const subscriber = auth()
            .onAuthStateChanged(user => {
                setUser(user);
                setLoading(false);
            });

        return subscriber;
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <NavigationContainer>
            {user ? <AppRoutes /> : <SignIn />}
        </NavigationContainer>
    )
}