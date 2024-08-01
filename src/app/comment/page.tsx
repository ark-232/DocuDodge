'use client'

import { useState, useEffect } from 'react'
import { Box, Button, Container, Heading, VStack, HStack, useToast, Text, Flex, IconButton, Tooltip } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FaRobot, FaMagic, FaCopy, FaDownload } from 'react-icons/fa'

const MotionBox = motion(Box)

const CodeEditor: React.FC<{ code: string; onChange: (value: string) => void; placeholder: string }> = ({ code, onChange, placeholder }) => (
    <Box position="relative" height="100%" borderRadius="md" overflow="hidden">
        <SyntaxHighlighter
            language="javascript"
            style={atomOneDark}
            customStyle={{
                margin: 0,
                padding: '20px',
                height: '100%',
                fontSize: '14px',
                backgroundColor: 'rgba(40, 44, 52, 0.8)',
            }}
            contentEditable={true}
            onKeyDown={(e) => onChange((e.target as HTMLElement).textContent || '')}
        >
            {code || placeholder}
        </SyntaxHighlighter>
    </Box>
)

const CommentStyleButton: React.FC<{ style: string; currentStyle: string; onClick: () => void }> = ({ style, currentStyle, onClick }) => (
    <Button
        onClick={onClick}
        variant={style === currentStyle ? "solid" : "outline"}
        size="sm"
        colorScheme="purple"
        borderRadius="full"
    >
        {style}
    </Button>
)

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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({
            title: 'Copied to clipboard',
            status: 'success',
            duration: 2000,
        })
    }

    const downloadCode = (text: string, filename: string) => {
        const element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
        element.setAttribute('download', filename)
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    return (
        <Box className="dark-gradient-bg" minHeight="100vh" color="white">
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8} align="stretch">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Link href="/" passHref>
                            <Text fontSize="3xl" fontWeight="bold" className="gradient-text" cursor="pointer">
                                DocuDodge
                            </Text>
                        </Link>
                        <HStack>
                            {['simple', 'moderate', 'detailed', 'official'].map((style) => (
                                <CommentStyleButton
                                    key={style}
                                    style={style}
                                    currentStyle={commentType}
                                    onClick={() => setCommentType(style)}
                                />
                            ))}
                        </HStack>
                    </Flex>

                    <Flex height="calc(100vh - 200px)" gap={4}>
                        <MotionBox
                            flex={1}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Heading size="md" mb={2}>Original Code</Heading>
                            <CodeEditor
                                code={code}
                                onChange={setCode}
                                placeholder="// Paste your code here"
                            />
                        </MotionBox>
                        <MotionBox
                            flex={1}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Heading size="md" mb={2}>Commented Code</Heading>
                            <CodeEditor
                                code={comments}
                                onChange={setComments}
                                placeholder="// Your commented code will appear here"
                            />
                        </MotionBox>
                    </Flex>

                    <HStack justifyContent="space-between">
                        <HStack>
                            <Tooltip label="Copy original code">
                                <IconButton
                                    aria-label="Copy original code"
                                    icon={<FaCopy />}
                                    onClick={() => copyToClipboard(code)}
                                    colorScheme="blue"
                                />
                            </Tooltip>
                            <Tooltip label="Download original code">
                                <IconButton
                                    aria-label="Download original code"
                                    icon={<FaDownload />}
                                    onClick={() => downloadCode(code, 'original_code.js')}
                                    colorScheme="green"
                                />
                            </Tooltip>
                        </HStack>
                        <Button
                            leftIcon={isLoading ? <FaRobot /> : <FaMagic />}
                            onClick={handleSubmit}
                            isLoading={isLoading}
                            loadingText="Generating..."
                            size="lg"
                            colorScheme="purple"
                            bgGradient="linear(to-r, purple.400, pink.400)"
                            _hover={{ bgGradient: "linear(to-r, purple.500, pink.500)" }}
                            borderRadius="full"
                            px={8}
                        >
                            Generate Comments
                        </Button>
                        <HStack>
                            <Tooltip label="Copy commented code">
                                <IconButton
                                    aria-label="Copy commented code"
                                    icon={<FaCopy />}
                                    onClick={() => copyToClipboard(comments)}
                                    colorScheme="blue"
                                />
                            </Tooltip>
                            <Tooltip label="Download commented code">
                                <IconButton
                                    aria-label="Download commented code"
                                    icon={<FaDownload />}
                                    onClick={() => downloadCode(comments, 'commented_code.js')}
                                    colorScheme="green"
                                />
                            </Tooltip>
                        </HStack>
                    </HStack>
                </VStack>
            </Container>
        </Box>
    )
}