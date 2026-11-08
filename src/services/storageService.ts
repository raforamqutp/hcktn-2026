import { CommunityFavor, EmergencyItem, LocalService, UserProfile } from '../types';

const STORAGE_KEYS = {
  SERVICES: 'vecinos_services_v1',
  FAVORS: 'vecinos_favors_v1',
  EMERGENCY: 'vecinos_emergency_v1',
  GUIDE_SEEN: 'vecinos_guide_seen_v1',
  USER_PROFILE: 'vecinos_user_profile_v1',
  SYNC_QUEUE: 'vecinos_sync_queue_v1',
};

/**
 * Servicio de Almacenamiento Local-First y Cola de Sincronización Offline
 * Garantiza resiliencia cuando el usuario pierde la conexión a internet.
 */
export const storageService = {
  // ==========================================
  // SERVICIOS (MÓDULO 1)
  // ==========================================
  loadServices(fallback: LocalService[]): LocalService[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  saveServices(items: LocalService[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(items));
    } catch {
      return;
    }
  },

  // ==========================================
  // CADENA DE FAVORES (MÓDULO 2)
  // ==========================================
  loadFavors(fallback: CommunityFavor[]): CommunityFavor[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FAVORS);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  saveFavors(items: CommunityFavor[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORS, JSON.stringify(items));
    } catch {
      return;
    }
  },

  // ==========================================
  // EMERGENCIAS S.O.S. (MÓDULO 3)
  // ==========================================
  loadEmergencyItems(fallback: EmergencyItem[]): EmergencyItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EMERGENCY);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  saveEmergencyItems(items: EmergencyItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EMERGENCY, JSON.stringify(items));
    } catch {
      return;
    }
  },

  // ==========================================
  // GUÍA RÁPIDA / TUTORIAL DE PRIMERA APERTURA
  // ==========================================
  hasSeenQuickGuide(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.GUIDE_SEEN) === 'true';
    } catch {
      return false;
    }
  },

  markQuickGuideSeen(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GUIDE_SEEN, 'true');
    } catch {
      return;
    }
  },

  resetQuickGuide(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.GUIDE_SEEN);
    } catch {
      return;
    }
  },

  // ==========================================
  // PERFIL DE IDENTIDAD VECINAL (DNI PERSISTENTE)
  // ==========================================
  loadUserProfile(fallback: UserProfile): UserProfile {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  saveUserProfile(user: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
    } catch {
      return;
    }
  },

  clearUserProfile(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    } catch {
      return;
    }
  },
};
