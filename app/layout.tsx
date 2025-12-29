import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
  createTheme,
} from "@mantine/core";

export const metadata: Metadata = {
  title: "Legal Document Search Portal | AI-Powered Legal Search",
  description:
    "Intelligent legal document search platform powered by semantic search and AI-generated answers. Search through contracts, policies, and legal documents with natural language queries.",
  keywords: [
    "legal documents",
    "legal search",
    "AI legal assistant",
    "semantic search",
    "document search",
    "legal library",
  ],
};

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  primaryColor: "cyan",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
