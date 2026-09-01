import React, { useState } from 'react';
import {
  Flame,
  Layers,
  Circle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { NumberInput } from '../common/NumberInput';
import { useProject } from '../../context/ProjectContext';
import { useStudio } from '../../context/StudioContext';
import { ArtisanEstimators } from '../../utils/calculations';
import { formatWeight } from '../../utils/formatters';
import { getTranslation } from '../../i18n';

interface ArtisanToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArtisanToolsModal: React.FC<ArtisanToolsModalProps> = ({ isOpen, onClose }) => {
  const { project, updateFoil, updateSolder, addGlassItem } = useProject();
  const { defaults } = useStudio();
  const t = getTranslation(defaults.language);

  // 1. Solder Estimator State
  const [toolFoilMeters, setToolFoilMeters] = useState<number>(project.consumables.foil.lengthMeters || 10);
  const [beadProfile, setBeadProfile] = useState<'flat' | 'rounded' | 'high_dome'>('rounded');
  const estimatedSolderGrams = ArtisanEstimators.estimateSolderFromFoil(toolFoilMeters, beadProfile);

  // 2. Foil Estimator State
  const [pieceCount, setPieceCount] = useState<number>(project.metadata.pieceCount || 24);
  const [avgPerimeterCm, setAvgPerimeterCm] = useState<number>(22);
  const estimatedFoilMeters = ArtisanEstimators.estimateFoilFromPieces(pieceCount, avgPerimeterCm);

  // 3. Circle Area Calculator State
  const [circleDiameterCm, setCircleDiameterCm] = useState<number>(20);
  const circleRadiusCm = circleDiameterCm / 2;
  const circleAreaSqCm = Math.PI * circleRadiusCm * circleRadiusCm;
  const circleAreaSqM = circleAreaSqCm / 10000;

  const [appliedSolder, setAppliedSolder] = useState(false);

  const handleApplySolder = () => {
    updateFoil({ lengthMeters: toolFoilMeters });
    updateSolder({ weightGrams: estimatedSolderGrams });
    setAppliedSolder(true);
    setTimeout(() => {
      setAppliedSolder(false);
      onClose();
    }, 1200);
  };

  const handleAddCircleGlass = () => {
    addGlassItem({
      name: `Dairesel Vitray Camı (Ø${circleDiameterCm}cm)`,
      shape: 'circle',
      diameterCm: circleDiameterCm,
      quantity: 1,
      unitPrice: 2800,
      priceUnit: 'sqm',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.toolsModal.title}
      subtitle="Vitray ustaları için pratik malzeme ve alan hesaplayıcıları"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        
        {/* 1. Solder Estimator Card */}
        <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4.5 space-y-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="font-bold text-sm text-slate-100">{t.toolsModal.solderEstimator}</h4>
              <p className="text-xs text-slate-400">{t.toolsModal.solderEstimatorDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <NumberInput
              label={t.toolsModal.foilLength}
              value={toolFoilMeters}
              onChange={val => setToolFoilMeters(val)}
              min={0.1}
              step={1}
              suffix="m"
            />

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                {t.toolsModal.beadProfile}
              </label>
              <select
                value={beadProfile}
                onChange={e => setBeadProfile(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="flat">{t.toolsModal.beadFlat}</option>
                <option value="rounded">{t.toolsModal.beadRounded}</option>
                <option value="high_dome">{t.toolsModal.beadHighDome}</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-400 block">{t.toolsModal.estimatedSolder}</span>
              <span className="text-xl font-black text-amber-400 font-mono">
                {formatWeight(estimatedSolderGrams)}
              </span>
              <span className="text-[10px] text-slate-500 block">
                (~{(estimatedSolderGrams / toolFoilMeters).toFixed(1)}g / metre lehim katsayısı)
              </span>
            </div>

            <button
              onClick={handleApplySolder}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                appliedSolder
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-950/40'
              }`}
            >
              {appliedSolder ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aktarıldı!</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>{t.toolsModal.applyToProject}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. Foil Estimator Card */}
        <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4.5 space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <div>
              <h4 className="font-bold text-sm text-slate-100">{t.toolsModal.foilEstimator}</h4>
              <p className="text-xs text-slate-400">{t.toolsModal.foilEstimatorDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <NumberInput
              label={t.toolsModal.pieceCount}
              value={pieceCount}
              onChange={val => setPieceCount(val)}
              min={1}
              step={1}
            />

            <NumberInput
              label={t.toolsModal.avgPerimeter}
              value={avgPerimeterCm}
              onChange={val => setAvgPerimeterCm(val)}
              min={5}
              step={1}
              suffix="cm"
            />
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">{t.toolsModal.estimatedFoil}</span>
              <span className="text-xl font-black text-indigo-300 font-mono">
                {estimatedFoilMeters} Metre
              </span>
            </div>
            <button
              onClick={() => {
                setToolFoilMeters(estimatedFoilMeters);
                updateFoil({ lengthMeters: estimatedFoilMeters });
              }}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
            >
              Folyoya Yaz
            </button>
          </div>
        </div>

        {/* 3. Circle Glass Area Calculator */}
        <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4.5 space-y-3">
          <div className="flex items-center gap-2">
            <Circle className="w-5 h-5 text-sky-400" />
            <div>
              <h4 className="font-bold text-sm text-slate-100">{t.toolsModal.circleAreaCalc}</h4>
              <p className="text-xs text-slate-400">Daire veya madalyon camların alanını hesaplayıp projeye ekleyin</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 items-center">
            <NumberInput
              label={t.toolsModal.diameterInput}
              value={circleDiameterCm}
              onChange={val => setCircleDiameterCm(val)}
              min={1}
              step={1}
              suffix="cm"
            />

            <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/20 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">{t.toolsModal.circleAreaResult}</span>
                <span className="text-sm font-bold text-sky-300 font-mono">
                  {circleAreaSqCm.toFixed(1)} cm² ({circleAreaSqM.toFixed(4)} m²)
                </span>
              </div>
              <button
                onClick={handleAddCircleGlass}
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all"
              >
                Cam Ekle
              </button>
            </div>
          </div>
        </div>

      </div>
    </Modal>
  );
};
