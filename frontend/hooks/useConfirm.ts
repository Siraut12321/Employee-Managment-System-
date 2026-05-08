'use client';

import { useState, useCallback } from 'react';

interface ConfirmState {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
}

const defaultState: ConfirmState = {
  open: false,
  title: '',
  description: '',
  onConfirm: () => {},
};

export function useConfirm() {
  const [state, setState] = useState<ConfirmState>(defaultState);

  const confirm = useCallback((title: string, description: string, onConfirm: () => void) => {
    setState({ open: true, title, description, onConfirm });
  }, []);

  const close = useCallback(() => setState(defaultState), []);

  return { confirmState: state, confirm, closeConfirm: close };
}
