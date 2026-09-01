import React from 'react';
import {
  LayoutTemplate,
  Sun,
  Lamp,
  Grid,
  Box,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useStudio } from '../../context/StudioContext';
import { PROJECT_TEMPLATES } from '../../constants/templates';
import { GlassCard } from '../common/GlassCard';
import { getTranslation } from '../../i18n';

export const TemplateSelector: React.FC = () => {
  const { createNewProject } = useProject();
  const { defaults } = useStudio();
  const t = getTranslation(defaults.language);
  const isTr = defaults.language === 'tr';

  const categoryIcons = {
    suncatcher: <Sun className="w-5 h-5 text-amber-500" />,
    lamp: <Lamp className="w-5 h-5 text-purple-500" />,
    panel: <Grid className="w-5 h-5 text-sky-500" />,
    terrarium: <Box className="w-5 h-5 text-emerald-500" />,
    mirror: <Sparkles className="w-5 h-5 text-rose-500" />,
  };

  return (
    <GlassCard
      title={t.templates.title}
      subtitle={t.templates.subtitle}
      icon={<LayoutTemplate className="w-5 h-5" />}
      glowColor="purple"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROJECT_TEMPLATES.map(tpl => {
          return (
            <div
              key={tpl.id}
              className="rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500/40 p-5 flex flex-col justify-between transition-all hover:shadow-lg dark:hover:shadow-purple-950/20 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      {categoryIcons[tpl.category] || <Sparkles className="w-5 h-5 text-indigo-500" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                        {isTr ? tpl.nameTr : tpl.nameEn}
                      </h4>
                      <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                        {tpl.badge}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isTr ? tpl.descriptionTr : tpl.descriptionEn}
                </p>

                {/* Pre-configured Highlights */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono">
                    Ölçü: {tpl.templateData.metadata.dimensions.widthCm}×{tpl.templateData.metadata.dimensions.heightCm} cm
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono">
                    {tpl.templateData.glassItems.length} Çeşit Cam
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono">
                    Zorluk: {tpl.templateData.metadata.difficulty}
                  </span>
                </div>
              </div>

              <button
                onClick={() => createNewProject(tpl.id)}
                className="tactile-btn mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-950/30 transition-all"
              >
                <span>{t.templates.useTemplate}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
