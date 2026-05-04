'use client';

import React from 'react';
import ChatWindow from './ChatWindow';

interface VirtualAssistantProps {
  onClose: () => void;
}

const VirtualAssistant = ({ onClose }: VirtualAssistantProps) => {
  return <ChatWindow onClose={onClose} />;
};

export default VirtualAssistant;
