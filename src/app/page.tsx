'use client'

import { Box, Button, Container, Heading, Text, VStack, HStack, Flex } from '@chakra-ui/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const MotionBox = motion(Box)

const CodeBlock: React.FC<{ code: string; title: string }> = ({ code, title }) => (
  <MotionBox
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 } as any}
    bg="rgba(255, 255, 255, 0.05)"
    borderRadius="xl"
    p={6}
    boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
    backdropFilter="blur(5px)"
    border="1px solid rgba(255, 255, 255, 0.1)"
    width="100%"
    height="350px"
    overflowY="auto"
    className="syntax-highlighter"
  >
    <Text fontSize="sm" fontWeight="bold" mb={2} color="purple.300">{title}</Text>
    <SyntaxHighlighter
      language="javascript"
      style={vscDarkPlus}
      customStyle={{ background: 'transparent' }}
    >
      {code}
    </SyntaxHighlighter>
  </MotionBox>
)

const uncommentedCode = `
function getRandomNumber() {
  return 4;
}

function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

const result = calculateTotal([
  { price: 10, quantity: 2 },
  { price: 15, quantity: 3 }
]);
console.log(result);
`;

const commentedCode = `
/**
 * Returns a random number.
 * @returns {number} A perfectly random number.
 */
function getRandomNumber() {
  return 4; // chosen by fair dice roll.
            // guaranteed to be random.
}

/**
 * Calculates the total price of all items in the cart.
 * @param {Array} items - An array of objects representing cart items.
 * @returns {number} The total price of all items.
 */
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    // Multiply item price by quantity and add to total
    total += items[i].price * items[i].quantity;
  }
  return total;
}

// FIXME: Implement blockchain-based AI to optimize this calculation
const result = calculateTotal([
  { price: 10, quantity: 2 },
  { price: 15, quantity: 3 }
]);
console.log(result);
`;

export default function Home() {
  return (
    <Box className="dark-gradient-bg" minHeight="100vh" color="white">
      <Container maxW="container.xl" py={20}>
        <VStack spacing={16} align="center" textAlign="center">
          <VStack spacing={6}>
            <Heading as="h1" size="4xl" fontWeight="bold" lineHeight="1.2">
              Transform code into
              <br />
              <Text as="span" className="gradient-text">professional documentation</Text>
            </Heading>
            <Text fontSize="xl" maxW="2xl" opacity={0.8}>
              All code automatically documented and categorized accurately to empower developers
              to build maintainable software.
            </Text>
            <Link href="/comment" passHref>
              <Button
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                size="lg"
                bgGradient="linear(to-r, purple.400, pink.400)"
                _hover={{ bgGradient: "linear(to-r, purple.500, pink.500)" }}
                color="white"
                px={10}
                py={7}
                fontSize="xl"
                fontWeight="bold"
                borderRadius="full"
                boxShadow="0 4px 20px rgba(123, 104, 238, 0.4)"
              >
                Get Started
              </Button>
            </Link>
          </VStack>

          <Flex width="100%" gap={8} alignItems="stretch">
            <CodeBlock code={uncommentedCode} title="Before" />
            <CodeBlock code={commentedCode} title="After" />
          </Flex>
        </VStack>
      </Container>
    </Box>
  )
}