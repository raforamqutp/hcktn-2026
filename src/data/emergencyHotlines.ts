import { Flame, HeartPulse, PhoneCall, Shield } from 'lucide-react';
import React from 'react';

export interface EmergencyHotlineItem {
  name: string;
  number: string;
  displayNumber: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: 'emerald' | 'red' | 'rose' | 'blue';
}

export const EMERGENCY_HOTLINES_DATA: EmergencyHotlineItem[] = [
  {
    name: 'Serenazgo Yanahuara',
    number: '054270000',
    displayNumber: '(054) 270000',
    subtitle: 'Seguridad y patrullaje 24/7',
    icon: Shield,
    accentColor: 'emerald',
  },
  {
    name: 'Bomberos CGBVP',
    number: '116',
    displayNumber: '116',
    subtitle: 'Incendios y rescate',
    icon: Flame,
    accentColor: 'red',
  },
  {
    name: 'SAMU Urgencias',
    number: '106',
    displayNumber: '106',
    subtitle: 'Ambulancia médica de emergencia',
    icon: HeartPulse,
    accentColor: 'rose',
  },
  {
    name: 'Policía Nacional',
    number: '105',
    displayNumber: '105',
    subtitle: 'Central de emergencia PNP',
    icon: PhoneCall,
    accentColor: 'blue',
  },
];
