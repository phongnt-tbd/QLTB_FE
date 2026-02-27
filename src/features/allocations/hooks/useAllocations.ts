import { useState, useMemo } from 'react';
import { Asset, Department, User } from '@/types';
import { allocationService } from '../services/allocationService';
import { FileUploadState } from '../types';

export const useAllocations = (
  assets: Asset[],
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>,
  departments: Department[],
  user: User
) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [deptSearchTerm, setDeptSearchTerm] = useState('');
  const [assetSearchTerm, setAssetSearchTerm] = useState('');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [isRecoverModalOpen, setIsRecoverModalOpen] = useState(false);

  const [fileUpload, setFileUpload] = useState<FileUploadState>({
    fileName: null,
    fileData: null,
    isProcessing: false,
  });

  const allItems = useMemo(
    () => allocationService.getAllItems(assets),
    [assets]
  );

  const deptStats = useMemo(
    () => allocationService.getDepartmentStats(departments, allItems, deptSearchTerm),
    [departments, allItems, deptSearchTerm]
  );

  const deptAssets = useMemo(
    () => allocationService.getDepartmentAssets(allItems, selectedDeptId),
    [selectedDeptId, allItems]
  );

  const stockAssets = useMemo(
    () => allocationService.getStockAssets(allItems),
    [allItems]
  );

  const filteredDeptAssets = useMemo(
    () => allocationService.filterDepartmentAssets(deptAssets, assetSearchTerm),
    [deptAssets, assetSearchTerm]
  );

  const handleToggleSelect = (id: string) => {
    setSelectedAssetIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAllocate = () => {
    if (selectedAssetIds.length === 0 || !selectedDeptId) return;
    if (fileUpload.isProcessing) {
      alert('Vui lòng đợi xử lý tài liệu PDF.');
      return;
    }

    const deptName = departments.find(d => d.id === selectedDeptId)?.name || '';
    const updated = allocationService.allocateAssets(
      assets,
      selectedAssetIds,
      selectedDeptId,
      deptName,
      user,
      fileUpload.fileData || undefined
    );

    setAssets(updated);
    setIsAllocateModalOpen(false);
    setSelectedAssetIds([]);
    setFileUpload({ fileName: null, fileData: null, isProcessing: false });
  };

  const handleRecover = () => {
    const updated = allocationService.recoverAssets(assets, selectedAssetIds, user);
    setAssets(updated);
    setIsRecoverModalOpen(false);
    setSelectedAssetIds([]);
  };

  const handleFileUpload = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Chỉ hỗ trợ file PDF.');
      return;
    }

    setFileUpload(prev => ({ ...prev, fileName: file.name, isProcessing: true }));

    const reader = new FileReader();
    reader.onload = re => {
      setFileUpload({
        fileName: file.name,
        fileData: re.target?.result as string,
        isProcessing: false,
      });
    };
    reader.onerror = () => {
      alert('Lỗi đọc file.');
      setFileUpload({ fileName: null, fileData: null, isProcessing: false });
    };
    reader.readAsDataURL(file);
  };

  return {
    // State
    selectedDeptId,
    setSelectedDeptId,
    deptSearchTerm,
    setDeptSearchTerm,
    assetSearchTerm,
    setAssetSearchTerm,
    selectedAssetIds,
    setSelectedAssetIds,
    isAllocateModalOpen,
    setIsAllocateModalOpen,
    isRecoverModalOpen,
    setIsRecoverModalOpen,
    fileUpload,

    // Data
    deptStats,
    deptAssets: filteredDeptAssets,
    stockAssets,

    // Actions
    handleToggleSelect,
    handleAllocate,
    handleRecover,
    handleFileUpload,
  };
};
