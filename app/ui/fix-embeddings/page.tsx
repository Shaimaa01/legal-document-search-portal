"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Code,
  Container,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertTriangle, IconTools, IconClock } from "@tabler/icons-react";

export default function FixEmbeddings() {
  const [status, setStatus] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const fixEmbeddings = async () => {
    setIsRunning(true);
    setStatus("🚀 Starting to fix embeddings...\n\n");

    try {
      const response = await fetch("/api/fix-embeddings", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setStatus((prev) => prev + "✅ SUCCESS!\n\n" + data.log);
      } else {
        setStatus((prev) => prev + "❌ ERROR: " + data.error);
      }
    } catch (error) {
      setStatus((prev) => prev + "❌ ERROR: " + error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Box component="main" py="xl">
      <Container size="md">
        <Stack gap="lg">
          {/* Header */}
          <Stack gap={4}>
            <Title order={2}>Fix Embeddings</Title>
            <Text size="sm" c="dimmed">
              One-time setup utility to regenerate document embeddings
            </Text>
          </Stack>

          {/* Warning Alert */}
          <Alert
            icon={<IconAlertTriangle size={20} />}
            title="One-Time Setup"
            color="yellow"
            variant="light"
            radius="lg"
          >
            <Stack gap="xs">
              <Text size="sm">
                This will regenerate all document embeddings using the correct
                model. You only need to run this ONCE.
              </Text>
              <Text size="xs" c="dimmed">
                What this does: Reads your documents → Creates proper embeddings
                → Updates database
              </Text>
            </Stack>
          </Alert>

          {/* Action Button */}
          <Button
            onClick={fixEmbeddings}
            disabled={isRunning}
            leftSection={
              isRunning ? (
                <Loader size={16} color="white" />
              ) : (
                <IconTools size={16} />
              )
            }
            size="lg"
            radius="xl"
            fullWidth
          >
            {isRunning
              ? "Running... (may take 1-2 minutes)"
              : "Fix Embeddings Now"}
          </Button>

          {/* Status Output */}
          {status && (
            <Paper withBorder radius="lg" p="md">
              <Stack gap="xs">
                <Group gap="xs">
                  <IconClock size={16} />
                  <Text size="sm" fw={500}>
                    Status Log
                  </Text>
                </Group>
                <Code
                  block
                  style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                    backgroundColor: "var(--mantine-color-dark-9)",
                    color: "var(--mantine-color-green-4)",
                  }}
                >
                  {status}
                </Code>
              </Stack>
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
