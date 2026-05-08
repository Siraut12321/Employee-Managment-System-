import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  employeeId: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  departmentId: mongoose.Types.ObjectId;
  salary: number;
  status: 'active' | 'inactive';
  joinDate: Date;
  profileImage?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    position: { type: String, required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    salary: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    joinDate: { type: Date, required: true },
    profileImage: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

employeeSchema.index({ name: 'text', email: 'text', position: 'text' });
employeeSchema.index({ status: 1 });
employeeSchema.index({ departmentId: 1 });
employeeSchema.index({ createdAt: -1 });

export default mongoose.model<IEmployee>('Employee', employeeSchema);
