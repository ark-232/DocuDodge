'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const theme = extendTheme({
  fonts: {
    body: inter.style.fontFamily,
    heading: inter.style.fontFamily,
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: '#1a1a2e',
        color: 'white',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'linear-gradient(45deg, #4158D0, #C850C0)',
          color: 'white',
          _hover: {
            opacity: 0.9,
          },
        },
        outline: {
          borderColor: 'whiteAlpha.300',
          color: 'white',
          _hover: {
            bg: 'whiteAlpha.100',
          },
        },
      },
    },
  },
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </body>
    </html>
  )
}