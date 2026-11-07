import { CommunityFavor, EmergencyItem, LocalService } from '../types';

const KEYS = {
  SERVICES: 'vecinos_services_v1',
  FAVORS: 'vecinos_favors_v1',
  EMERGENCY: 'vecinos_emergency_v1',
  GUIDE_SEEN: 'vecinos_guide_seen_v1',
};

export const storageService = {
  loadServices(fallback: LocalService[]): LocalService[] {
    try {
      const raw = localStorage.getItem(KEYS.SERVICES);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  saveServices(items: LocalService[]): void {
    try {
      localStorage.setItem(KEYS.SERVICES, JSON.stringify(items));
    } catch {
      return;
    }
  },

  loadFavors(fallback: CommunityFavor[]): CommunityFavor[] {
    try {
      const raw = localStorage.getItem(KEYS.FAVORS);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  saveFavors(items: CommunityFavor[]): void {
    try {
      localStorage.setItem(KEYS.FAVORS, JSON.stringify(items));
    } catch {
      return;
    }
  },

  loadEmergencyItems(fallback: EmergencyItem[]): EmergencyItem[] {
    try {
      const raw = localStorage.getItem(KEYS.EMERGENCY);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  saveEmergencyItems(items: EmergencyItem[]): void {
    try {
      localStorage.setItem(KEYS.EMERGENCY, JSON.stringify(items));
    } catch {
      return;
    }
  },

  hasSeenQuickGuide(): boolean {
    try {
      return localStorage.getItem(KEYS.GUIDE_SEEN) === 'true';
    } catch {
      return false;
    }
  },

  markQuickGuideSeen(): void {
    try {
      localStorage.setItem(KEYS.GUIDE_SEEN, 'true');
    } catch {
      return;
    }
  },
};
