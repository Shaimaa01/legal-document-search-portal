// Save as: app/library/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCalendar,
  IconCopy,
  IconPrinter,
  IconUser,
} from "@tabler/icons-react";

interface Document {
  id: number;
  title: string;
  content: string;
  category: string;
  summary: string;
  author: string;
  date_published: string;
}

export default function LibraryDocumentPage() {
  const params = useParams();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const response = await fetch(`/api/document/${id}`);

        if (!response.ok) {
          throw new Error("Document not found");
        }

        const data = await response.json();
        setDocument(data.document);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load document"
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDocument();
    }
  }, [params.id]);

  const handleCopy = () => {
    if (document) {
      navigator.clipboard.writeText(document.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <Box component="main" py="xl">
        <Container size="lg">
          <Stack align="center" justify="center" mih="60vh" gap="xs">
            <Loader />
            <Text c="dimmed">Loading document...</Text>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (error || !document) {
    return (
      <Box component="main" py="xl">
        <Container size="sm">
          <Paper radius="lg" p="xl" withBorder>
            <Stack gap="md" align="center">
              <Text size="xl">📄</Text>
              <Title order={3}>Document not found</Title>
              <Text size="sm" c="dimmed" ta="center">
                {error || "The document you are looking for does not exist."}
              </Text>
              <Button
                component={Link}
                href="/ui/library"
                variant="light"
                leftSection={<IconArrowLeft size={16} />}
              >
                Back to library
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main" py="xl">
      <Container size="lg">
        <Stack gap="lg">
          {/* Header bar */}
          <Group justify="space-between" align="center">
            <Button
              component={Link}
              href="/ui/library"
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              radius="xl"
            >
              Back to library
            </Button>

            <Group gap="sm">
              <Button
                variant="default"
                leftSection={<IconCopy size={16} />}
                onClick={handleCopy}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                variant="default"
                leftSection={<IconPrinter size={16} />}
                onClick={() => window.print()}
              >
                Print
              </Button>
            </Group>
          </Group>

          {/* Document header */}
          <Paper radius="lg" p="xl" withBorder shadow="sm">
            <Stack gap="md">
              <Badge variant="outline" size="sm">
                {document.category}
              </Badge>

              <Title order={1}>{document.title}</Title>

              {document.summary && (
                <Text size="sm" c="dimmed" fs="italic">
                  {document.summary}
                </Text>
              )}

              <Group gap="lg" mt="sm">
                <Group gap={6}>
                  <IconUser size={16} />
                  <Text size="sm" c="dimmed">
                    {document.author}
                  </Text>
                </Group>
                <Group gap={6}>
                  <IconCalendar size={16} />
                  <Text size="sm" c="dimmed">
                    {new Date(document.date_published).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </Text>
                </Group>
              </Group>
            </Stack>
          </Paper>

          {/* Document body */}
          <Paper radius="lg" p="xl" withBorder>
            <Text
              size="sm"
              style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}
            >
              {document.content}
            </Text>
          </Paper>

          {/* Footer */}
          <Group justify="center">
            <Button
              component={Link}
              href="/ui/library"
              leftSection={<IconArrowLeft size={16} />}
              radius="xl"
            >
              Browse more documents
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}