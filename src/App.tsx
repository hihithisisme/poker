import { ChakraProvider } from '@chakra-ui/react';
import * as React from 'react';
import { hot } from "react-hot-loader/root";
import PlayerProfitsAssignment from './PlayerProfitsAssignment/PlayerProfitsAssignment';

interface Props {
    name: string
}

function App(props: Props) {
    return (
        <ChakraProvider>
            <PlayerProfitsAssignment {...props} />
        </ChakraProvider>
    );
}

export default hot(App);
