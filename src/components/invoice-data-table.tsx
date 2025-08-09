"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface InvoiceItem {
  product_name: string;
  package_details: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  line_total: number;
}

interface InvoiceData {
  items: InvoiceItem[];
  total_amount: number;
}

interface InvoiceDataTableProps {
  data: InvoiceData;
}

const InvoiceDataTable = ({ data }: InvoiceDataTableProps) => {
  console.log("data in data table", data);

  return (
    <Table>
      <TableCaption>A list of your recent invoice items.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Product Name</TableHead>
          <TableHead>Package</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Price/Unit</TableHead>
          <TableHead className="text-right">Line Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.items?.length > 0 ? (
          data.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.product_name}</TableCell>
              <TableCell>{item.package_details}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell>{Number(item.price_per_unit).toLocaleString()} Ks</TableCell>
              <TableCell className="text-right">
                {Number(item.line_total).toLocaleString()} Ks
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableHead colSpan={6}>No invoices found</TableHead>
          </TableRow>
        )}
        <TableRow>
          <TableHead>Total Amount</TableHead>
          <TableCell colSpan={5}>
            {Number(data.total_amount).toLocaleString()} Ks
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default InvoiceDataTable;