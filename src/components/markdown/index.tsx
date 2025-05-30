/* eslint-disable unused-imports/no-unused-vars */
import {
  Title,
  Text,
  Code,
  List,
  ListItem,
  Blockquote,
  Divider,
  Anchor,
  Image,
  Table,
  Group,
  CopyButton,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { FC } from 'react';
import { TbCheck, TbCopy } from 'react-icons/tb';

type MarkdownRendererProps = {
  content: string;
};

function extractText(node: any): string {
  if (typeof node === 'string') {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join('');
  }
  if (typeof node === 'object' && node?.props?.children) {
    return extractText(node.props.children);
  }
  return '';
}

export const MarkdownRenderer: FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        // Headings
        h1: ({ node, ...props }) => <Title order={1} {...props} />,
        h2: ({ node, ...props }) => <Title order={2} {...props} />,
        h3: ({ node, ...props }) => <Title order={3} {...props} />,
        h4: ({ node, ...props }) => <Title order={4} {...props} />,
        h5: ({ node, ...props }) => <Title order={5} {...props} />,
        h6: ({ node, ...props }) => <Title order={6} {...props} />,

        // Text
        p: ({ node, ...props }) => <Text {...props} />,
        strong: ({ node, ...props }) => <Text component="strong" inherit {...props} />,
        em: ({ node, ...props }) => <Text component="em" inherit {...props} />,
        del: ({ node, ...props }) => <Text component="del" td="line-through" inherit {...props} />,

        // Lists
        ul: ({ node, ...props }) => <List withPadding listStyleType="disc" {...props} />,
        ol: ({ node, type, ...props }) => <List withPadding listStyleType="decimal" {...props} />,
        li: ({ node, ...props }) => <ListItem {...props} />,

        // Code
        code: (props) => {
          const { children, className, ...rest } = props;
          const isInline = !className;

          if (isInline) {
            return (
              <Code component="span" px={4} py={2} {...rest}>
                {children}
              </Code>
            );
          }

          const codeContent = String(extractText(children)).trim();
          return (
            <div style={{ position: 'relative', marginTop: '1rem', marginBottom: '1rem' }}>
              <Group style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                <CopyButton value={codeContent} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label="" withArrow position="left">
                      <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy} variant="light">
                        {copied ? <TbCheck size={16} /> : <TbCopy size={16} />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group>

              <Code block p="md" className={className} {...props}>
                {children}
              </Code>
            </div>
          );
        },

        // Links
        a: ({ href = '', children, ...props }) => (
          <Anchor href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
          </Anchor>
        ),

        // Images
        img: ({ src = '', alt = '', ...props }) => (
          <Image src={src} alt={alt} radius="md" my="md" {...props} />
        ),

        // Blockquote & Divider
        blockquote: ({ node, ...props }) => <Blockquote mb="sm" {...props} />,
        hr: () => <Divider my="md" />,

        // Tables
        table: ({ children }) => (
          <Table withColumnBorders highlightOnHover striped my="md">
            {children}
          </Table>
        ),
        thead: ({ children }) => <thead>{children}</thead>,
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => <tr>{children}</tr>,
        th: ({ children }) => <th>{children}</th>,
        td: ({ children }) => <td>{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
