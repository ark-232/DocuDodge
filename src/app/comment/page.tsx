'use client'

import { useState, useEffect } from 'react'
import { Box, Button, Container, Heading, VStack, HStack, useToast, Text, Flex, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import Link from 'next/link'
import { FaCopy, FaDownload, FaMagic, FaChevronDown } from 'react-icons/fa'

const MAX_LINES = 250;
const MAX_REQUESTS_PER_MINUTE = 3;
const COOLDOWN_PERIOD = 60000; // 1 minute in milliseconds

const CodeEditor: React.FC<{ value: string; onChange?: (value: string) => void; placeholder: string; isEditable?: boolean; lineCount: number }> = ({ value, onChange, placeholder, isEditable = true, lineCount }) => (
    <Box position="relative" height="100%">
        <Box
            as="textarea"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const newValue = e.target.value;
                const newLineCount = newValue.split('\n').length;
                if (newLineCount <= MAX_LINES && onChange) {
                    onChange(newValue);
                }
            }}
            placeholder={placeholder}
            readOnly={!isEditable}
            height="calc(100% - 24px)"
            width="100%"
            p={4}
            bg="rgba(30, 31, 48, 0.95)"
            color="white"
            border="1px solid"
            borderColor="rgba(123, 104, 238, 0.3)"
            borderRadius="md"
            _focus={{
                outline: 'none',
                borderColor: 'rgba(123, 104, 238, 0.6)',
            }}
            fontFamily="'JetBrains Mono', monospace"
            fontSize="14px"
            resize="none"
        />
        <Text position="absolute" bottom={6} right={2} fontSize="sm" color={lineCount >= MAX_LINES ? "red.500" : "gray.500"}>
            {lineCount}/{MAX_LINES} lines
        </Text>
        <Box 
            position="absolute" 
            bottom={0} 
            left={0} 
            right={0} 
            height="4px" 
            bg={lineCount >= MAX_LINES ? "red.500" : "green.500"} 
            width={`${(lineCount / MAX_LINES) * 100}%`}
        />
    </Box>
)

const CommentStyleButton: React.FC<{ style: string; currentStyle: string; onClick: () => void }> = ({ style, currentStyle, onClick }) => (
    <Button
        onClick={onClick}
        variant={style === currentStyle ? "solid" : "outline"}
        size="sm"
        colorScheme="purple"
        bg={style === currentStyle ? "rgba(123, 104, 238, 0.6)" : "transparent"}
        _hover={{ bg: "rgba(123, 104, 238, 0.4)" }}
        borderRadius="full"
    >
        {style}
    </Button>
)

const languageOptions = [
    { value: 'js', label: 'JavaScript' },
    { value: 'py', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cs', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'php', label: 'PHP' },
    { value: 'rb', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'go', label: 'Go' },
    { value: 'ts', label: 'TypeScript' },
]

export default function CommentPage() {
    const [code, setCode] = useState('')
    const [comments, setComments] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [commentType, setCommentType] = useState('simple')
    const [language, setLanguage] = useState('')
    const [lineCount, setLineCount] = useState(0)
    const [lastRequestTime, setLastRequestTime] = useState(0)
    const [requestCount, setRequestCount] = useState(0)
    const toast = useToast()

    useEffect(() => {
        setLineCount(code.split('\n').length);
    }, [code]);

    const handleSubmit = async () => {
        if (!language) {
            toast({
                title: 'Language not selected',
                description: 'Please select a programming language before generating comments.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
        }
        if (lineCount > MAX_LINES) {
            toast({
                title: 'Line limit exceeded',
                description: `Please reduce your code to ${MAX_LINES} lines or fewer.`,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
        }

        const now = Date.now();
        if (now - lastRequestTime < COOLDOWN_PERIOD) {
            if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
                toast({
                    title: 'Rate limit reached',
                    description: `Please wait a moment before trying again.`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
                return;
            }
            setRequestCount(requestCount + 1);
        } else {
            setRequestCount(1);
            setLastRequestTime(now);
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, commentType, language }),
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json()
            if (data.error) {
                throw new Error(data.error);
            }
            setComments(data.comments)
        } catch (error) {
            toast({
                title: 'Error commenting code',
                description: error instanceof Error ? error.message : 'An unknown error occurred',
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
        <Box bg="#1E1F30" minHeight="100vh" color="white">
            <Container maxW="container.xl" py={6}>
                <VStack spacing={6} align="stretch">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Link href="/" passHref>
                            <Text fontSize="3xl" fontWeight="bold" color="#7B68EE">
                                DocuDodge
                            </Text>
                        </Link>
                        <HStack spacing={4}>
                            <Menu>
                                <MenuButton as={Button} rightIcon={<FaChevronDown />} bg="rgba(30, 31, 48, 0.95)" _hover={{ bg: "rgba(123, 104, 238, 0.2)" }} _active={{ bg: "rgba(123, 104, 238, 0.3)" }}>
                                    {languageOptions.find(opt => opt.value === language)?.label || 'Select Language'}
                                </MenuButton>
                                <MenuList bg="rgba(30, 31, 48, 0.95)" borderColor="rgba(123, 104, 238, 0.3)">
                                    {languageOptions.map((option) => (
                                        <MenuItem 
                                            key={option.value} 
                                            onClick={() => setLanguage(option.value)}
                                            bg="transparent"
                                            _hover={{ bg: "rgba(123, 104, 238, 0.2)" }}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
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

                    <Flex height="calc(100vh - 220px)" gap={6}>
                        <VStack flex={1} align="stretch" height="100%">
                            <Heading size="md" mb={2}>Original Code</Heading>
                            <CodeEditor
                                value={code}
                                onChange={setCode}
                                placeholder="// Paste your code here"
                                lineCount={lineCount}
                            />
                        </VStack>
                        <VStack flex={1} align="stretch" height="100%">
                            <Heading size="md" mb={2}>Commented Code</Heading>
                            <CodeEditor
                                value={comments}
                                placeholder="// Your commented code will appear here"
                                isEditable={false}
                                lineCount={comments ? comments.split('\n').length : 0}
                            />
                        </VStack>
                    </Flex>

                    <Flex justifyContent="space-between" alignItems="center">
                        <HStack>
                            <IconButton
                                aria-label="Copy original code"
                                icon={<FaCopy />}
                                onClick={() => copyToClipboard(code)}
                                colorScheme="purple"
                                variant="outline"
                            />
                            <IconButton
                                aria-label="Download original code"
                                icon={<FaDownload />}
                                onClick={() => downloadCode(code, `original_code.${language}`)}
                                colorScheme="purple"
                                variant="outline"
                            />
                        </HStack>
                        <Button
                            leftIcon={<FaMagic />}
                            onClick={handleSubmit}
                            isLoading={isLoading}
                            loadingText="Generating..."
                            bg="linear-gradient(to right, #7B68EE, #9370DB)"
                            _hover={{ bg: "linear-gradient(to right, #6A5ACD, #8A2BE2)" }}
                            color="white"
                            size="lg"
                            px={8}
                            isDisabled={lineCount > MAX_LINES || !language}
                        >
                            Generate Comments
                        </Button>
                        <HStack>
                            <IconButton
                                aria-label="Copy commented code"
                                icon={<FaCopy />}
                                onClick={() => copyToClipboard(comments)}
                                colorScheme="purple"
                                variant="outline"
                            />
                            <IconButton
                                aria-label="Download commented code"
                                icon={<FaDownload />}
                                onClick={() => downloadCode(comments, `commented_code.${language}`)}
                                colorScheme="purple"
                                variant="outline"
                            />
                        </HStack>
                    </Flex>
                </VStack>
            </Container>
        </Box>
    )
}