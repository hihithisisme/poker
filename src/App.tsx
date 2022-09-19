import { ChakraProvider } from '@chakra-ui/react';
import * as React from 'react';
import { hot } from "react-hot-loader/root";
import Calculator from './pages/Calculator';

interface Props {
    name: string
}

function App(props: Props) {
    return (
        <ChakraProvider>
            <Calculator {...props} />
        </ChakraProvider>
    );
}

export default hot(App);
