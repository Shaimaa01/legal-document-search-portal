// Save as: app/library/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Loader,
  Paper,
  Chip,
  ChipGroup,
  Pill,
  PillGroup,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBook2,
  IconCalendar,
  IconFileSearch,
  IconUser,
} from "@tabler/icons-react";

interface Document {
  id: number;
  title: string;
  category: string;
  summary: string;
  author: string;
  date_published: string;
}

export default function LibraryPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/library");
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", ...new Set(documents.map((doc) => doc.category))];

  const filteredDocuments =
    selectedCategory === "All"
      ? documents
      : documents.filter((doc) => doc.category === selectedCategory);

  if (loading) {
    return (
      <Box component="main" py="xl">
        <Container size="lg">
          <Stack align="center" justify="center" mih="60vh" gap="xs">
            <Loader />
            <Text c="dimmed">Loading library...</Text>
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main" py="xl">
      <Container size="lg">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between" align="flex-start">
            <Stack gap={4}>
              <Group gap="xs">
                <Badge
                  size="sm"
                  variant="light"
                  leftSection={<IconBook2 size={14} />}
                >
                  Library
                </Badge>
              </Group>
              <Title order={2}>Legal document library</Title>
              <Text size="sm" c="dimmed">
                Browse your firm&apos;s curated collection of contracts,
                templates, and reference material.
              </Text>
            </Stack>

            <Button
              component={Link}
              href="/ui/search"
              leftSection={<IconFileSearch size={16} />}
              radius="xl"
            >
              Search documents
            </Button>
          </Group>

          {/* Category Filter */}
          <Paper withBorder radius="lg" p="md">
            <Stack gap="xs">
              <Text size="sm" fw={500}>
                Filter by category
              </Text>

              <Chip.Group
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value as string)}
              >
                <Group gap="xs">
                  {categories.map((category) => (
                    <Chip
                      key={category}
                      value={category}
                      variant="filled" // This will show the color background when selected
                      color="cyan"
                      radius="xl"
                    >
                      {category}
                    </Chip>
                  ))}
                </Group>
              </Chip.Group>
            </Stack>
          </Paper>

          {/* Document Grid */}
          <Grid>
            {filteredDocuments.map((doc) => (
              <Grid.Col key={doc.id} span={{ base: 12, sm: 6, md: 4 }}>
                <Card
                  component={Link}
                  href={`/ui/document/${doc.id}`}
                  withBorder
                  radius="lg"
                  shadow="sm"
                  h="100%"
                >
                  <Stack gap="sm" h="100%">
                    <Group justify="space-between" align="flex-center">
                      <Badge variant="outline" size="xs">
                        {doc.category}
                      </Badge>
                    </Group>

                    <Text fw={600} lineClamp={2}>
                      {doc.title}
                    </Text>

                    <Text size="sm" c="dimmed" lineClamp={3}>
                      {doc.summary}
                    </Text>

                    <Box mt="auto">
                      <Group justify="space-between" gap="xs">
                        <Group gap={6}>
                          <IconUser size={14} />
                          <Text size="xs" c="dimmed">
                            {doc.author}
                          </Text>
                        </Group>
                        <Group gap={6}>
                          <IconCalendar size={14} />
                          <Text size="xs" c="dimmed">
                            {new Date(doc.date_published).toLocaleDateString()}
                          </Text>
                        </Group>
                      </Group>
                    </Box>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>

          {filteredDocuments.length === 0 && (
            <Paper radius="lg" p="xl" withBorder>
              <Stack align="center" gap="xs">
                <Text size="sm" c="dimmed">
                  No documents found in this category.
                </Text>
              </Stack>
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
