import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  description?: string;
  managerId?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
}

const departmentSchema = new Schema<IDepartment>({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  managerId: { type: Schema.Types.ObjectId, ref: 'Employee' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IDepartment>('Department', departmentSchema);
