import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Heading1,
  Heading2,
  Paragraph,
  Muted,
} from "@perpix/ui/components/typography";

const meta = {
  title: "Components/Typography",
  component: Heading1,
} satisfies Meta<typeof Heading1>;
export default meta;

export const HeadingsAndBody: StoryObj<typeof meta> = {
  render: () => (
    <>
      <Heading1>حساب کاربری</Heading1>
      <Heading2>کیف پول</Heading2>
      <Paragraph>تاریخچهٔ پرداخت‌های شما</Paragraph>
      <Muted>به‌روزرسانی امروز</Muted>
    </>
  ),
};
