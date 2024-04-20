"use client";
import { Button, Link } from "@chakra-ui/react";

export default function Whyareyouhere() {
  return (
    <>
      <Link href="/dashboard">
        <Button>Hey, you shouldn't be here! Click to go back now!</Button>
      </Link>
    </>
  );
}
