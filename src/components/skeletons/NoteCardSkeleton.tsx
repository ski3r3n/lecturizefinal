"use client";
import {
  Box,
  Badge,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";

function NoteCardSkeleton() {
  return (
    <Center py={6}>
      <Box
        maxW={"300px"}
        w={"300px"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
        overflow={"hidden"}
        height={"391px"}
      >
        {/* Skeleton for Image */}
        <Skeleton height={"120px"} mt={-6} mx={-6} mb={6} />

        <Stack spacing={4}>
          {/* Skeleton for Subject Badge */}
          <Skeleton height="20px" w="80px" />

          {/* Skeleton for Title */}
          <Skeleton height="29px" w="75%" />

          {/* Skeleton for Content Preview */}
          <SkeletonText mt="4" noOfLines={3} spacing="4" />

          <Stack mt={6} direction={"row"} spacing={4} align={"center"}>
            {/* Skeleton for Avatar */}
            <SkeletonCircle size="10" />
            
            {/* Skeleton for Author Name and Date */}
            <Stack spacing={1} flex="1">
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
}

export default NoteCardSkeleton;
