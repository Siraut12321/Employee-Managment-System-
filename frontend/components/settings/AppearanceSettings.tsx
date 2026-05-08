'use client';

import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const themes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>Customize how the dashboard looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-3">Theme</p>
            <div className="flex gap-3">
              {themes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all flex-1',
                    theme === value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted'
                  )}
                >
                  <Icon className={cn('w-5 h-5', theme === value ? 'text-primary' : 'text-muted-foreground')} />
                  <span className={cn('text-xs font-medium', theme === value ? 'text-primary' : 'text-muted-foreground')}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
