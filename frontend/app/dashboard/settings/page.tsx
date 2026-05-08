'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileCard } from '@/components/settings/ProfileCard';
import { CreateAdminForm } from '@/components/settings/CreateAdminForm';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { SystemInfo } from '@/components/settings/SystemInfo';
import { usePermission } from '@/hooks/usePermission';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { can } = usePermission();

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account and application preferences</p>
      </motion.div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {can('canManageAdmins') && <TabsTrigger value="admins">Admin Users</TabsTrigger>}
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="max-w-md">
            <ProfileCard />
          </div>
        </TabsContent>

        {can('canManageAdmins') && (
          <TabsContent value="admins" className="mt-6">
            <CreateAdminForm />
          </TabsContent>
        )}

        <TabsContent value="appearance" className="mt-6">
          <div className="max-w-md">
            <AppearanceSettings />
          </div>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <div className="max-w-md">
            <SystemInfo />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
