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
      if (!raw) return fallback;
      const parsed: LocalService[] = JSON.parse(raw);
      return parsed.map((item) => ({
        ...item,
        providerName: item.providerName
          .replace('Jorge Luis Huanca (Maestro Cerrajero)', 'Jorge Luis Huanca')
          .replace('Prof. Mario Cortéz Salas', 'Mario Cortéz Salas')
          .replace('Prof. Mario Cortz Salas', 'Mario Cortéz Salas')
          .replace('Lic. Claudia Benavente (Enfermera)', 'Claudia Benavente')
          .replace('Lic. Claudia Benavente', 'Claudia Benavente'),
      }));
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
      if (!raw) return fallback;
      const parsed: CommunityFavor[] = JSON.parse(raw);
      return parsed.map((item) => ({
        ...item,
        authorName: item.authorName
          .replace('Juan Carlos Mamani (Mz. D)', 'Juan Carlos Mamani')
          .replace('Andrea Cornejo (Mamá de 4to grado)', 'Andrea Cornejo')
          .replace('Rosa Valdivia (Vecina Mz. B)', 'Rosa Valdivia'),
      }));
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
      if (!raw) return fallback;
      const parsed: EmergencyItem[] = JSON.parse(raw);
      return parsed.map((item) => ({
        ...item,
        authorName: item.authorName
          .replace('Familia Salazar (Reporte Verificado)', 'Miguel Salazar Ramos')
          .replace('Gustavo Mendoza (Vecino Mz. E)', 'Gustavo Mendoza')
          .replace('Don Manuel (Gasfitero Mz. B)', 'Manuel Flores Vilca')
          .replace('Don Lucho Paredes (Ferretería El Peral)', 'Luis Paredes Zeballos')
          .replace('Familia Quispe (Mz. F)', 'Carlos Quispe Huamán'),
        responders: item.responders.map((r) =>
          r
            .replace('Lic. Claudia Benavente', 'Claudia Benavente')
            .replace('Don Manuel', 'Manuel Flores Vilca')
            .replace('Don Lucho Paredes', 'Luis Paredes Zeballos')
        ),
      }));
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

  // ==========================================
  // CREDENCIALES DE CUENTAS LOCALES (DEMO / OFFLINE)
  // ==========================================
  loadRegisteredAccounts(): Record<string, { password?: string; phone?: string; fullName: string; isMinor: boolean }> {
    try {
      const raw = localStorage.getItem('vecinos_registered_accounts_v1');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  saveRegisteredAccount(dni: string, data: { password?: string; phone?: string; fullName: string; isMinor: boolean }): void {
    try {
      const accounts = this.loadRegisteredAccounts();
      accounts[dni] = { ...accounts[dni], ...data };
      localStorage.setItem('vecinos_registered_accounts_v1', JSON.stringify(accounts));
    } catch {
      return;
    }
  },

  resetAllToFactoryDefaults(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SERVICES);
      localStorage.removeItem(STORAGE_KEYS.FAVORS);
      localStorage.removeItem(STORAGE_KEYS.EMERGENCY);
      localStorage.removeItem(STORAGE_KEYS.GUIDE_SEEN);
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
      localStorage.removeItem('vecinos_registered_accounts_v1');
    } catch {
      return;
    }
  },
};
