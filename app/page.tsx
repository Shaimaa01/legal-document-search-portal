"use client";
import {
  Anchor,
  Badge,
  Box,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Grid,
  ThemeIcon,
  Divider,
} from "@mantine/core";
import { IconFileSearch, IconBooks, IconRobot } from "@tabler/icons-react";
import Link from "next/link";

export default function Home() {
  return (
    <Box component="main" py="xl">
      <Container size="lg">
        {/* Hero */}
        <Grid align="center" gutter="xl">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap="md">
              <Group gap="sm">
                <Badge variant="light" color="cyan" size="lg" radius="xl">
                  AI-Powered Legal Search
                </Badge>
              </Group>

              <Title order={1} fw={800} size={42}>
                Search legal documents with{" "}
                <Text component="span" c="cyan" inherit>
                  AI assistance
                </Text>
              </Title>

              <Text c="dimmed" size="lg">
                Ask questions in plain English and get instant AI-generated
                answers along with the most relevant legal documents from our
                library. Powered by semantic search and Llama 3.3.
              </Text>

              <Group gap="md" mt="sm">
                <Button
                  component={Link}
                  href="/ui/search"
                  size="md"
                  radius="xl"
                  leftSection={<IconFileSearch size={18} />}
                >
                  Start searching
                </Button>
                <Button
                  component={Link}
                  href="/ui/library"
                  variant="subtle"
                  size="md"
                  radius="xl"
                  leftSection={<IconBooks size={18} />}
                >
                  Browse library
                </Button>
              </Group>

              <Group gap="lg" mt="md">
                <Stack gap={2}>
                  <Text fw={600}>AI-Generated Answers</Text>
                  <Text size="sm" c="dimmed">
                    Get brief, helpful responses instantly.
                  </Text>
                </Stack>
                <Stack gap={2}>
                  <Text fw={600}>Smart Matching</Text>
                  <Text size="sm" c="dimmed">
                    Find relevant docs with similarity scores.
                  </Text>
                </Stack>
              </Group>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper
              radius="lg"
              p="lg"
              withBorder
              shadow="md"
              style={{ backdropFilter: "blur(16px)" }}
            >
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text fw={600}>Try asking</Text>
                  <Badge size="sm" variant="dot" color="green">
                    Live
                  </Badge>
                </Group>

                <Divider />

                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    • &quot;Can employees share confidential information?&quot;
                  </Text>
                  <Text size="sm" c="dimmed">
                    • &quot;What are my GDPR privacy rights?&quot;
                  </Text>
                  <Text size="sm" c="dimmed">
                    • &quot;What happens if I terminate my lease early?&quot;
                  </Text>
                  <Text size="sm" c="dimmed">
                    • &quot;How do I use your trademarks?&quot;
                  </Text>
                </Stack>

                <Divider my="sm" />

                <Text size="xs" c="dimmed">
                  Head to{" "}
                  <Anchor component={Link} href="/ui/search" c="cyan">
                    search
                  </Anchor>{" "}
                  to ask your questions or{" "}
                  <Anchor component={Link} href="/ui/library" c="cyan">
                    browse the library
                  </Anchor>{" "}
                  to explore all documents.
                </Text>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Features */}
        <Stack mt={80} gap="lg">
          <Group gap="xs">
            <Badge size="sm" variant="outline" color="cyan">
              How it works
            </Badge>
          </Group>
          <Title order={2} size={28}>
            Intelligent legal document search
          </Title>

          <Grid mt="md">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper withBorder radius="lg" p="lg">
                <Group align="flex-start" gap="md">
                  <ThemeIcon size={40} radius="md" variant="light" color="cyan">
                    <IconRobot size={22} />
                  </ThemeIcon>
                  <Stack gap={4}>
                    <Text fw={600}>AI-Powered Answers</Text>
                    <Text size="sm" c="dimmed">
                      Ask questions in natural language and get immediate,
                      concise answers generated by Llama 3.3 based on your
                      documents.
                    </Text>
                  </Stack>
                </Group>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper withBorder radius="lg" p="lg">
                <Group align="flex-start" gap="md">
                  <ThemeIcon size={40} radius="md" variant="light" color="cyan">
                    <IconFileSearch size={22} />
                  </ThemeIcon>
                  <Stack gap={4}>
                    <Text fw={600}>Semantic Search</Text>
                    <Text size="sm" c="dimmed">
                      Advanced vector embeddings understand meaning, not just
                      keywords. Find relevant documents even when you use
                      different terms.
                    </Text>
                  </Stack>
                </Group>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper withBorder radius="lg" p="lg">
                <Group align="flex-start" gap="md">
                  <ThemeIcon size={40} radius="md" variant="light" color="cyan">
                    <IconBooks size={22} />
                  </ThemeIcon>
                  <Stack gap={4}>
                    <Text fw={600}>Comprehensive Library</Text>
                    <Text size="sm" c="dimmed">
                      Browse categorized legal documents including contracts,
                      policies, NDAs, and more. Each with full content and
                      metadata.
                    </Text>
                  </Stack>
                </Group>
              </Paper>
            </Grid.Col>
          </Grid>

          {/* Stats */}
          <Grid mt="xl">
            <Grid.Col span={{ base: 6, md: 3 }}>
              <Paper withBorder radius="md" p="md" ta="center">
                <Text size="xl" fw={700} c="cyan">
                  10+
                </Text>
                <Text size="sm" c="dimmed">
                  Legal Documents
                </Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 3 }}>
              <Paper withBorder radius="md" p="md" ta="center">
                <Text size="xl" fw={700} c="cyan">
                  6
                </Text>
                <Text size="sm" c="dimmed">
                  Categories
                </Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 3 }}>
              <Paper withBorder radius="md" p="md" ta="center">
                <Text size="xl" fw={700} c="cyan">
                  AI
                </Text>
                <Text size="sm" c="dimmed">
                  Instant Answers
                </Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 3 }}>
              <Paper withBorder radius="md" p="md" ta="center">
                <Text size="xl" fw={700} c="cyan">
                  Free
                </Text>
                <Text size="sm" c="dimmed">
                  Open Source
                </Text>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
