import { DniValidationResult } from '../types';

export interface LocalDniEntry {
  fullName: string;
  isMinor: boolean;
  roleDescription?: string;
  tier?: 'referente' | 'activo' | 'nuevo';
}

/**
 * Padrón Vecinal Offline (Capa 2)
 * Incluye los DNIs de los 5 integrantes del equipo IDE, vecinos de la cuadra y el caso de menor de edad.
 */
export const OFFLINE_DNI_DIRECTORY: Record<string, LocalDniEntry> = {
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
  '81234567': {
    fullName: 'Mateo Sebastian Quispe (Menor de Edad)',
    isMinor: true,
    roleDescription: 'Menor de Edad (Bloqueo Infantil con Bypass S.O.S.)',
  },
};

/**
 * Lista de DNIs clave para pruebas rápidas durante la demo ante el jurado
 */
export const DEMO_DNI_LIST = [
  { dni: '70448548', label: '70448548 (Rafael - Fundador)', isMinor: false },
  { dni: '72393204', label: '72393204 (Bryan - Activo)', isMinor: false },
  { dni: '75161298', label: '75161298 (Elisvan - Dev)', isMinor: false },
  { dni: '81234567', label: '81234567 (Menor - Bloqueo S.O.S.)', isMinor: true },
];

/**
 * Validador Oficial de DNI en 3 Capas:
 * - Capa 1: API Pública apis.net.pe v1 / v2 con AbortController (timeout estricto de 1.5s).
 *   Blindaje: Si hay timeout, error de red, CORS o límite HTTP (401/429/500), JAMÁS acusa
 *   de menor de edad; pasa en silencio a la Capa 2.
 * - Capa 2: Padrón Vecinal Offline + Heurística de Serie Correlativa peruana (series >= 81xxxxxx).
 * - Capa 3: Declaración Jurada vecinal (validada en el formulario modal).
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

  // Comprobación prioritaria en el padrón local si está explícitamente registrado como menor
  if (OFFLINE_DNI_DIRECTORY[dni]?.isMinor) {
    return {
      success: false,
      dni,
      isMinorBlocked: true,
      errorMessage:
        'DNI no habilitado o perteneciente a menor de edad. El registro titular requiere ser mayor de 18 años.',
      source: 'offline_heuristic',
    };
  }

  // ==========================================
  // CAPA 1: Consulta a API Pública con Timeout 1500ms
  // ==========================================
  if (isOnline) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    try {
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (apiToken) {
        headers.Authorization = `Bearer ${apiToken}`;
      }

      // En apis.net.pe, el endpoint v1 (/v1/dni) es público y no requiere token Bearer.
      // Usamos el proxy local de Vite (/api-dni/v1/dni) o llamada directa.
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

          // Solo si el servicio oficial de Reniec responde explícitamente 404 (no encontrado / no habilitado)
          if (response.status === 404) {
            clearTimeout(timeoutId);
            return {
              success: false,
              dni,
              isMinorBlocked: true,
              errorMessage:
                'DNI no habilitado o perteneciente a menor de edad. El registro titular requiere ser mayor de 18 años.',
              source: 'api_reniec',
            };
          }

          if (response.ok) {
            const data = await response.json();
            // apis.net.pe v1 devuelve data.nombre o nombres + apellidos
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
          // Si el endpoint específico falla o da CORS, intenta el siguiente
          continue;
        }
      }
      clearTimeout(timeoutId);
    } catch {
      clearTimeout(timeoutId);
      // Timeout, CORS o red: continuar silenciosamente a Capa 2
    }
  }

  // ==========================================
  // CAPA 2: Padrón Offline y Heurística por Serie Correlativa
  // ==========================================
  const knownEntry = OFFLINE_DNI_DIRECTORY[dni];
  if (knownEntry) {
    return {
      success: !knownEntry.isMinor,
      dni,
      fullName: knownEntry.fullName,
      isMinorBlocked: knownEntry.isMinor,
      errorMessage: knownEntry.isMinor
        ? 'DNI no habilitado o perteneciente a menor de edad. El registro titular requiere ser mayor de 18 años.'
        : undefined,
      source: 'offline_heuristic',
    };
  }

  // En Perú, correlativos >= 81000000 corresponden a menores de edad recientes
  const numericVal = parseInt(dni, 10);
  const numericPrefix = parseInt(dni.substring(0, 2), 10);
  if (numericPrefix >= 81 || numericVal >= 81000000) {
    return {
      success: false,
      dni,
      isMinorBlocked: true,
      errorMessage:
        'DNI no habilitado o perteneciente a menor de edad. El registro titular requiere ser mayor de 18 años.',
      source: 'offline_heuristic',
    };
  }

  // Serie adulta válida reconocida por heurística comunitaria
  return {
    success: true,
    dni,
    fullName: 'Vecino Verificado',
    source: 'offline_heuristic',
  };
}
