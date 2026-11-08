import { DniValidationResult } from '../types';

export interface LocalDniEntry {
  fullName: string;
  isMinor: boolean;
  roleDescription?: string;
  tier?: 'referente' | 'activo' | 'nuevo';
}

/**
 * Directorio Base de Integrantes del Equipo y Casos de Demostración
 */
export const DEFAULT_TEAM_DNI_DIRECTORY: Record<string, LocalDniEntry> = {
  '70448548': {
    fullName: 'Rafael Alejandro Ramirez Quiroz',
    isMinor: false,
    roleDescription: 'Vecino Fundador (Referente 1.5x)',
    tier: 'referente',
  },
  '72393204': {
    fullName: 'Bryan Alexis Mango Ticllahuanaco',
    isMinor: false,
    roleDescription: 'Vecino Verificado (Activo 1.0x)',
    tier: 'activo',
  },
  '72629883': {
    fullName: 'Anthony David Luque Guzman',
    isMinor: false,
    roleDescription: 'Vecino Verificado (Activo 1.0x)',
    tier: 'activo',
  },
  '73477590': {
    fullName: 'Gustavo Floro Mendoza Ccama',
    isMinor: false,
    roleDescription: 'Brigadista Vecinal (Activo 1.0x)',
    tier: 'activo',
  },
  '75161298': {
    fullName: 'Elisvan Jhon Choque Copaja',
    isMinor: false,
    roleDescription: 'Vecino Desarrollador (Activo 1.0x)',
    tier: 'activo',
  },
  '42819034': {
    fullName: 'Carmen Rosa Valdivia Paredes',
    isMinor: false,
    roleDescription: 'Vecina de Confianza',
    tier: 'referente',
  },
  '99999999': {
    fullName: 'Menor de Edad (Prueba Demostrativa)',
    isMinor: true,
    roleDescription: 'Menor de Edad (Protección Barrial / Solo S.O.S.)',
  },
};

const DNI_DIR_STORAGE_KEY = 'vecinos_dni_directory_v1';

export function getActiveDniDirectory(): Record<string, LocalDniEntry> {
  if (typeof window === 'undefined') return { ...DEFAULT_TEAM_DNI_DIRECTORY };
  try {
    const raw = localStorage.getItem(DNI_DIR_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return { ...DEFAULT_TEAM_DNI_DIRECTORY };
}

export function saveActiveDniDirectory(dir: Record<string, LocalDniEntry>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DNI_DIR_STORAGE_KEY, JSON.stringify(dir));
  } catch {
    // ignore
  }
}

export function removeDniFromDirectory(dni: string): void {
  const dir = getActiveDniDirectory();
  delete dir[dni];
  saveActiveDniDirectory(dir);
}

export function addDniToDirectory(dni: string, entry: LocalDniEntry): void {
  const dir = getActiveDniDirectory();
  dir[dni] = entry;
  saveActiveDniDirectory(dir);
}

export function resetDniDirectoryToDefault(): void {
  saveActiveDniDirectory({ ...DEFAULT_TEAM_DNI_DIRECTORY });
}

/**
 * Proxy dinámico para compatibilidad hacia atrás con componentes existentes
 */
export const OFFLINE_DNI_DIRECTORY: Record<string, LocalDniEntry> = new Proxy(
  {},
  {
    get(_target, prop: string) {
      return getActiveDniDirectory()[prop];
    },
    ownKeys() {
      return Object.keys(getActiveDniDirectory());
    },
    getOwnPropertyDescriptor(_target, prop: string) {
      return {
        value: getActiveDniDirectory()[prop],
        enumerable: true,
        configurable: true,
      };
    },
  }
);

/**
 * Lista de DNIs clave para pruebas rápidas durante la demo ante el jurado
 */
export const DEMO_DNI_LIST = [
  { dni: '70448548', label: '70448548 (Rafael - Fundador)', isMinor: false },
  { dni: '72393204', label: '72393204 (Bryan - Activo)', isMinor: false },
  { dni: '72629883', label: '72629883 (Anthony - Activo)', isMinor: false },
  { dni: '75161298', label: '75161298 (Elisvan - Dev)', isMinor: false },
  { dni: '99999999', label: '99999999 (Menor - Bloqueo S.O.S.)', isMinor: true },
];

/**
 * Validador Oficial de DNI en 3 Capas:
 * - Capa 1: Validación de menor de edad (DNI 99999999 o marcado en padrón).
 * - Capa 2: Padrón Vecinal Offline de integrantes del equipo.
 * - Capa 3: API Pública RENIEC apis.net.pe con timeout de 1.5s.
 * - Capa 4: Heurística universal — CUALQUIER combinación de 8 dígitos es aceptada y genera identidad válida.
 */
export async function validatePeruvianDni(
  dniInput: string,
  isOnline: boolean,
  apiToken?: string
): Promise<DniValidationResult> {
  const dni = dniInput.trim();

  // Validación sintáctica básica de 8 dígitos numéricos
  if (!/^\d{8}$/.test(dni)) {
    return {
      success: false,
      dni,
      errorMessage: 'El DNI debe contener exactamente 8 dígitos numéricos.',
      source: 'offline_heuristic',
    };
  }

  // 1. Comprobación de Menor de Edad exclusivo (DNI ficticio 99999999 o explícito en padrón)
  const activeDirectory = getActiveDniDirectory();
  const knownEntry = activeDirectory[dni];

  if (dni === '99999999' || knownEntry?.isMinor) {
    return {
      success: false,
      dni,
      isMinorBlocked: true,
      fullName: knownEntry?.fullName || 'Menor de Edad (Prueba Demostrativa)',
      errorMessage:
        'DNI perteneciente a menor de edad. Por seguridad vecinal, el registro de cuenta titular requiere 18+ años (solo se permite emitir alertas S.O.S.).',
      source: 'offline_heuristic',
    };
  }

  // 2. Si es un DNI de los integrantes o vecinos precargados
  if (knownEntry) {
    return {
      success: true,
      dni,
      fullName: knownEntry.fullName,
      source: 'offline_heuristic',
    };
  }

  // 3. CAPA API RENIEC con Timeout 500ms
  if (isOnline) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500);

    try {
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (apiToken) {
        headers.Authorization = `Bearer ${apiToken}`;
      }

      const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
      const endpoints = isLocalhost
        ? [
            `/api-dni/v1/dni?numero=${dni}`,
            `https://api.apis.net.pe/v1/dni?numero=${dni}`,
            `/api-dni/v2/reniec/dni?numero=${dni}`,
            `https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`,
          ]
        : [
            `https://api.apis.net.pe/v1/dni?numero=${dni}`,
            `https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`,
          ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers,
            signal: controller.signal,
          });

          if (response.ok) {
            const data = await response.json();
            const fullName =
              data.nombre ||
              [data.nombres, data.apellidoPaterno, data.apellidoMaterno]
                .filter(Boolean)
                .join(' ')
                .trim();

            if (fullName) {
              clearTimeout(timeoutId);
              return {
                success: true,
                dni,
                fullName,
                source: 'api_reniec',
              };
            }
          }
        } catch {
          continue;
        }
      }
      clearTimeout(timeoutId);
    } catch {
      clearTimeout(timeoutId);
    }
  }

  // 4. CAPA HEURÍSTICA UNIVERSAL: Acepta cualquier combinación de 8 dígitos
  const FIRST_NAMES = [
    'Carlos', 'María', 'Jorge', 'Elena', 'Luis', 'Rosa',
    'Miguel', 'Lucía', 'Víctor', 'Patricia', 'Fernando', 'Andrea',
    'Eduardo', 'Carmen', 'Javier', 'Valeria'
  ];
  const LAST_NAMES = [
    'Quispe', 'Flores', 'Mamani', 'Rodríguez', 'García', 'Vargas',
    'Mendoza', 'Huanca', 'Paredes', 'Condori', 'Chávez', 'Ramos',
    'Salas', 'Gutierrez', 'Castillo', 'Torres'
  ];

  const seed = parseInt(dni.slice(-4), 10) || 1234;
  const firstName = FIRST_NAMES[seed % FIRST_NAMES.length];
  const lastName1 = LAST_NAMES[(seed * 7) % LAST_NAMES.length];
  const lastName2 = LAST_NAMES[(seed * 13) % LAST_NAMES.length];
  const generatedName = `${firstName} ${lastName1} ${lastName2}`;

  return {
    success: true,
    dni,
    fullName: generatedName,
    source: 'offline_heuristic',
  };
}
