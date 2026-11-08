import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEMO_USERS,
  INITIAL_EMERGENCY_ITEMS,
  INITIAL_FAVORS,
  INITIAL_SERVICES,
} from '../data/initialData';
import { storageService } from '../services/storageService';
import {
  AccountTier,
  ActiveTab,
  AppMode,
  CommunityFavor,
  EmergencyItem,
  LocalService,
  SentimentScore,
  ServiceRating,
  UserProfile,
} from '../types';

export interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchDemoUserTier: (tier: AccountTier) => void;

  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  triggerEmergencyBypass: () => void;

  isTutorialOpen: boolean;
  setIsTutorialOpen: (open: boolean) => void;

  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleEmergencyMode: () => void;

  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  pendingSyncCount: number;
  syncNow: () => void;

  isSeniorMode: boolean;
  toggleSeniorMode: () => void;

  isOnboardingActive: boolean;
  setIsOnboardingActive: (active: boolean) => void;
  resetToColdStart: () => void;

  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  isPublishOpen: boolean;
  publishDefaultType: 'service' | 'favor' | 'emergency';
  openPublishModal: (defaultType?: 'service' | 'favor' | 'emergency') => void;
  closePublishModal: () => void;

  services: LocalService[];
  addService: (
    data: Omit<
      LocalService,
      | 'id'
      | 'ratings'
      | 'weightedScore'
      | 'happyCount'
      | 'neutralCount'
      | 'angryCount'
      | 'barterProposals'
      | 'syncStatus'
      | 'providerTier'
    >
  ) => void;
  rateServiceWithFace: (serviceId: string, sentiment: SentimentScore, comment?: string) => void;
  submitBarterProposal: (serviceId: string, offeredExchangeText: string) => void;
  reportItem: (id: string, reason: string) => void;

  favors: CommunityFavor[];
  addFavor: (
    data: Omit<
      CommunityFavor,
      'id' | 'createdAt' | 'status' | 'helpedByCount' | 'syncStatus' | 'authorTier'
    >
  ) => void;
  markFavorStatus: (favorId: string, status: CommunityFavor['status']) => void;

  emergencyItems: EmergencyItem[];
  addEmergencyItem: (
    data: Omit<EmergencyItem, 'id' | 'createdAt' | 'responders' | 'status' | 'syncStatus'>
  ) => void;
  joinEmergencyResponse: (itemId: string) => void;
}

function computeWeightedMetrics(ratings: ServiceRating[]) {
  let happyCount = 0;
  let neutralCount = 0;
  let angryCount = 0;
  let weightedSum = 0;
  let totalWeight = 0;

  for (const r of ratings) {
    if (r.sentiment === 'happy') {
      happyCount += 1;
      weightedSum += 1 * r.weightApplied;
    } else if (r.sentiment === 'neutral') {
      neutralCount += 1;
      weightedSum += 0.5 * r.weightApplied;
    } else {
      angryCount += 1;
    }
    totalWeight += r.weightApplied;
  }

  const weightedScore = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) : 100;
  return { happyCount, neutralCount, angryCount, weightedScore };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS.referente);
  const [mode, setMode] = useState<AppMode>('normal');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSeniorMode, setIsSeniorMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('services');

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isOnboardingActive, setIsOnboardingActive] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search).get('demo');
      if (q === 'onboarding') return true;
      const stored = localStorage.getItem('vecinos_user_profile_v1');
      if (!stored) return true;
    }
    return false;
  });

  const resetToColdStart = () => {
    storageService.clearUserProfile();
    setIsOnboardingActive(true);
  };
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(
    () => !storageService.hasSeenQuickGuide()
  );

  const [isPublishOpen, setIsPublishOpen] = useState<boolean>(false);
  const [publishDefaultType, setPublishDefaultType] = useState<'service' | 'favor' | 'emergency'>(
    'service'
  );

  const [services, setServices] = useState<LocalService[]>(() =>
    storageService.loadServices(INITIAL_SERVICES)
  );
  const [favors, setFavors] = useState<CommunityFavor[]>(() =>
    storageService.loadFavors(INITIAL_FAVORS)
  );
  const [emergencyItems, setEmergencyItems] = useState<EmergencyItem[]>(() =>
    storageService.loadEmergencyItems(INITIAL_EMERGENCY_ITEMS)
  );

  useEffect(() => {
    storageService.saveServices(services);
  }, [services]);

  useEffect(() => {
    storageService.saveFavors(favors);
  }, [favors]);

  useEffect(() => {
    storageService.saveEmergencyItems(emergencyItems);
  }, [emergencyItems]);

  const pendingSyncCount = useMemo(() => {
    const s = services.filter((i) => i.syncStatus === 'pending').length;
    const f = favors.filter((i) => i.syncStatus === 'pending').length;
    const e = emergencyItems.filter((i) => i.syncStatus === 'pending').length;
    return s + f + e;
  }, [services, favors, emergencyItems]);

  const syncNow = () => {
    setServices((prev) => prev.map((item) => ({ ...item, syncStatus: 'synced' })));
    setFavors((prev) => prev.map((item) => ({ ...item, syncStatus: 'synced' })));
    setEmergencyItems((prev) => prev.map((item) => ({ ...item, syncStatus: 'synced' })));
  };

  useEffect(() => {
    if (isOnline && pendingSyncCount > 0) {
      const timer = setTimeout(() => {
        syncNow();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingSyncCount]);

  const switchDemoUserTier = (tier: AccountTier) => {
    setCurrentUser(DEMO_USERS[tier]);
  };

  const toggleEmergencyMode = () => {
    setMode((prev) => {
      const next = prev === 'normal' ? 'emergency' : 'normal';
      setActiveTab(next === 'emergency' ? 'emergency' : 'services');
      return next;
    });
  };

  const triggerEmergencyBypass = () => {
    setIsAuthModalOpen(false);
    setMode('emergency');
    setActiveTab('emergency');
    setPublishDefaultType('emergency');
    setIsPublishOpen(true);
  };

  const toggleSeniorMode = () => setIsSeniorMode((prev) => !prev);

  const openPublishModal = (defaultType?: 'service' | 'favor' | 'emergency') => {
    if (defaultType) {
      setPublishDefaultType(defaultType);
    } else {
      setPublishDefaultType(mode === 'emergency' ? 'emergency' : 'favor');
    }
    setIsPublishOpen(true);
  };

  const closePublishModal = () => setIsPublishOpen(false);

  const handleSetTutorialOpen = (open: boolean) => {
    if (!open) {
      storageService.markQuickGuideSeen();
    }
    setIsTutorialOpen(open);
  };

  const addService: AppContextType['addService'] = (data) => {
    const initialRating: ServiceRating = {
      userId: currentUser.id,
      userName: currentUser.fullName,
      userTier: currentUser.accountTier,
      sentiment: 'happy',
      weightApplied: currentUser.reputationWeight,
      comment: 'Vecino registrado en el directorio del barrio.',
      createdAt: 'Ahora mismo',
    };
    const newItem: LocalService = {
      ...data,
      id: `srv-${Date.now()}`,
      providerTier: currentUser.accountTier,
      barterProposals: [],
      ratings: [initialRating],
      weightedScore: 100,
      happyCount: 1,
      neutralCount: 0,
      angryCount: 0,
      syncStatus: isOnline ? 'synced' : 'pending',
    };
    setServices((prev) => [newItem, ...prev]);
  };

  const rateServiceWithFace: AppContextType['rateServiceWithFace'] = (
    serviceId,
    sentiment,
    comment
  ) => {
    setServices((prev) =>
      prev.map((srv) => {
        if (srv.id !== serviceId) return srv;
        const filtered = srv.ratings.filter((r) => r.userId !== currentUser.id);
        const nextRatings: ServiceRating[] = [
          {
            userId: currentUser.id,
            userName: currentUser.fullName,
            userTier: currentUser.accountTier,
            sentiment,
            weightApplied: currentUser.reputationWeight,
            comment,
            createdAt: 'Ahora mismo',
          },
          ...filtered,
        ];
        const metrics = computeWeightedMetrics(nextRatings);
        return {
          ...srv,
          ratings: nextRatings,
          userVote: sentiment,
          ...metrics,
        };
      })
    );
  };

  const submitBarterProposal: AppContextType['submitBarterProposal'] = (
    serviceId,
    offeredExchangeText
  ) => {
    const cleanText = offeredExchangeText.trim();
    if (!cleanText) return;
    setServices((prev) =>
      prev.map((srv) => {
        if (srv.id !== serviceId) return srv;
        return {
          ...srv,
          barterProposals: [
            {
              id: `bp-${Date.now()}`,
              serviceId,
              proposerName: currentUser.fullName,
              proposerTier: currentUser.accountTier,
              offeredExchangeText: cleanText,
              status: 'pendiente',
              createdAt: 'Ahora mismo',
            },
            ...srv.barterProposals,
          ],
        };
      })
    );
  };

  const reportItem: AppContextType['reportItem'] = (id) => {
    setServices((prev) =>
      prev.map((srv) => (srv.id === id ? { ...srv, isReported: true } : srv))
    );
  };

  const addFavor: AppContextType['addFavor'] = (data) => {
    const newFavor: CommunityFavor = {
      ...data,
      id: `fav-${Date.now()}`,
      authorTier: currentUser.accountTier,
      createdAt: 'Ahora mismo',
      status: 'disponible',
      helpedByCount: 0,
      syncStatus: isOnline ? 'synced' : 'pending',
    };
    setFavors((prev) => [newFavor, ...prev]);
  };

  const markFavorStatus: AppContextType['markFavorStatus'] = (favorId, status) => {
    setFavors((prev) =>
      prev.map((fav) =>
        fav.id === favorId
          ? {
              ...fav,
              status,
              helpedByCount: status === 'en_curso' ? fav.helpedByCount + 1 : fav.helpedByCount,
            }
          : fav
      )
    );
  };

  const addEmergencyItem: AppContextType['addEmergencyItem'] = (data) => {
    const newItem: EmergencyItem = {
      ...data,
      id: `emg-${Date.now()}`,
      createdAt: 'Ahora mismo',
      responders: [currentUser.fullName],
      status: 'activo',
      syncStatus: isOnline ? 'synced' : 'pending',
    };
    setEmergencyItems((prev) => [newItem, ...prev]);
  };

  const joinEmergencyResponse: AppContextType['joinEmergencyResponse'] = (itemId) => {
    setEmergencyItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const alreadyJoined = item.responders.includes(currentUser.fullName);
        const nextResponders = alreadyJoined
          ? item.responders
          : [...item.responders, currentUser.fullName];
        return {
          ...item,
          responders: nextResponders,
        };
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchDemoUserTier,
        isAuthModalOpen,
        setIsAuthModalOpen,
        triggerEmergencyBypass,
        isTutorialOpen,
        setIsTutorialOpen: handleSetTutorialOpen,
        mode,
        setMode,
        toggleEmergencyMode,
        isOnline,
        setIsOnline,
        pendingSyncCount,
        syncNow,
        isSeniorMode,
        toggleSeniorMode,
        isOnboardingActive,
        setIsOnboardingActive,
        resetToColdStart,
        activeTab,
        setActiveTab,
        isPublishOpen,
        publishDefaultType,
        openPublishModal,
        closePublishModal,
        services,
        addService,
        rateServiceWithFace,
        submitBarterProposal,
        reportItem,
        favors,
        addFavor,
        markFavorStatus,
        emergencyItems,
        addEmergencyItem,
        joinEmergencyResponse,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de un AppProvider');
  }
  return context;
}
