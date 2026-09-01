/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  ConsumablesConfig,
  CustomConsumable,
  ElectricityConfig,
  EquipmentItem,
  GlassItem,
  LaborConfig,
  LaborStageId,
  MarginRiskConfig,
  ProjectMetadata,
  VitralisProject,
} from '../types/project';
import { useStudio } from './StudioContext';
import { recalculateEntireProject } from '../utils/calculations';
import { PROJECT_TEMPLATES } from '../constants/templates';
import { SAMPLE_GLASS_ITEMS, EMPTY_COST_BREAKDOWN } from '../constants/defaults';
import confetti from 'canvas-confetti';

const ACTIVE_PROJECT_KEY = 'vitralis_active_project_v1';
const SAVED_PROJECTS_KEY = 'vitralis_saved_projects_v1';

export interface ProjectContextState {
  project: VitralisProject;
  savedProjects: VitralisProject[];
  activeTab: 'calculator' | 'projects' | 'templates' | 'studio' | 'quote' | 'tools';
  setActiveTab: (tab: 'calculator' | 'projects' | 'templates' | 'studio' | 'quote' | 'tools') => void;
  // Glass mutations
  addGlassItem: (item?: Partial<GlassItem>) => void;
  updateGlassItem: (id: string, partial: Partial<GlassItem>) => void;
  removeGlassItem: (id: string) => void;
  // Consumables mutations
  updateConsumables: (partial: Partial<ConsumablesConfig>) => void;
  updateFoil: (partial: Partial<ConsumablesConfig['foil']>) => void;
  updateSolder: (partial: Partial<ConsumablesConfig['solder']>) => void;
  updateChemicals: (partial: Partial<ConsumablesConfig['chemicals']>) => void;
  updateReinforcement: (partial: Partial<ConsumablesConfig['reinforcement']>) => void;
  addCustomConsumable: (item: CustomConsumable) => void;
  updateCustomConsumable: (id: string, partial: Partial<CustomConsumable>) => void;
  removeCustomConsumable: (id: string) => void;
  // Labor mutations
  updateLaborConfig: (partial: Partial<LaborConfig>) => void;
  updateLaborStageHours: (id: LaborStageId, hours: number) => void;
  // Equipment mutations
  updateEquipmentItem: (id: string, partial: Partial<EquipmentItem>) => void;
  addEquipmentItem: (item: EquipmentItem) => void;
  removeEquipmentItem: (id: string) => void;
  // Electricity mutations
  updateElectricityConfig: (partial: Partial<ElectricityConfig>) => void;
  addCustomElectricalDevice: (device: { id: string; name: string; powerWatts: number; usageHours: number; enabled: boolean }) => void;
  updateCustomElectricalDevice: (id: string, partial: Partial<{ name: string; powerWatts: number; usageHours: number; enabled: boolean }>) => void;
  removeCustomElectricalDevice: (id: string) => void;
  // Margin & Risk mutations
  updateMarginRisk: (partial: Partial<MarginRiskConfig>) => void;
  // Metadata mutations
  updateMetadata: (partial: Partial<ProjectMetadata>) => void;
  // Project LifeCycle
  saveActiveProject: () => void;
  createNewProject: (fromTemplateId?: string) => void;
  loadProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  deleteProject: (id: string) => void;
  importProjectData: (project: VitralisProject) => void;
  triggerCelebration: () => void;
}

const ProjectContext = createContext<ProjectContextState | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { defaults } = useStudio();
  const [activeTab, setActiveTab] = useState<'calculator' | 'projects' | 'templates' | 'studio' | 'quote' | 'tools'>('calculator');

  const createInitialProject = useCallback((): VitralisProject => {
    const rawProject: VitralisProject = {
      metadata: {
        id: `proj-${Date.now()}`,
        title: 'Yeni Tiffany Vitray Eseri',
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        projectType: 'tiffany',
        dimensions: { widthCm: 30, heightCm: 40 },
        pieceCount: 24,
        difficulty: 'intermediate',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
        notes: '',
      },
      glassItems: SAMPLE_GLASS_ITEMS,
      consumables: {
        foil: {
          enabled: true,
          foilType: 'Black Backed',
          foilWidth: '7/32" (5.5mm)',
          lengthMeters: 8,
          rollPrice: defaults.defaultFoilPrice,
          rollLengthMeters: defaults.defaultFoilLengthMeters,
        },
        solder: {
          enabled: true,
          solderRatio: '60/40',
          weightGrams: 160,
          spoolPrice: defaults.defaultSolderPrice,
          spoolWeightGrams: defaults.defaultSolderSpoolGrams,
        },
        chemicals: {
          fluxCost: defaults.defaultFluxCost,
          patinaType: 'black',
          patinaCost: defaults.defaultPatinaCost,
          finishingPolishCost: defaults.defaultPolishCost,
          cleaningSolventCost: 20,
        },
        reinforcement: {
          zincCameMeters: 0,
          zincCamePricePerMeter: defaults.defaultZincCamePricePerMeter,
          brassRodsCost: 0,
          hangingHooksCount: 2,
          hangingHookPrice: defaults.defaultHangingHookPrice,
          chainMeters: 0.6,
          chainPricePerMeter: defaults.defaultChainPricePerMeter,
        },
        customConsumables: [],
      },
      labor: {
        hourlyRate: defaults.hourlyRate,
        stages: [
          { id: 'design', name: 'Tasarım & Şablon Çıkarma', hours: 1.0 },
          { id: 'cutting', name: 'Cam Kesme & Kırma', hours: 1.5 },
          { id: 'grinding', name: 'Kenar Taşlama & Alıştırma', hours: 1.2 },
          { id: 'foiling', name: 'Bakır Folyolama', hours: 1.0 },
          { id: 'soldering', name: 'Lehimleme & Halka Montajı', hours: 1.5 },
          { id: 'finishing', name: 'Patinaj, Yıkama & Cila', hours: 0.8 },
          { id: 'packaging', name: 'Koruyucu Paketleme', hours: 0.4 },
        ],
      },
      equipment: defaults.defaultEquipment,
      electricity: {
        unitRatePerKwh: defaults.electricityKwhRate,
        customElectricalEquipment: [],
      },
      marginRisk: {
        wasteRiskPercentage: defaults.defaultWasteRiskPercentage,
        wasteCalculationMode: 'glass_and_consumables',
        targetProfitMarginPercentage: defaults.defaultProfitMarginPercentage,
        vatTaxPercentage: defaults.defaultVatPercentage,
        discountPercentage: 0,
      },
      breakdown: EMPTY_COST_BREAKDOWN,
    };

    return recalculateEntireProject(rawProject);
  }, [defaults]);

  const [project, setProject] = useState<VitralisProject>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_PROJECT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return recalculateEntireProject(parsed);
      }
    } catch (e) {
      console.error('Failed to load active project:', e);
    }
    return createInitialProject();
  });

  const [savedProjects, setSavedProjects] = useState<VitralisProject[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_PROJECTS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load saved projects:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_PROJECT_KEY, JSON.stringify(project));
    } catch (e) {
      console.error('Failed to persist active project:', e);
    }
  }, [project]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify(savedProjects));
    } catch (e) {
      console.error('Failed to persist saved projects:', e);
    }
  }, [savedProjects]);

  const updateProjectState = useCallback((modifier: (prev: VitralisProject) => VitralisProject) => {
    setProject(prev => {
      const updated = modifier(prev);
      return recalculateEntireProject({
        ...updated,
        metadata: {
          ...updated.metadata,
          updatedAt: new Date().toISOString(),
        },
      });
    });
  }, []);

  const addGlassItem = (item?: Partial<GlassItem>) => {
    const newItem: GlassItem = {
      id: `glass-${Date.now()}`,
      name: item?.name || 'Yeni Renkli Vitray Camı',
      type: item?.type || 'Spectrum Opal',
      color: item?.color || 'Renkli',
      colorHex: item?.colorHex || '#6366f1',
      shape: item?.shape || 'rect',
      widthCm: item?.widthCm ?? 20,
      heightCm: item?.heightCm ?? 20,
      diameterCm: item?.diameterCm ?? 0,
      customAreaSqCm: item?.customAreaSqCm ?? 400,
      quantity: item?.quantity ?? 1,
      unitPrice: item?.unitPrice ?? 2800,
      priceUnit: item?.priceUnit || 'sqm',
      calculatedAreaSqM: 0.04,
      calculatedCost: 112,
      notes: item?.notes || '',
    };

    updateProjectState(prev => ({
      ...prev,
      glassItems: [...prev.glassItems, newItem],
    }));
  };

  const updateGlassItem = (id: string, partial: Partial<GlassItem>) => {
    updateProjectState(prev => ({
      ...prev,
      glassItems: prev.glassItems.map(item => (item.id === id ? { ...item, ...partial } : item)),
    }));
  };

  const removeGlassItem = (id: string) => {
    updateProjectState(prev => ({
      ...prev,
      glassItems: prev.glassItems.filter(item => item.id !== id),
    }));
  };

  const updateConsumables = (partial: Partial<ConsumablesConfig>) => {
    updateProjectState(prev => ({
      ...prev,
      consumables: { ...prev.consumables, ...partial },
    }));
  };

  const updateFoil = (partial: Partial<ConsumablesConfig['foil']>) => {
    updateProjectState(prev => ({
      ...prev,
      consumables: {
        ...prev.consumables,
        foil: { ...prev.consumables.foil, ...partial },
      },
    }));
  };

  const updateSolder = (partial: Partial<ConsumablesConfig['solder']>) => {
    updateProjectState(prev => ({
      ...prev,
      consumables: {
        ...prev.consumables,
        solder: { ...prev.consumables.solder, ...partial },
      },
    }));
  };

  const updateChemicals = (partial: Partial<ConsumablesConfig['chemicals']>) => {
    updateProjectState(prev => ({
      ...prev,
      consumables: {
        ...prev.consumables,
        chemicals: { ...prev.consumables.chemicals, ...partial },
      },
    }));
  };

  const updateReinforcement = (partial: Partial<ConsumablesConfig['reinforcement']>) => {
    updateProjectState(prev => ({
      ...prev,
      consumables: {
        ...prev.consumables,
        reinforcement: { ...prev.consumables.reinforcement, ...partial },
      },
    }));
  };

  const addCustomConsumable = (item: CustomConsumable) => {
    updateProjectState(prev => ({
      ...prev,
      consumables: {
        ...prev.consumables,
        customConsumables: [...(prev.consumables.customConsumables || []), item],
      },
    }));
  };

  const updateCustomConsumable = (id: string, partial: Partial<CustomConsumable>) => {
    updateProjectState(prev => ({
      ...prev,
      consumables: {
        ...prev.consumables,
        customConsumables: (prev.consumables.customConsumables || []).map(item =>
          item.id === id ? { ...item, ...partial } : item
        ),
      },
    }));
  };

  const removeCustomConsumable = (id: string) => {
    updateProjectState(prev => ({
      ...prev,
      consumables: {
        ...prev.consumables,
        customConsumables: (prev.consumables.customConsumables || []).filter(item => item.id !== id),
      },
    }));
  };

  const updateLaborConfig = (partial: Partial<LaborConfig>) => {
    updateProjectState(prev => ({
      ...prev,
      labor: { ...prev.labor, ...partial },
    }));
  };

  const updateLaborStageHours = (stageId: LaborStageId, hours: number) => {
    updateProjectState(prev => ({
      ...prev,
      labor: {
        ...prev.labor,
        stages: prev.labor.stages.map(stage => (stage.id === stageId ? { ...stage, hours } : stage)),
      },
    }));
  };

  const updateEquipmentItem = (id: string, partial: Partial<EquipmentItem>) => {
    updateProjectState(prev => ({
      ...prev,
      equipment: prev.equipment.map(item => (item.id === id ? { ...item, ...partial } : item)),
    }));
  };

  const addEquipmentItem = (item: EquipmentItem) => {
    updateProjectState(prev => ({
      ...prev,
      equipment: [...prev.equipment, item],
    }));
  };

  const removeEquipmentItem = (id: string) => {
    updateProjectState(prev => ({
      ...prev,
      equipment: prev.equipment.filter(item => item.id !== id),
    }));
  };

  const updateElectricityConfig = (partial: Partial<ElectricityConfig>) => {
    updateProjectState(prev => ({
      ...prev,
      electricity: { ...prev.electricity, ...partial },
    }));
  };

  const addCustomElectricalDevice = (device: {
    id: string;
    name: string;
    powerWatts: number;
    usageHours: number;
    enabled: boolean;
  }) => {
    updateProjectState(prev => ({
      ...prev,
      electricity: {
        ...prev.electricity,
        customElectricalEquipment: [...(prev.electricity.customElectricalEquipment || []), device],
      },
    }));
  };

  const updateCustomElectricalDevice = (
    id: string,
    partial: Partial<{ name: string; powerWatts: number; usageHours: number; enabled: boolean }>
  ) => {
    updateProjectState(prev => ({
      ...prev,
      electricity: {
        ...prev.electricity,
        customElectricalEquipment: (prev.electricity.customElectricalEquipment || []).map(d =>
          d.id === id ? { ...d, ...partial } : d
        ),
      },
    }));
  };

  const removeCustomElectricalDevice = (id: string) => {
    updateProjectState(prev => ({
      ...prev,
      electricity: {
        ...prev.electricity,
        customElectricalEquipment: (prev.electricity.customElectricalEquipment || []).filter(d => d.id !== id),
      },
    }));
  };

  const updateMarginRisk = (partial: Partial<MarginRiskConfig>) => {
    updateProjectState(prev => ({
      ...prev,
      marginRisk: { ...prev.marginRisk, ...partial },
    }));
  };

  const updateMetadata = (partial: Partial<ProjectMetadata>) => {
    updateProjectState(prev => ({
      ...prev,
      metadata: { ...prev.metadata, ...partial },
    }));
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#f43f5e', '#fbbf24', '#38bdf8', '#34d399', '#c084fc'],
      });
    } catch {
      // ignore
    }
  };

  const saveActiveProject = () => {
    const calculated = recalculateEntireProject({
      ...project,
      metadata: {
        ...project.metadata,
        updatedAt: new Date().toISOString(),
      },
    });

    setSavedProjects(prev => {
      const existsIndex = prev.findIndex(p => p.metadata.id === calculated.metadata.id);
      if (existsIndex >= 0) {
        const next = [...prev];
        next[existsIndex] = calculated;
        return next;
      }
      return [calculated, ...prev];
    });

    setProject(calculated);
    triggerCelebration();
  };

  const createNewProject = (fromTemplateId?: string) => {
    if (fromTemplateId) {
      const tpl = PROJECT_TEMPLATES.find(t => t.id === fromTemplateId);
      if (tpl) {
        const fresh: VitralisProject = {
          ...tpl.templateData,
          metadata: {
            ...tpl.templateData.metadata,
            id: `proj-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
        const calculated = recalculateEntireProject(fresh);
        setProject(calculated);
        setActiveTab('calculator');
        return;
      }
    }
    const fresh = createInitialProject();
    setProject(fresh);
    setActiveTab('calculator');
  };

  const loadProject = (id: string) => {
    const found = savedProjects.find(p => p.metadata.id === id);
    if (found) {
      setProject(recalculateEntireProject(found));
      setActiveTab('calculator');
    }
  };

  const duplicateProject = (id: string) => {
    const found = savedProjects.find(p => p.metadata.id === id);
    if (found) {
      const duplicated: VitralisProject = {
        ...found,
        metadata: {
          ...found.metadata,
          id: `proj-${Date.now()}`,
          title: `${found.metadata.title} (Kopya)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
      const calculated = recalculateEntireProject(duplicated);
      setSavedProjects(prev => [calculated, ...prev]);
      setProject(calculated);
      setActiveTab('calculator');
    }
  };

  const deleteProject = (id: string) => {
    setSavedProjects(prev => prev.filter(p => p.metadata.id !== id));
  };

  const importProjectData = (imported: VitralisProject) => {
    if (!imported || !imported.metadata) return;
    const validated: VitralisProject = {
      ...imported,
      metadata: {
        ...imported.metadata,
        id: `proj-${Date.now()}`,
        updatedAt: new Date().toISOString(),
      },
    };
    const calculated = recalculateEntireProject(validated);
    setSavedProjects(prev => [calculated, ...prev]);
    setProject(calculated);
    setActiveTab('calculator');
    triggerCelebration();
  };

  return (
    <ProjectContext.Provider
      value={{
        project,
        savedProjects,
        activeTab,
        setActiveTab,
        addGlassItem,
        updateGlassItem,
        removeGlassItem,
        updateConsumables,
        updateFoil,
        updateSolder,
        updateChemicals,
        updateReinforcement,
        addCustomConsumable,
        updateCustomConsumable,
        removeCustomConsumable,
        updateLaborConfig,
        updateLaborStageHours,
        updateEquipmentItem,
        addEquipmentItem,
        removeEquipmentItem,
        updateElectricityConfig,
        addCustomElectricalDevice,
        updateCustomElectricalDevice,
        removeCustomElectricalDevice,
        updateMarginRisk,
        updateMetadata,
        saveActiveProject,
        createNewProject,
        loadProject,
        duplicateProject,
        deleteProject,
        importProjectData,
        triggerCelebration,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextState => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
