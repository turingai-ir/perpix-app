import { ActionIcon, Container, Flex, Paper } from '@mantine/core';
import { FormProvider, useForm } from 'react-hook-form';
import { TbArrowUp } from 'react-icons/tb';
import { useAtom } from 'jotai';
import type { FC } from 'react';

import { textPageState } from '../../_state';

import { useAppTranslate } from '@/hook';
import { TextAreaInput } from '@/components/form';

interface Inputs {
  input: string;
}

interface SearchBoxProps {
  onFinish: (input: string) => Promise<void>;
  loading: boolean;
  error: boolean;
}
const SearchBox: FC<SearchBoxProps> = ({ onFinish, loading, error }) => {
  const form = useForm<Inputs>();
  const { t } = useAppTranslate();
  const [, setState] = useAtom(textPageState);
  const inputWatch = form.watch('input');

  const handleSubmit = async (data: Inputs) => {
    const cleanInput = data.input.trim();
    setState((draft) => {
      draft.conversions.push({
        content: cleanInput,
        role: 'user',
      });
    });

    form.setValue('input', '');
    await onFinish(cleanInput);
  };

  return (
    <Container size="lg" className="tw-w-full">
      <Paper radius="xl" withBorder p="sm">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Flex direction="column" gap="md">
              <TextAreaInput
                showLabel={false}
                control={form.control}
                label={t('pages.text.searchBox.form.input.label')}
                name="input"
                errors={form.formState.errors}
                textAreaProps={{
                  autosize: true,
                  minRows: 1,
                  maxRows: 4,
                  placeholder: t('pages.text.searchBox.form.input.placeholder'),
                  classNames: {
                    input:
                      'tw-overflow-y-auto tw-resize-none tw-leading-[1.5] !tw-border-0 !tw-bg-transparent',
                  },
                  disabled: loading,
                }}
                rules={{
                  maxLength: 1000,
                }}
              />
              <ActionIcon
                variant="filled"
                color="dark"
                size="xl"
                radius="xl"
                className="tw-mr-auto"
                type="submit"
                disabled={!inputWatch || error}
                loading={loading}
              >
                <TbArrowUp size={18} />
              </ActionIcon>
            </Flex>
          </form>
        </FormProvider>
      </Paper>
    </Container>
  );
};

export default SearchBox;
