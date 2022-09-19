import { Box, Button, Checkbox, Flex, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, InputLeftElement, Stack, Text, VStack } from '@chakra-ui/react';
import { FieldArray, Form, Formik, useFormik } from 'formik';
import { useState } from 'react';
import * as React from 'react';

interface CalculatorProps {
    name: string
}

interface Player {
    name: string
    profit: number
}

function createEmptyPlayer(): Player {
    return { name: "", profit: 0 }
}

export default function Calculator(props: CalculatorProps) {
    return (
        <Flex bg="gray.100" align="center" justify="center" h="100vh">
            <Formik
                initialValues={{ players: [createEmptyPlayer()] }}
                onSubmit={async (values) => setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                }, 500)
                }
                render={({ values }) => (
                    <Form>
                        <FieldArray
                            name="players"
                            render={arrHelpers => (
                                <Box bg="white" p={6} rounded="md" w="80vw" maxW="800px">
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
                                                                />
                                                            </InputGroup>
                                                            <InputGroup>
                                                                <InputLeftAddon children='profit' />
                                                                <Input
                                                                    id={`player_${index}_profit`}
                                                                    name="player profit"
                                                                    variant="outline"
                                                                    onChange={(e) => arrHelpers.replace(index, { ...player, profit: e.currentTarget.value })}
                                                                />
                                                            </InputGroup>
                                                        </Stack>
                                                    </FormControl>
                                                )
                                            })}
                                        </VStack>

                                        <Button type="submit" colorScheme="purple" isFullWidth>
                                            Submit
                                        </Button>
                                        <Button type="button" colorScheme="purple" isFullWidth onClick={() => {
                                            arrHelpers.push(createEmptyPlayer());
                                        }}>
                                            Add New
                                        </Button>
                                    </VStack>
                                </Box>
                            )}
                        />
                    </Form>
                )}
            />
        </Flex>
    );
}
