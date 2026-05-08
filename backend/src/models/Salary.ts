import mongoose, { Schema, Document } from 'mongoose';

export interface ISalary extends Document {
  employeeId: mongoose.Types.ObjectId;
  month: number;
  year: number;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'paid';
  paidDate?: Date;
  notes?: string;
  createdAt: Date;
}

const salarySchema = new Schema<ISalary>({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  baseSalary: { type: Number, required: true, min: 0 },
  bonus: { type: Number, default: 0, min: 0 },
  deductions: { type: Number, default: 0, min: 0 },
  netSalary: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paidDate: { type: Date },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

salarySchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model<ISalary>('Salary', salarySchema);
