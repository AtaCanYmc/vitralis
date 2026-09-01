import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  Plus,
  Copy,
  Trash2,
  FileDown,
  Upload,
  Clock,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useStudio } from '../../context/StudioContext';
import { GlassCard } from '../common/GlassCard';
import { formatCurrency, formatHours } from '../../utils/formatters';
import { exportProjectToJson } from '../../utils/exportUtils';
import { getTranslation } from '../../i18n';
import type { ProjectStatus } from '../../types/project';

export const ProjectManager: React.FC = () => {
  const {
    savedProjects,
    loadProject,
    duplicateProject,
    deleteProject,
    createNewProject,
    importProjectData,
  } = useProject();
  const { activeCurrency, defaults } = useStudio();
  const t = getTranslation(defaults.language);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = savedProjects.filter(p => {
    const matchesSearch =
      p.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.metadata.clientName && p.metadata.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.metadata.notes && p.metadata.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || p.metadata.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const json = JSON.parse(event.target?.result as string);
        importProjectData(json);
      } catch (err) {
        alert('Geçersiz Vitralis JSON yedek dosyası!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const statusColors: Record<ProjectStatus, string> = {
    draft: 'bg-slate-800 text-slate-300 border-slate-700',
    quoted: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    approved: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    in_progress: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  };

  return (
    <div className="space-y-5">
      <GlassCard
        title={t.projects.title}
        subtitle="Atölyenizde kaydedilen tüm vitray projeleri ve müşteri teklifleri"
        icon={<FolderKanban className="w-5 h-5" />}
        glowColor="indigo"
        headerAction={
          <div className="flex items-center gap-2">
            {/* JSON Import Button */}
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.projects.importJson}</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Create New Project Button */}
            <button
              onClick={() => createNewProject()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/40 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.projects.createNew}</span>
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.projects.search}
                className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {['all', 'draft', 'quoted', 'approved', 'in_progress', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    statusFilter === status
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-950/50'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {status === 'all' ? 'Tümü' : t.projects.status[status as ProjectStatus]}
                </button>
              ))}
            </div>
          </div>

          {/* Project List / Cards */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-950/30">
              <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-300 font-bold text-sm">{t.projects.emptyList}</p>
              <p className="text-slate-500 text-xs mt-1">
                Hesaplama ekranında projenizi düzenleyip sağ üstteki "Kaydet" butonuna basarak buraya ekleyebilirsiniz.
              </p>
              <button
                onClick={() => createNewProject()}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
              >
                {t.projects.createNew}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map(proj => {
                const meta = proj.metadata;
                const b = proj.breakdown;

                return (
                  <div
                    key={meta.id}
                    className="rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 p-4.5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-indigo-950/20 group"
                  >
                    <div>
                      {/* Status & Date */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            statusColors[meta.status || 'draft']
                          }`}
                        >
                          {t.projects.status[meta.status || 'draft']}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(meta.updatedAt || meta.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>

                      {/* Title & Client */}
                      <h4 className="font-bold text-slate-100 text-sm group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {meta.title || 'İsimsiz Vitray Projesi'}
                      </h4>
                      {meta.clientName && (
                        <p className="text-xs text-slate-400 mt-0.5">👤 {meta.clientName}</p>
                      )}

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{meta.pieceCount || 0} Parça</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{formatHours(b.totalLaborHours || 0)}</span>
                        </div>
                      </div>

                      {/* Price Tag */}
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-medium">Satış Fiyatı:</span>
                        <span className="text-sm font-black text-amber-400 font-mono">
                          {formatCurrency(b.finalSellingPrice || 0, activeCurrency)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/80">
                      <button
                        onClick={() => loadProject(meta.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{t.projects.load}</span>
                      </button>

                      <button
                        onClick={() => duplicateProject(meta.id)}
                        className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all"
                        title={t.projects.duplicate}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => exportProjectToJson(proj)}
                        className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all"
                        title={t.projects.exportJson}
                      >
                        <FileDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(t.projects.confirmDelete)) {
                            deleteProject(meta.id);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 border border-slate-800 transition-all"
                        title={t.projects.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </GlassCard>
    </div>
  );
};
