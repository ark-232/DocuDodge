'use client'

import { useState } from 'react'
import { Box, Button, Container, Heading, Textarea, VStack, HStack, useToast, Select, Text } from '@chakra-ui/react'
import Link from 'next/link'

export default function CommentPage() {
    const [code, setCode] = useState('')
    const [comments, setComments] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [commentType, setCommentType] = useState('simple')
    const toast = useToast()

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, commentType }),
            })
            const data = await response.json()
            setComments(data.comments)
            toast({
                title: 'Code commented successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (error) {
            toast({
                title: 'Error commenting code',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box className="dark-gradient-bg" minHeight="100vh" color="white">
            <Container maxW="container.xl" py={8}>
                <HStack justify="space-between" mb={12}>
                    <Text fontSize="2xl" fontWeight="bold">DocuDodge</Text>
                    <Link href="/" passHref>
                        <Button className="gradient-btn">Home</Button>
                    </Link>
                </HStack>

                <VStack spacing={8} align="stretch">
                    <Heading textAlign="center" size="2xl">AI Code Commenter</Heading>

                    <HStack spacing={4} align="flex-start">
                        <Box flex={1}>
                            <Textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Paste your code here"
                                height="400px"
                                bg="whiteAlpha.100"
                                border="1px solid"
                                borderColor="whiteAlpha.300"
                                _placeholder={{ color: 'whiteAlpha.500' }}
                            />
                        </Box>
                        <Box flex={1}>
                            <Textarea
                                value={comments}
                                isReadOnly
                                height="400px"
                                placeholder="Commented code will appear here"
                                bg="whiteAlpha.100"
                                border="1px solid"
                                borderColor="whiteAlpha.300"
                                _placeholder={{ color: 'whiteAlpha.500' }}
                            />
                        </Box>
                    </HStack>

                    <HStack spacing={4}>
                        <Text>Comment Style:</Text>
                        <Select
                            value={commentType}
                            onChange={(e) => setCommentType(e.target.value)}
                            bg="whiteAlpha.100"
                            border="1px solid"
                            borderColor="whiteAlpha.300"
                            width="auto"
                        >
                            <option value="simple">Simple Inline</option>
                            <option value="moderate">Moderate</option>
                            <option value="detailed">Detailed</option>
                            <option value="official">Official Docs Style</option>
                        </Select>
                    </HStack>

                    <Button
                        className="gradient-btn"
                        onClick={handleSubmit}
                        isLoading={isLoading}
                        loadingText="Commenting..."
                        size="lg"
                    >
                        Generate Comments
                    </Button>
                </VStack>
            </Container>
        </Box>
    )
}