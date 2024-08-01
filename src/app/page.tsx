'use client'

import { Box, Button, Container, Heading, Text, VStack, HStack, Image } from '@chakra-ui/react'
import Link from 'next/link'

export default function Home() {
  return (
    <Box className="dark-gradient-bg" minHeight="100vh" color="white">
      <Container maxW="container.xl" py={8}>
        <HStack justify="space-between" mb={20}>
          <Text fontSize="2xl" fontWeight="bold">DocuDodge</Text>
          <HStack spacing={8}>
            <Link href="#">Features</Link>
            <Link href="#">Pricing</Link>
            <Link href="#">Changelog</Link>
            <Button variant="outline" colorScheme="whiteAlpha">Sign In</Button>
            <Button className="gradient-btn">Get Started</Button>
          </HStack>
        </HStack>

        <VStack spacing={8} align="center" textAlign="center" mb={20}>
          <Heading as="h1" size="4xl" fontWeight="bold" lineHeight="1.2">
            Transform code into
            <br />
            <Text as="span" className="gradient-text">professional documentation</Text>
          </Heading>
          <Text fontSize="xl" maxW="2xl" opacity={0.8}>
            All code automatically documented and categorized accurately to empower developers
            to build maintainable software.
          </Text>
          <HStack spacing={4}>
            <Button className="gradient-btn" size="lg">Get Started</Button>
            <Button variant="outline" colorScheme="whiteAlpha" size="lg">Learn more ↓</Button>
          </HStack>
        </VStack>

        <Text textAlign="center" mb={8}>Trusted by developer-led product companies</Text>
        <HStack justify="center" spacing={12} mb={20}>
          {['GitHub', 'GitLab', 'Bitbucket', 'VS Code', 'IntelliJ', 'PyCharm'].map((tool) => (
            <Text key={tool} opacity={0.6}>{tool}</Text>
          ))}
        </HStack>

        <Box position="relative" height="300px" mb={20}>
          <Box position="absolute" left="0" width="60%" height="100%" bg="whiteAlpha.100" borderRadius="md" />
          <Box position="absolute" right="0" width="45%" height="100%" bg="whiteAlpha.200" borderRadius="md" />
        </Box>

        <Heading as="h2" size="2xl" textAlign="center" mb={4}>THE DOCUDODGE ADVANTAGE</Heading>
      </Container>
    </Box>
  )
}