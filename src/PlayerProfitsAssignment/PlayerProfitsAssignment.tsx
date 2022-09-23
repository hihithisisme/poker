import { AddIcon, ArrowForwardIcon, EditIcon, MinusIcon } from "@chakra-ui/icons";
import { Box, Button, Editable, EditableInput, EditablePreview, Flex, FormControl, FormLabel, Heading, HStack, IconButton, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightAddon, InputRightElement, NumberInput, NumberInputField, SimpleGrid, Stack, StackDivider, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';
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
    form = "form",
    report = "report"
}

function createEmptyPlayer(index: number): Player {
    return { name: `Player ${index}`, profit: 0 }
}

function solveAssignmentProblem(profits: Player[]) {
    return solve(convertZeroSumFlowToLP(profits));
}

export default function PlayerProfitsAssignment(props: Props) {
    const [playersProfits, setPlayersProfits] = useState<Player[]>([createEmptyPlayer(1), createEmptyPlayer(2)]);
    const [display, setDisplay] = useState<Player[]>([createEmptyPlayer(1), createEmptyPlayer(2)]);
    const [view, setView] = useState(View.form);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const state = params.get("state")
        const view = params.get("view");
        if (state) {
            const parsed = JSON.parse(decodeURIComponent(state));
            setPlayersProfits(parsed);
            setDisplay(parsed);
            if (view) {
                switch (view) {
                    case View.form.toString(): setView(View.form)
                    case View.report.toString(): setView(View.report)
                }
            }
        }
    }, [])

    useEffect(() => {
        const state = (JSON.stringify(playersProfits));
        const url = new URL(window.location.href);
        url.searchParams.delete("view")
        url.searchParams.delete("state")
        url.searchParams.append("view", view)
        url.searchParams.append("state", state);
        window.history.pushState(null, '', url);
    }, [playersProfits, view])

    return (
        <Flex bg="gray.100" align="center" justify="center" h="100vh">
            <Box bg="white" p={6} rounded="md" w="80vw" maxW="800px">
                {view === View.form &&
                    (<Formik
                        enableReinitialize={true}
                        initialValues={{ players: playersProfits }}
                        onSubmit={(values) => {
                            setPlayersProfits(values.players)
                            setView(View.report)
                        }}
                        render={({ values }) => (
                            <Form>
                                <FieldArray
                                    name="players"
                                    render={arrHelpers => (
                                        <VStack spacing={4} >
                                            <SimpleGrid spacing={4} minChildWidth={"300px"} alignItems="center" overflowY="scroll" maxH="60vh" w="100%" pr="2" css={{
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
                                                        <FormControl key={`form-${index}`}>
                                                            <Button variant={"ghost"} px={0} mx={4}>
                                                                <HStack>
                                                                    <Editable
                                                                        selectAllOnFocus
                                                                        fontSize="xl"
                                                                        onChange={(e) => setPlayer(index, player, { name: e || `Player ${index}` })}
                                                                        value={player.name}
                                                                    >
                                                                        <EditablePreview />
                                                                        <EditableInput textAlign={'left'} />
                                                                    </Editable>
                                                                    <EditIcon />
                                                                </HStack>
                                                            </Button>
                                                            {/* TODO: adjust fontSize responsively */}

                                                            <InputGroup px={4}>
                                                                <InputLeftAddon pl={1} pr={1}>
                                                                    <HStack >
                                                                        <IconButton aria-label="Trigger polarity" icon={polarityIcon(display[index].profit.toString())} onClick={() => {
                                                                            const polarised = player.profit * -1
                                                                            setPlayer(index, player, { profit: polarised });
                                                                            setPlayerDisplay(index, player, { profit: polarised });
                                                                        }} />
                                                                        <Text fontSize='xl'>$</Text>
                                                                    </HStack>
                                                                </InputLeftAddon>
                                                                <Input
                                                                    variant="outline"
                                                                    onBlur={(e) => {
                                                                        setPlayer(index, player, { profit: parseFloat(e.currentTarget.value) || 0 })
                                                                        setPlayerDisplay(index, player, { profit: parseFloat(e.currentTarget.value) || 0 })
                                                                    }}
                                                                    onChange={(s) => setPlayerDisplay(index, player, { profit: s.currentTarget.value })}
                                                                    value={display[index].profit}
                                                                    fontSize='xl'
                                                                >
                                                                </Input>

                                                            </InputGroup>
                                                        </FormControl>
                                                    )
                                                })}
                                                <StackDivider />
                                            </SimpleGrid>
                                            <Box minH={6}>
                                                <IconButton aria-label='add new player' icon={<AddIcon />} variant="solid" borderRadius="50%" onClick={() => {
                                                    addNewPlayer();
                                                }} />
                                            </Box>
                                            <Button type="submit" colorScheme="purple" isFullWidth isDisabled={getTotalBalance(playersProfits) !== 0}>
                                                {getTotalBalance(playersProfits) === 0 ? "Submit" : `Total balance: ${displayMoney(getTotalBalance(playersProfits))}`}
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

                        <TableContainer>
                            <Table size="lg" >
                                <Thead>
                                    <Tr>
                                        <Th>To pay</Th>
                                        <Th />
                                        <Th>Recipient</Th>
                                        <Th>Amount</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {Object.entries(solveAssignmentProblem(playersProfits!))
                                        .sort((a, b) => parseVariableKey(a[0]).toPay > parseVariableKey(b[0]).toPay ? 1 : -1)
                                        .map((kvp) => {
                                            const [key, val] = kvp;
                                            const parsed = parseVariableKey(key);

                                            return (
                                                <Tr>
                                                    <Td>{parsed.toPay}</Td>
                                                    <Td><ArrowForwardIcon /></Td>
                                                    <Td>{parsed.recipient}</Td>
                                                    <Td>{displayMoney(val)}</Td>
                                                </Tr>
                                            )
                                        })}
                                </Tbody>
                            </Table>
                        </TableContainer>

                        <Button onClick={() => setView(View.form)}>
                            Return to form
                        </Button>
                    </VStack>
                )}
            </Box>
        </Flex >
    );

    function polarityIcon(value: string) {
        if (parseFloat(value) <= 0) {
            return <AddIcon />
        }
        return <MinusIcon />;
    }

    function setPlayer(index: number, player: Player, value: object) {
        const arr = [...playersProfits!];
        arr[index] = { ...player, ...value };
        setPlayersProfits(arr);
    }

    function setPlayerDisplay(index: number, player: Player, value: object) {
        const arr = [...display!];
        arr[index] = { ...player, ...value };
        setDisplay(arr);
    }

    function addNewPlayer() {
        setPlayersProfits([...playersProfits, createEmptyPlayer(playersProfits.length + 1)])
        setDisplay([...playersProfits, createEmptyPlayer(playersProfits.length + 1)])
    }
}

function displayMoney(val: number): string {
    return new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(val);
}

function getTotalBalance(players: Player[]) {
    return players
        .map((player) => player.profit)
        .reduce((prev, curr) => prev + curr);
}

