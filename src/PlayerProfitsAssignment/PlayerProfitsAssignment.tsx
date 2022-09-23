import { AddIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, FormControl, FormLabel, Heading, HStack, IconButton, Input, InputGroup, InputLeftAddon, NumberInput, NumberInputField, Stack, StackDivider, Text, VStack } from '@chakra-ui/react';
import { FieldArray, Form, Formik } from 'formik';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { convertZeroSumFlowToLP, parseVariableKey, solve } from "./solver";

interface Props {
    name: string
}

interface Player {
    name: string
    profit: number
}

enum View {
    form,
    report
}

function createEmptyPlayer(): Player {
    return { name: "", profit: 0 }
}

function solveAssignmentProblem(profits: Player[]) {
    return solve(convertZeroSumFlowToLP(profits));
}

export default function PlayerProfitsAssignment(props: Props) {
    const [playersProfits, setPlayersProfits] = useState<null | Player[]>(null);
    const [view, setView] = useState(View.form);

    useEffect(() => {
        console.log('players profits', JSON.stringify(playersProfits, null, 2));
    }, [playersProfits])

    return (
        <Flex bg="gray.100" align="center" justify="center" h="100vh">
            <Box bg="white" p={6} rounded="md" w="80vw" maxW="800px">
                {view === View.form &&
                    (<Formik
                        initialValues={{ players: playersProfits || [createEmptyPlayer()] }}
                        onSubmit={(values) => {
                            setPlayersProfits(values.players)
                            setView(View.report)
                        }}
                        render={({ values }) => (
                            <Form>
                                <FieldArray
                                    name="players"
                                    render={arrHelpers => (
                                        <VStack spacing={4} align="flex-start">
                                            <VStack spacing={4} overflowY="scroll" maxH="60vh" w="100%" pr="2" css={{
                                                "&::-webkit-scrollbar": {
                                                    width: "4px",
                                                },
                                                "&::-webkit-scrollbar-track": {
                                                    width: "6px",
                                                },
                                                "&::-webkit-scrollbar-thumb": {
                                                    background: "gray",
                                                    borderRadius: "24px",
                                                },
                                            }}>
                                                {values.players.map((player: Player, index: number) => {
                                                    return (
                                                        <FormControl>
                                                            <FormLabel>
                                                                {/* TODO: adjust fontSize responsively */}
                                                                <Text fontSize='lg'>Player {index}</Text>
                                                            </FormLabel>
                                                            <Stack direction={'row'} spacing={4}>
                                                                <InputGroup>
                                                                    <InputLeftAddon children='name' />
                                                                    <Input
                                                                        id={`player_${index}_name`}
                                                                        name="player name"
                                                                        variant="outline"
                                                                        onChange={(e) => arrHelpers.replace(index, { ...player, name: e.currentTarget.value })}
                                                                        defaultValue={player.name}
                                                                    />
                                                                </InputGroup>
                                                                <InputGroup>
                                                                    <InputLeftAddon children='profit' />
                                                                    <NumberInput
                                                                        id={`player_${index}_profit`}
                                                                        name="player profit"
                                                                        variant="outline"
                                                                        onChange={(_, num) => arrHelpers.replace(index, { ...player, profit: num })}
                                                                        defaultValue={player?.profit || 0}
                                                                        precision={2}
                                                                    >
                                                                        <NumberInputField pattern="(-)?[0-9]*(.[0-9]+)?" />
                                                                    </NumberInput>
                                                                </InputGroup>
                                                            </Stack>
                                                        </FormControl>
                                                    )
                                                })}

                                                <Box minH={6}>
                                                    <IconButton aria-label='Search database' icon={<AddIcon />} variant="solid" borderRadius="50%" onClick={() => {
                                                        arrHelpers.push(createEmptyPlayer());
                                                    }} />
                                                </Box>
                                                <StackDivider />
                                                <StackDivider />
                                            </VStack>

                                            <Button type="submit" colorScheme="purple" isFullWidth>
                                                Submit
                                            </Button>
                                        </VStack>
                                    )}
                                />
                            </Form>
                        )}
                    />)
                }

                {view === View.report && (
                    <VStack spacing={4}>
                        <Heading>O$P$</Heading>
                        {/* TODO: consider to make this into a grid/Table instead -- something that's aligned at least */}
                        {Object.entries(solveAssignmentProblem(playersProfits!)).map((kvp, idx) => {
                            const [key, val] = kvp;
                            const parsed = parseVariableKey(key);

                            return (
                                <HStack key={idx}>
                                    <Text>
                                        {parsed.ower}
                                    </Text>
                                    <ArrowForwardIcon />
                                    <Text>
                                        {parsed.owee} {displayMoney(val)}
                                    </Text>

                                </HStack>
                            )

                        })}
                        <Button onClick={() => setView(View.form)}>
                            Return to form
                        </Button>
                    </VStack>
                )}
            </Box>
        </Flex>
    );
}

function displayMoney(val: number): string {
    return new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(val);
}

