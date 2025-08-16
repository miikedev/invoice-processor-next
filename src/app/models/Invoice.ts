// models/Invoice.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface IInvoiceItem extends Document {
    product_name: string;
    package_details?: string;
    quantity: number;
    unit?: string;
    price_per_unit?: number;
    line_total?: number;
}

export interface IInvoice extends Document {
    items: IInvoiceItem[];
    total_amount: number;
    created_at: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
    product_name: { type: String, required: true },
    package_details: { type: String },
    quantity: { type: Number, required: true },
    unit: { type: String },
    price_per_unit: { type: Number },
    line_total: { type: Number },
});

const InvoiceSchema = new Schema<IInvoice>({
    items: {
        type: [InvoiceItemSchema],
        required: true,
    },
    total_amount: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

// ✅ Prevent model overwrite issue
export const Invoice =
    models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);