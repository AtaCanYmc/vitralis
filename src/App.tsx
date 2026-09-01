import React, { useState, useEffect } from 'react';
import { StudioProvider } from './context/StudioContext';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Header } from './components/common/Header';
import { TabNavigation } from './components/common/TabNavigation';
import { QuickCostSummary } from './components/common/QuickCostSummary';
import { GlassSection } from './components/calculator/GlassSection';
import { ConsumablesSection } from './components/calculator/ConsumablesSection';
import { LaborSection } from './components/calculator/LaborSection';
import { EquipmentSection } from './components/calculator/EquipmentSection';
import { ElectricitySection } from './components/calculator/ElectricitySection';
import { MarginWasteSection } from './components/calculator/MarginWasteSection';
import { CostBreakdownChart } from './components/calculator/CostBreakdownChart';
import { ProjectManager } from './components/projects/ProjectManager';
import { TemplateSelector } from './components/projects/TemplateSelector';
import { PrintableQuote } from './components/quote/PrintableQuote';
import { StudioSettings } from './components/studio/StudioSettings';
import { ArtisanToolsModal } from './components/tools/ArtisanToolsModal';
import { PWAInstallBanner } from './components/pwa/PWAInstallBanner';
import {
  ChevronDown,
  ChevronUp,
  Layers,
  Package,
  Clock,
  Wrench,
  Zap,
  TrendingUp,
  PieChart,
} from 'lucide-react';

type SectionKey = 'glass' | 'consumables' | 'labor' | 'equipment' | 'electricity' | 'margin' | 'chart';

const ALL_SECTIONS: SectionKey[] = ['glass', 'consumables', 'labor', 'equipment', 'electricity', 'margin', 'chart'];

const MainContent: React.FC = () => {
  const { activeTab } = useProject();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Accordion State: By default all sections are open, user can collapse/expand individually or together
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    glass: true,
    consumables: true,
    labor: true,
    equipment: true,
    electricity: true,
    margin: true,
    chart: true,
  });

  const toggleSection = (key: SectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const expandAll = () => {
    const next: Record<SectionKey, boolean> = {} as any;
    ALL_SECTIONS.forEach(k => (next[k] = true));
    setExpandedSections(next);
  };

  const collapseAll = () => {
    const next: Record<SectionKey, boolean> = {} as any;
    ALL_SECTIONS.forEach(k => (next[k] = false));
    setExpandedSections(next);
  };

  const allExpanded = ALL_SECTIONS.every(k => expandedSections[k]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const quickJumpItems: Array<{ key: SectionKey; label: string; icon: React.ReactNode }> = [
    { key: 'glass', label: 'Camlar', icon: <Layers className="w-3 h-3" /> },
    { key: 'consumables', label: 'Sarf', icon: <Package className="w-3 h-3" /> },
    { key: 'labor', label: 'İşçilik', icon: <Clock className="w-3 h-3" /> },
    { key: 'equipment', label: 'Ekipman', icon: <Wrench className="w-3 h-3" /> },
    { key: 'electricity', label: 'Elektrik', icon: <Zap className="w-3 h-3" /> },
    { key: 'margin', label: 'Kar & Fire', icon: <TrendingUp className="w-3 h-3" /> },
    { key: 'chart', label: 'Grafik', icon: <PieChart className="w-3 h-3" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      
      {/* App Header */}
      <Header
        onOpenTools={() => setIsToolsOpen(true)}
        deferredPrompt={deferredPrompt}
        onInstallPwa={handleInstallPwa}
        isInstallable={isInstallable}
      />

      {/* Main Tab Navigation */}
      <TabNavigation />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        {activeTab === 'calculator' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Top Quick Live Calculation Summary Card */}
            <QuickCostSummary />

            {/* Accordion Quick Control Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              
              {/* Quick Jump / Toggle Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {quickJumpItems.map(item => {
                  const isOpen = expandedSections[item.key];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleSection(item.key)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        isOpen
                          ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                          : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                      title={isOpen ? 'Bölümü Daralt' : 'Bölümü Genişlet'}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Expand / Collapse All Buttons */}
              <div className="flex items-center justify-end gap-2 shrink-0 border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                <button
                  onClick={allExpanded ? collapseAll : expandAll}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
                >
                  {allExpanded ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Tümünü Daralt</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Tümünü Genişlet</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* 1. Glass Section (Accordion) */}
            <GlassSection
              isExpanded={expandedSections.glass}
              onToggle={() => toggleSection('glass')}
            />

            {/* 2. Consumables Section (Accordion) */}
            <ConsumablesSection
              isExpanded={expandedSections.consumables}
              onToggle={() => toggleSection('consumables')}
            />

            {/* 3. Labor Section (Accordion) */}
            <LaborSection
              isExpanded={expandedSections.labor}
              onToggle={() => toggleSection('labor')}
            />

            {/* 4. Equipment Depreciation Section (Accordion) */}
            <EquipmentSection
              isExpanded={expandedSections.equipment}
              onToggle={() => toggleSection('equipment')}
            />

            {/* 5. Electricity Consumption Section (Accordion) */}
            <ElectricitySection
              isExpanded={expandedSections.electricity}
              onToggle={() => toggleSection('electricity')}
            />

            {/* 6. Waste, Risk, Profit Margin & Tax Section (Accordion) */}
            <MarginWasteSection
              isExpanded={expandedSections.margin}
              onToggle={() => toggleSection('margin')}
            />

            {/* 7. Cost Breakdown & Visual Analytics Chart (Accordion) */}
            <CostBreakdownChart
              isExpanded={expandedSections.chart}
              onToggle={() => toggleSection('chart')}
            />
          </div>
        )}

        {activeTab === 'quote' && (
          <div className="animate-in fade-in duration-300">
            <PrintableQuote />
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="animate-in fade-in duration-300">
            <ProjectManager />
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="animate-in fade-in duration-300">
            <TemplateSelector />
          </div>
        )}

        {activeTab === 'studio' && (
          <div className="animate-in fade-in duration-300">
            <StudioSettings />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Vitralis - Cam Vitray & Tiffany Atölye Maliyet Sistemi</p>
          <p className="flex items-center gap-1">
            <span>Designed for Stained Glass Artisans</span>
            <span>•</span>
            <span className="text-indigo-400 font-semibold">PWA Offline Enabled</span>
          </p>
        </div>
      </footer>

      {/* Artisan Workshop Tools Modal */}
      <ArtisanToolsModal isOpen={isToolsOpen} onClose={() => setIsToolsOpen(false)} />

      {/* PWA Install Notification / Offline Banner */}
      <PWAInstallBanner
        deferredPrompt={deferredPrompt}
        onInstall={handleInstallPwa}
        isInstallable={isInstallable}
      />

    </div>
  );
};

export default function App() {
  return (
    <StudioProvider>
      <ProjectProvider>
        <MainContent />
      </ProjectProvider>
    </StudioProvider>
  );
}
