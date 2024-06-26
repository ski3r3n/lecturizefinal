"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import Logo from "@/components/logo"; // Import your Logo component

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    if (response.ok) {
      router.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
    setIsLoading(false);
  };

  return (
    <Grid
      minH={"100vh"}
      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <GridItem
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        justifyContent="center"
        bg="teal.500"
        color="white"
        position="relative"
        p={8}
      >
        <Box position="absolute" top={4} left={4}>
          <Logo height="25px" />
        </Box>
        <Stack spacing={6} textAlign="center">
          <Heading fontSize={"4xl"}>Start making quick and accurate notes</Heading>
          <Text fontSize={"lg"} color="gray.300">
            Level up your studying journey today.
          </Text>
        </Stack>
      </GridItem>
      <GridItem display="flex" alignItems="center" justifyContent="center">
        <Flex
          direction="column"
          bg={useColorModeValue("white", "gray.700")}
          boxShadow="lg"
          p={8}
          rounded="lg"
          maxW="md"
          w="full"
        >
          <Stack spacing={8}>
            <Stack align="center">
              <Heading fontSize="2xl">Log in to your account</Heading>
            </Stack>
            <Box>
              <Stack spacing={4}>
                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <InputRightElement h={"full"}>
                      <Button
                        variant={"ghost"}
                        onClick={() => setShowPassword((showPassword) => !showPassword)}
                      >
                        {showPassword ? <FiEye /> : <FiEyeOff />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Stack spacing={10} pt={2}>
                  <Button
                    width="100%"
                    isLoading={isLoading}
                    loadingText="Submitting"
                    size="lg"
                    bg={"teal.500"}
                    color={"white"}
                    _hover={{
                      bg: "teal.600",
                    }}
                    onClick={handleSubmit}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </GridItem>
    </Grid>
  );
}
