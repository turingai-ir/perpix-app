import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@perpix/ui/components/table";

const meta = { title: "Components/Table", component: Table } satisfies Meta<
  typeof Table
>;
export default meta;

export const Payments: StoryObj<typeof meta> = {
  render: () => (
    <Table>
      <TableCaption>پرداخت‌های اخیر</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>شرح</TableHead>
          <TableHead>مبلغ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>شارژ کیف پول</TableCell>
          <TableCell>۸۲۰٬۰۰۰ تومان</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
