export type AppMode = 'normal' | 'emergency';
export type ActiveTab = 'services' | 'favors' | 'map' | 'emergency';
export type SyncStatus = 'synced' | 'pending';

export type AccountTier = 'nuevo' | 'activo' | 'referente';

export interface UserProfile {
  id: string;
  dni: string;
  fullName: string;
  neighborhood: string;
  accountTier: AccountTier;
  seniorityMonths: number;
  reputationWeight: number;
  isVerifiedAdult: boolean;
}

export interface DniValidationResult {
  success: boolean;
  dni: string;
  fullName?: string;
  isMinorBlocked?: boolean;
  errorMessage?: string;
  source: 'api_reniec' | 'offline_heuristic';
}

export interface GeoPoint {
  lat: number;
  lng: number;
  reference: string;
  distanceMeters: number;
  walkingMinutes: number;
  privacyRadiusMeters?: number;
}

export type SentimentScore = 'happy' | 'neutral' | 'angry';
export type PaymentMethod = 'efectivo' | 'billetera_virtual' | 'trueque';

export interface ServiceRating {
  userId: string;
  userName: string;
  userTier: AccountTier;
  sentiment: SentimentScore;
  weightApplied: number;
  comment?: string;
  providerReply?: string;
  createdAt: string;
}

export interface BarterProposal {
  id: string;
  serviceId: string;
  proposerName: string;
  proposerTier: AccountTier;
  offeredExchangeText: string;
  status: 'pendiente' | 'aceptado';
  createdAt: string;
}

export type ServiceCategory =
  | 'gastronomia_vecinal'
  | 'oficio_hogar'
  | 'educacion_clases'
  | 'cuidado_paseo'
  | 'salud_auxilio'
  | 'brigada_soporte';

export interface LocalService {
  id: string;
  providerName: string;
  providerTier: AccountTier;
  tradeTitle: string;
  category: ServiceCategory;
  description: string;
  phone: string;
  priceRange: string;
  paymentMethods: PaymentMethod[];
  barterInterest?: string;
  barterProposals: BarterProposal[];
  ratings: ServiceRating[];
  weightedScore: number;
  happyCount: number;
  neutralCount: number;
  angryCount: number;
  userVote?: SentimentScore;
  trustBadges: string[];
  isEmergencySupport: boolean;
  isReported?: boolean;
  location: GeoPoint;
  syncStatus: SyncStatus;
}

export type FavorCategory =
  | 'prestamo_salud_herramienta'
  | 'movilidad_pool'
  | 'ayuda_temporal'
  | 'donacion_material'
  | 'intercambio_trueque';

export interface CommunityFavor {
  id: string;
  authorName: string;
  authorTier: AccountTier;
  direction: 'ofrezco' | 'solicito';
  category: FavorCategory;
  title: string;
  description: string;
  exchangeNote?: string;
  safeMeetingPoint?: string;
  createdAt: string;
  status: 'disponible' | 'en_curso' | 'completado';
  helpedByCount: number;
  location: GeoPoint;
  syncStatus: SyncStatus;
}

export type EmergencyType =
  | 'vecino_vulnerable'
  | 'recurso_compartido'
  | 'brigada_vecinal'
  | 'alerta_peligro';

export type UrgencyLevel = 'critica' | 'alta' | 'moderada' | 'informativa';
export type EdanCategory =
  | 'salud_vida'
  | 'agua_alimento'
  | 'inundacion_lluvia'
  | 'infraestructura_energia';

export interface EmergencyItem {
  id: string;
  authorName: string;
  type: EmergencyType;
  edanCategory: EdanCategory;
  urgency: UrgencyLevel;
  title: string;
  description: string;
  resourceTags: string[];
  responders: string[];
  isSensitiveProtected: boolean;
  expiresInHours: number;
  status: 'activo' | 'atendido';
  createdAt: string;
  location: GeoPoint;
  syncStatus: SyncStatus;
}
