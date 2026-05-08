'use client';

import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ROLE_LABELS } from '@/constants';
import { getInitials } from '@/lib/utils';
import { Shield, Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProfileCard() {
  const admin = useAuthStore((s) => s.admin);

  if (!admin) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {getInitials(admin.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{admin.name}</p>
              <Badge variant="secondary" className="mt-1">
                {ROLE_LABELS[admin.role] ?? admin.role}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Info rows */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-muted rounded-lg">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{admin.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-muted rounded-lg">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{admin.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-muted rounded-lg">
                <Shield className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="font-medium">{ROLE_LABELS[admin.role] ?? admin.role}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
