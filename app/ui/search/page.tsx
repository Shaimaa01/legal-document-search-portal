"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Alert,
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconAlertCircle, IconBook2, IconFileSearch, IconRobot } from "@tabler/icons-react";

interface Document {
  id: number;
  title: string;
  content: string;
  category?: string;
  summary?: string;
  similarity?: number;
}

export default function LegalSearch() {
  const [input, setInput] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [aiAnswer, setAiAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();

    if (!trimmedInput) return;

    // Require at least 3 characters for a meaningful search
    if (trimmedInput.length < 3) {
      setError("Please enter at least 3 characters to search");
      return;
    }

    console.log("Submitting search:", trimmedInput);
    setLoading(true);
    setDocuments([]);
    setAiAnswer("");
    setError(null);

    try {
      console.log("Fetching from /api/chat...");
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmedInput }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || data.details || "Search failed");
      }

      setDocuments(data.documents || []);
      setAiAnswer(data.aiAnswer || "");
      console.log("Documents set:", data.documents?.length || 0);
      console.log("AI Answer:", data.aiAnswer);
    } catch (error) {
      console.error("Client error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="main" py="xl">
      <Container size="lg">
        <Paper radius="lg" p="lg" withBorder shadow="md">
          <Stack gap="lg" style={{ minHeight: "70vh" }}>
            {/* Header */}
            <Group justify="space-between" align="flex-start">
              <Stack gap={4}>
                <Title order={2}>Legal document search</Title>
                <Text size="sm" c="dimmed">
                  Ask natural language questions to find the most relevant documents
                  in your library.
                </Text>
              </Stack>
              <Button
                component={Link}
                href="/ui/library"
                leftSection={<IconBook2 size={16} />}
                variant="light"
                radius="xl"
              >
                Browse library
              </Button>
            </Group>

            {/* AI answer */}
            {error && (
              <Alert
                icon={<IconAlertCircle size={18} />}
                color="red"
                radius="md"
                variant="light"
              >
                {error}
              </Alert>
            )}

            {aiAnswer && (
              <Paper
                radius="lg"
                p="md"
                withBorder
                style={{ background: "linear-gradient(135deg, #0b1020, #111827)" }}
              >
                <Group align="flex-start" gap="md">
                  <Box>
                    <IconRobot size={28} color="#22d3ee" />
                  </Box>
                  <Stack gap={4}>
                    <Group gap="xs">
                      <Badge size="sm" variant="light" color="cyan">
                        AI assistant
                      </Badge>
                    </Group>
                    <Text size="sm" c="gray.1">
                      {aiAnswer}
                    </Text>
                  </Stack>
                </Group>
              </Paper>
            )}

            {/* Results */}
            <ScrollArea.Autosize mah={360} offsetScrollbars>
              <Stack gap="sm">
                {documents.length > 0 && (
                  <Group justify="space-between">
                    <Text fw={600}>
                      Related documents ({documents.length})
                    </Text>
                    <Text size="xs" c="dimmed">
                      Ranked by semantic relevance
                    </Text>
                  </Group>
                )}

                {documents.map((doc) => (
                  <Card
                    key={doc.id}
                    withBorder
                    radius="md"
                    component={Link}
                    href={`/ui/document/${doc.id}`}
                    shadow="sm"
                  >
                    <Group align="flex-start" justify="space-between" gap="md">
                      <Stack gap={4} flex={1}>
                        <Group gap="xs">
                          <Text fw={600}>{doc.title}</Text>
                          {doc.category && (
                            <Badge size="xs" variant="outline">
                              {doc.category}
                            </Badge>
                          )}
                        </Group>
                        <Text size="sm" c="dimmed" lineClamp={2}>
                          {doc.summary || doc.content}
                        </Text>
                      </Stack>

                      {doc.similarity !== undefined && (
                        <Stack gap={2} align="flex-end">
                          <Text size="xs" c="dimmed">
                            Match
                          </Text>
                          <Text fw={700} c="teal">
                            {(doc.similarity * 100).toFixed(0)}%
                          </Text>
                        </Stack>
                      )}
                    </Group>
                  </Card>
                ))}

                {!loading &&
                  documents.length === 0 &&
                  input &&
                  !error &&
                  !aiAnswer && (
                    <Stack align="center" py="xl" gap="xs">
                      <IconFileSearch size={28} />
                      <Text size="sm" c="dimmed">
                        No relevant documents found. Try different search terms.
                      </Text>
                    </Stack>
                  )}

                {loading && (
                  <Stack align="center" gap="xs" py="md">
                    <Loader size="sm" />
                    <Text size="sm" c="dimmed">
                      Searching...
                    </Text>
                  </Stack>
                )}
              </Stack>
            </ScrollArea.Autosize>

            <Divider />

            {/* Query input */}
            <form onSubmit={handleSubmit}>
              <Group align="flex-end" gap="sm">
                <TextInput
                  style={{ flex: 1 }}
                  value={input}
                  placeholder="Search documents..."
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  leftSection={<IconFileSearch size={16} />}
                  radius="md"
                />
                <Button
                  type="submit"
                  radius="md"
                  leftSection={<IconFileSearch size={16} />}
                  loading={loading}
                >
                  Search
                </Button>
              </Group>
              <Text size="xs" c="dimmed" mt={4}>
                Need inspiration? Browse the{" "}
                <Anchor component={Link} href="/ui/library" inherit>
                  document library
                </Anchor>{" "}
                to see what&apos;s available.
              </Text>
            </form>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
