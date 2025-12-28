import { IconArrowRight } from "@tabler/icons-react";
import { ActionIcon, Textarea, useMantineTheme } from "@mantine/core";
interface InputWithButtonProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (event?: { preventDefault?: () => void }) => void;
  handleInputChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}

export function InputWithButton({
  input,
  setInput,
  handleSubmit,
  handleInputChange,
}: InputWithButtonProps) {
  const theme = useMantineTheme();

  return (
    <Textarea
      value={input}
      onChange={handleInputChange}
      radius="xl"
      size="sm"
      autosize
      minRows={1.5}
      maxRows={15}
      placeholder="Search questions"
      rightSectionWidth={42}
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color={theme.primaryColor}
          variant="filled"
          onClick={(e) => {
            setInput("");
            handleSubmit(e);
          }}
        >
          <IconArrowRight size={18} stroke={1.5} />
        </ActionIcon>
      }
    />
  );
}
