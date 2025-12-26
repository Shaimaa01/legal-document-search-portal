import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { ActionIcon, TextInput, useMantineTheme } from "@mantine/core";
interface InputWithButtonProps {
  prompt: string;
  setPrompt: (value: string) => void;
}

export function InputWithButton({ prompt, setPrompt }: InputWithButtonProps) {
  const theme = useMantineTheme();

  return (
    <TextInput
      value={prompt}
      onChange={(event) => setPrompt(event.currentTarget.value)} 
      radius="xl"
      size="md"
      placeholder="Search questions"
      rightSectionWidth={42}
      leftSection={<IconSearch size={18} stroke={1.5} />}
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color={theme.primaryColor}
          variant="filled"
        >
          <IconArrowRight size={18} stroke={1.5} />
        </ActionIcon>
      }
    />
  );
}
