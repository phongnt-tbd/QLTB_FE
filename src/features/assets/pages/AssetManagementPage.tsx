import React, { useState } from 'react';
import { Asset, Department, Supplier, AssetCategory } from '@/types';
import { AssetStatsCards } from '../components/AssetStatsCards';
import { AssetFilters } from '../components/AssetFilters';
import { AssetActionBar } from '../components/AssetActionBar';
import { AssetTable } from '../components/AssetTable';
import { ImportAssetModal } from '../components/modals/ImportAssetModal';
import { DamageReportModal } from '../components/modals/DamageReportModal';
import { RetireModal } from '../components/modals/RetireModal';
import { MaintenanceModal } from '../components/modals/MaintenanceModal';
import { useAssetFilters } from '../hooks/useAssetFilters';
import { useAssetSelection } from '../hooks/useAssetSelection';
import { useAssetActions } from '../hooks/useAssetActions';
import { assetService } from '../services/assetService';
import { CreateAssetDTO } from '../types';

interface AssetManagementPageProps {
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  departments: Department[];
  suppliers: Supplier[];
  categories: AssetCategory[];
}

export const AssetManagementPage: React.FC<AssetManagementPageProps> = ({
  assets,
  setAssets,
  departments,
  suppliers,
  categories,
}) => {
  // Modals state
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [isAllocateModalOpen, setAllocateModalOpen] = useState(false);
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [isRecoverModalOpen, setRecoverModalOpen] = useState(false);
  const [isRetireModalOpen, setRetireModalOpen] = useState(false);
  const [isDamageReportModalOpen, setDamageReportModalOpen] = useState(false);

  // Custom hooks
  const { filters, filteredItems, stats, updateSearch, updateStatusFilter, updateCategoryFilter } =
    useAssetFilters(assets);

  const {
    selectedIds,
    selectedItems,
    canBulkAllocate,
    canBulkRecover,
    canBulkMaintain,
    canBulkRetire,
    canBulkReportDamage,
    canBulkTransfer,
    toggleSelect,
    selectAll,
    deselectAll,
    selectSingle,
  } = useAssetSelection(filteredItems);

  const {
    allocateAssets,
    recoverAssets,
    transferAssets,
    sendToMaintenance,
    retireAssets,
    reportDamage,
  } = useAssetActions(assets, setAssets);

  // Handlers
  const handleImportAsset = (dto: CreateAssetDTO) => {
    const newAsset = assetService.createAsset(dto);
    setAssets((prev) => [newAsset, ...prev]);
    setImportModalOpen(false);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      selectAll();
    } else {
      deselectAll();
    }
  };

  const handleActionClick = (
    id: string,
    action: 'allocate' | 'recover' | 'transfer' | 'maintenance' | 'retire' | 'damage'
  ) => {
    selectSingle(id);

    switch (action) {
      case 'allocate':
        setAllocateModalOpen(true);
        break;
      case 'recover':
        setRecoverModalOpen(true);
        break;
      case 'transfer':
        setTransferModalOpen(true);
        break;
      case 'maintenance':
        setMaintenanceModalOpen(true);
        break;
      case 'retire':
        setRetireModalOpen(true);
        break;
      case 'damage':
        setDamageReportModalOpen(true);
        break;
    }
  };

  const handleRecoverConfirm = () => {
    recoverAssets(selectedIds);
    deselectAll();
    setRecoverModalOpen(false);
  };

  const handleDamageReport = (dto: any) => {
    reportDamage(dto);
    deselectAll();
  };

  const handleRetire = (dto: any) => {
    retireAssets(dto);
    deselectAll();
  };

  const handleMaintenance = (dto: any) => {
    sendToMaintenance(dto);
    deselectAll();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <AssetStatsCards stats={stats} />

      {/* Action Bar with Filters */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200">
        <AssetFilters
          search={filters.search}
          statusFilter={filters.statusFilter}
          categoryFilter={filters.categoryFilter}
          categories={categories}
          onSearchChange={updateSearch}
          onStatusFilterChange={updateStatusFilter}
          onCategoryFilterChange={updateCategoryFilter}
        />
      </div>

      {/* Bulk Actions */}
      <AssetActionBar
        selectedCount={selectedIds.length}
        canBulkReportDamage={canBulkReportDamage}
        canBulkAllocate={canBulkAllocate}
        canBulkRecover={canBulkRecover}
        canBulkTransfer={canBulkTransfer}
        canBulkMaintain={canBulkMaintain}
        canBulkRetire={canBulkRetire}
        onReportDamage={() => setDamageReportModalOpen(true)}
        onAllocate={() => setAllocateModalOpen(true)}
        onRecover={() => setRecoverModalOpen(true)}
        onTransfer={() => setTransferModalOpen(true)}
        onMaintenance={() => setMaintenanceModalOpen(true)}
        onRetire={() => setRetireModalOpen(true)}
        onImport={() => setImportModalOpen(true)}
      />

      {/* Assets Table */}
      <AssetTable
        items={filteredItems}
        selectedIds={selectedIds}
        departments={departments}
        categories={categories}
        onToggleSelect={toggleSelect}
        onSelectAll={handleSelectAll}
        onActionClick={handleActionClick}
      />

      {/* Modals */}
      <ImportAssetModal
        isOpen={isImportModalOpen}
        categories={categories}
        suppliers={suppliers}
        onClose={() => setImportModalOpen(false)}
        onSubmit={handleImportAsset}
      />

      <DamageReportModal
        isOpen={isDamageReportModalOpen}
        selectedIds={selectedIds}
        onClose={() => setDamageReportModalOpen(false)}
        onSubmit={handleDamageReport}
      />

      <RetireModal
        isOpen={isRetireModalOpen}
        selectedIds={selectedIds}
        onClose={() => setRetireModalOpen(false)}
        onSubmit={handleRetire}
      />

      <MaintenanceModal
        isOpen={isMaintenanceModalOpen}
        selectedIds={selectedIds}
        selectedItems={selectedItems}
        onClose={() => setMaintenanceModalOpen(false)}
        onSubmit={handleMaintenance}
      />

      {/* Recover Modal */}
      {isRecoverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-sm shadow-2xl p-10 space-y-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-slate-50 text-slate-800 rounded-3xl flex items-center justify-center mx-auto text-2xl shadow-inner">
              <i className="fas fa-undo"></i>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Thu hồi tài sản</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium">
                Xác nhận thu hồi {selectedIds.length} tài sản về kho trung tâm?
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRecoverConfirm}
                className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-900/20 uppercase text-xs tracking-widest"
              >
                Xác nhận thu hồi
              </button>
              <button
                onClick={() => setRecoverModalOpen(false)}
                className="w-full py-4 text-slate-400 font-black rounded-2xl hover:bg-slate-50 uppercase text-xs tracking-widest"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TODO: Implement Allocate and Transfer modals */}
    </div>
  );
};
