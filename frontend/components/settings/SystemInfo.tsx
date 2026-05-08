'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { API_URL } from '@/constants';
import { Server, Globe, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

export function SystemInfo() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    axios.get(`${API_URL.replace('/api', '')}/health`, { timeout: 4000 })
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  const rows = [
    { label: 'Application', value: 'EMS Admin Dashboard' },
    { label: 'Version', value: '1.0.0' },
    { label: 'Framework', value: 'Next.js 15 App Router' },
    { label: 'API URL', value: API_URL },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="w-4 h-4" />
            System Information
          </CardTitle>
          <CardDescription>Application and backend connection details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium font-mono text-xs">{value}</span>
            </div>
          ))}

          <Separator />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Backend API</span>
            </div>
            {apiStatus === 'checking' ? (
              <Badge variant="secondary">Checking...</Badge>
            ) : apiStatus === 'online' ? (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Online
              </Badge>
            ) : (
              <Badge variant="destructive" className="flex items-center gap-1">
                <XCircle className="w-3 h-3" /> Offline
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
