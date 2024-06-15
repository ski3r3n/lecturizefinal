"use client";
import React from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  HStack,
  VStack,
  Container,
  Icon,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons"; // Assuming you are using Chakra UI icons
import Link from "next/link";

const SuccessScreen = ({ params }: { params: { id: string } }) => {

  return (
    <Container centerContent>
      <Box textAlign="center" py={10}>
        <VStack spacing={4}>
          <Icon as={CheckCircleIcon} w={"70px"} h={"70px"} color="green.500" />
          <Heading>Note Saved Successfully!</Heading>
          <HStack spacing={4}>
            <Link href={`/dashboard`}>
              <Button colorScheme="blue">Go to Dashboard</Button>
            </Link>
            <Link href={`/dashboard/notes/${params.id}/edit/`}>
              <Button colorScheme="green">Continue Editing</Button>
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Container>
  );
};

export default SuccessScreen;
