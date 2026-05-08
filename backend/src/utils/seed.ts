import dotenv from 'dotenv';
import connectDB from '../config/db';
import Admin from '../models/Admin';

dotenv.config();

const seed = async () => {
  await connectDB();
  
  const exists = await Admin.findOne({ email: 'admin@company.com' });
  if (exists) {
    console.log('Super admin already exists');
    process.exit(0);
  }

  await Admin.create({
    name: 'Super Admin',
    email: 'admin@company.com',
    password: 'Admin@123',
    role: 'super_admin'
  });

  console.log('Super admin created: admin@company.com / Admin@123');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
