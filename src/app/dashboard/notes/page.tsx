"use client";
import { Button, Link } from "@chakra-ui/react";

export default function Whyareyouhere() {
  window.location.href = "/dashboard";
  return (
    <>
      <Link href="/dashboard">
        <Button>Click here if browser does not redirect you back</Button>
      </Link>
    </>
  );
}
