
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Asset, Department, Supplier, AssetItem, AssetItemStatus, UserRole, LifecycleEvent, AssetCategory } from '@/types';

interface AssetManagementProps {
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  departments: Department[];
  suppliers: Supplier[];
  categories: AssetCategory[];
}

interface IndividualMaintData {
  reason: string;
  cost: number;
}

const AssetManagement: React.FC<AssetManagementProps> = ({ assets, setAssets, departments, suppliers, categories }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const allocFileInputRef = useRef<HTMLInputElement>(null);
  const retireFileInputRef = useRef<HTMLInputElement>(null);
  
  // State cho file nhập kho
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileData, setSelectedFileData] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // State cho file cấp phát
  const [allocFileName, setAllocFileName] = useState<string | null>(null);
  const [allocFileData, setAllocFileData] = useState<string | null>(null);
  const [isProcessingAllocFile, setIsProcessingAllocFile] = useState(false);

  // State cho file thanh lý
  const [retireFileName, setRetireFileName] = useState<string | null>(null);
  const [retireFileData, setRetireFileData] = useState<string | null>(null);
  const [isProcessingRetireFile, setIsProcessingRetireFile] = useState(false);

  // Modals state
  const [isAllocateModalOpen, setAllocateModalOpen] = useState(false);
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [isRecoverModalOpen, setRecoverModalOpen] = useState(false);
  const [isRetireModalOpen, setRetireModalOpen] = useState(false);
  const [isDamageReportModalOpen, setDamageReportModalOpen] = useState(false);

  // State cho dữ liệu sửa chữa chi tiết
  const [maintProvider, setMaintProvider] = useState('');
  const [individualMaintData, setIndividualMaintData] = useState<Record<string, IndividualMaintData>>({});

  // Làm phẳng dữ liệu thành danh sách tài sản độc lập
  const allItems = useMemo(() => {
    return assets.flatMap(batch => 
      batch.items.map(item => ({
        ...item,
        parentBatch: batch
      }))
    );
  }, [assets]);

  const filteredItems = allItems.filter(item => {
    const matchesSearch = 
      item.assetCode.toLowerCase().includes(search.toLowerCase()) ||
      item.parentBatch.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || item.parentBatch.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const selectedItems = useMemo(() => {
    return allItems.filter(item => selectedIds.includes(item.id));
  }, [allItems, selectedIds]);

  // Khởi tạo dữ liệu sửa chữa khi modal mở
  useEffect(() => {
    if (isMaintenanceModalOpen) {
      const initialData: Record<string, IndividualMaintData> = {};
      selectedItems.forEach(item => {
        initialData[item.id] = { reason: '', cost: 0 };
      });
      setIndividualMaintData(initialData);
      setMaintProvider('');
    }
  }, [isMaintenanceModalOpen, selectedItems]);

  const canBulkAllocate = selectedItems.length > 0 && selectedItems.every(i => i.status === AssetItemStatus.IN_STOCK);
  const canBulkRecover = selectedItems.length > 0 && selectedItems.every(i => i.status === AssetItemStatus.ALLOCATED);
  const canBulkMaintain = selectedItems.length > 0 && selectedItems.every(i => i.status !== AssetItemStatus.MAINTENANCE && i.status !== AssetItemStatus.RETIRED);
  const canBulkRetire = selectedItems.length > 0 && selectedItems.every(i => i.status !== AssetItemStatus.RETIRED && i.status !== AssetItemStatus.MAINTENANCE);
  
  // Chỉ cho phép báo hỏng khi tài sản đang ở trạng thái Đang sử dụng HOẶC Trong kho
  const canBulkReportDamage = selectedItems.length > 0 && selectedItems.every(i => 
    i.status === AssetItemStatus.ALLOCATED || i.status === AssetItemStatus.IN_STOCK
  );
  
  const canBulkTransfer = useMemo(() => {
    if (selectedItems.length <= 1) return false;
    const allAllocated = selectedItems.every(i => i.status === AssetItemStatus.ALLOCATED);
    if (!allAllocated) return false;
    const firstDeptId = selectedItems[0].currentDeptId;
    return firstDeptId !== undefined && selectedItems.every(i => i.currentDeptId === firstDeptId);
  }, [selectedItems]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(filteredItems.map(i => i.id));
    else setSelectedIds([]);
  };

  const openActionForItem = (id: string, modalSetter: (open: boolean) => void) => {
    setSelectedIds([id]);
    setAllocFileName(null);
    setAllocFileData(null);
    setRetireFileName(null);
    setRetireFileData(null);
    modalSetter(true);
  };

  const updateItemsStatus = (newStatus: AssetItemStatus, extraData: any = {}, historyType: LifecycleEvent['type'], description: string, pdfUrl?: string) => {
    setAssets(prev => prev.map(batch => {
      const itemsInThisBatch = batch.items.filter(i => selectedIds.includes(i.id));
      if (itemsInThisBatch.length === 0) return batch;

      const updatedItems = batch.items.map(item => {
        if (selectedIds.includes(item.id)) {
          return { ...item, status: newStatus, ...extraData };
        }
        return item;
      });

      const newHistory: LifecycleEvent = {
        id: `h-${Date.now()}-${batch.id}`,
        assetId: batch.id,
        type: historyType,
        date: new Date().toISOString().split('T')[0],
        description: `${description} cho tài sản: ${itemsInThisBatch.map(i => i.assetCode).join(', ')}`,
        performedBy: 'Quản trị viên',
        pdfUrl: pdfUrl,
        ...extraData
      };

      return { ...batch, items: updatedItems, history: [newHistory, ...batch.history] };
    }));
    setSelectedIds([]);
  };

  const handleIndividualMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintProvider) {
      alert('Vui lòng nhập đơn vị sửa chữa.');
      return;
    }

    setAssets(prev => prev.map(batch => {
      const itemsInThisBatch = batch.items.filter(i => selectedIds.includes(i.id));
      if (itemsInThisBatch.length === 0) return batch;

      const updatedItems = batch.items.map(item => {
        if (selectedIds.includes(item.id)) {
          const data = individualMaintData[item.id];
          return { ...item, status: AssetItemStatus.MAINTENANCE, provider: maintProvider, cost: data.cost };
        }
        return item;
      });

      const newHistories: LifecycleEvent[] = itemsInThisBatch.map(item => ({
        id: `h-maint-${Date.now()}-${item.id}`,
        assetId: batch.id,
        type: 'Maintenance',
        date: new Date().toISOString().split('T')[0],
        description: `Gửi sửa chữa [${item.assetCode}] tại ${maintProvider}. Nội dung: ${individualMaintData[item.id].reason}`,
        performedBy: 'Quản trị viên',
        provider: maintProvider,
        cost: individualMaintData[item.id].cost
      }));

      return { ...batch, items: updatedItems, history: [...newHistories, ...batch.history] };
    }));

    setMaintenanceModalOpen(false);
    setSelectedIds([]);
  };

  const handleFileRead = (file: File, setData: (d: string) => void, setProc: (p: boolean) => void, setName: (n: string) => void) => {
    if (file.type !== 'application/pdf') {
      alert('Vui lòng chỉ chọn file định dạng PDF.');
      return;
    }
    setName(file.name);
    setProc(true);
    const reader = new FileReader();
    reader.onload = (re) => {
      setData(re.target?.result as string);
      setProc(false);
    };
    reader.onerror = () => {
      alert('Có lỗi xảy ra khi đọc file.');
      setProc(false);
    };
    reader.readAsDataURL(file);
  };

  const handleImport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isProcessingFile) {
      alert('Đang xử lý file PDF, vui lòng đợi trong giây lát...');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const quantity = parseInt(formData.get('quantity') as string);
    const unitPrice = parseInt(formData.get('unitPrice') as string) || 0;
    const warrantyValue = parseInt(formData.get('warrantyValue') as string) || 0;
    const warrantyUnit = formData.get('warrantyUnit') as string;
    const totalWarrantyMonths = warrantyUnit === 'year' ? warrantyValue * 12 : warrantyValue;
    
    const batchId = Math.random().toString(36).substr(2, 9);
    const now = new Date();
    const batchCode = `UNI-${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 900) + 100}`;
    
    const newItems: AssetItem[] = Array.from({ length: quantity }).map((_, index) => ({
      id: `item-${batchId}-${index}`,
      assetCode: `${batchCode}-${(index + 1).toString().padStart(3, '0')}`,
      batchId: batchId,
      status: AssetItemStatus.IN_STOCK
    }));

    const finalPdfData = selectedFileData || '';

    const newAssetBatch: Asset = {
      id: batchId,
      batchCode: batchCode,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      specifications: formData.get('specifications') as string || 'N/A',
      totalQuantity: quantity,
      supplierId: formData.get('supplierId') as string,
      purchaseDate: formData.get('purchaseDate') as string,
      unitPrice: unitPrice,
      warrantyMonths: totalWarrantyMonths,
      importPdfUrl: finalPdfData,
      history: [{
        id: `h-${batchId}`,
        assetId: batchId,
        type: 'Import',
        date: new Date().toISOString().split('T')[0],
        description: `Nhập kho lô hàng mới: ${quantity} x ${formData.get('name')}. Đã đính kèm chứng từ PDF.`,
        performedBy: 'Quản trị viên',
        pdfUrl: finalPdfData
      }],
      items: newItems
    };
    
    setAssets(prev => [newAssetBatch, ...prev]);
    setImportModalOpen(false);
    setSelectedFileName(null);
    setSelectedFileData(null);
  };

  const handleRetireSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isProcessingRetireFile) return;

    const formData = new FormData(e.currentTarget);
    const reason = formData.get('reason') as string;

    updateItemsStatus(
      AssetItemStatus.RETIRED,
      { currentDeptId: undefined, allocationDate: undefined },
      'Retire',
      `Thanh lý tài sản. Lý do: ${reason}`,
      retireFileData || undefined
    );
    setRetireModalOpen(false);
  };

  const handleDamageReportSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reason = formData.get('damageReason') as string;
    
    // Khi báo hỏng, trạng thái chuyển thành DAMAGED (Đã hỏng)
    updateItemsStatus(
      AssetItemStatus.DAMAGED,
      {},
      'Maintenance',
      `Báo hỏng tài sản. Lý do: ${reason}`
    );
    setDamageReportModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Tổng tài sản', value: allItems.length, color: 'text-slate-900', bg: 'bg-white' },
          { label: 'Kho trung tâm', value: allItems.filter(i => i.status === AssetItemStatus.IN_STOCK).length, color: 'text-green-600', bg: 'bg-white' },
          { label: 'Đang sử dụng', value: allItems.filter(i => i.status === AssetItemStatus.ALLOCATED).length, color: 'text-blue-600', bg: 'bg-white' },
          { label: 'Đã hỏng', value: allItems.filter(i => i.status === AssetItemStatus.DAMAGED).length, color: 'text-orange-600', bg: 'bg-white' },
          { label: 'Đã thanh lý', value: allItems.filter(i => i.status === AssetItemStatus.RETIRED).length, color: 'text-red-600', bg: 'bg-white' },
        ].map((s, idx) => (
          <div key={idx} className={`${s.bg} p-5 rounded-[2rem] border border-slate-200 shadow-sm`}>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col xl:flex-row gap-6 justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
          <div className="relative flex-1">
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Tìm theo mã tài sản, tên..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm transition-all"
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm min-w-[160px]"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">Tất cả danh mục</option>
            {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
          </select>
          <select 
            className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm min-w-[160px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Tất cả trạng thái</option>
            {Object.values(AssetItemStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        
        <div className="flex gap-3 w-full xl:w-auto">
          {selectedIds.length > 0 && (
            <div className="flex gap-2 animate-in slide-in-from-right-4">
              {canBulkReportDamage && (
                <button onClick={() => setDamageReportModalOpen(true)} className="bg-orange-500 text-white px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all">
                  Báo hỏng ({selectedIds.length})
                </button>
              )}
              {canBulkAllocate && (
                <button onClick={() => { setAllocFileName(null); setAllocFileData(null); setAllocateModalOpen(true); }} className="bg-indigo-600 text-white px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                  Cấp phát
                </button>
              )}
              {canBulkRecover && (
                <button onClick={() => setRecoverModalOpen(true)} className="bg-slate-800 text-white px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-200 hover:bg-black transition-all">
                  Thu hồi
                </button>
              )}
              {canBulkTransfer && (
                <button onClick={() => setTransferModalOpen(true)} className="bg-blue-500 text-white px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all">
                  Điều chuyển
                </button>
              )}
              {canBulkMaintain && (
                <button onClick={() => setMaintenanceModalOpen(true)} className="bg-amber-600 text-white px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all">
                  Sửa chữa
                </button>
              )}
              {canBulkRetire && (
                <button onClick={() => setRetireModalOpen(true)} className="bg-red-600 text-white px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all">
                  Thanh lý ({selectedIds.length})
                </button>
              )}
            </div>
          )}
          <button onClick={() => { setImportModalOpen(true); setSelectedFileName(null); setSelectedFileData(null); }} className="flex-1 xl:flex-none bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center group">
            <i className="fas fa-plus-circle mr-2 group-hover:rotate-90 transition-transform duration-300"></i> Nhập tài sản
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-6 w-10">
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === filteredItems.length && filteredItems.length > 0} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã tài sản</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên & Phân loại</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Đơn vị / Vị trí</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => (
                <tr key={item.id} className={`hover:bg-slate-50 transition-colors group ${selectedIds.includes(item.id) ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-8 py-6">
                    <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => handleToggleSelect(item.id)} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-mono font-bold text-blue-600 text-[11px] bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 shadow-sm">
                      {item.assetCode}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <Link to={`/assets/${item.id}`} className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors block leading-tight">
                        {item.parentBatch.name}
                        <i className="fas fa-external-link-alt text-[8px] ml-1.5 opacity-0 group-hover:opacity-40 transition-opacity"></i>
                      </Link>
                      <div className="flex items-center gap-1.5 mt-1">
                        <i className={`fas ${categories.find(c => c.name === item.parentBatch.category)?.icon || 'fa-tag'} text-[8px] text-slate-400`}></i>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.parentBatch.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm ${
                      item.status === AssetItemStatus.IN_STOCK ? 'bg-green-100 text-green-700' : 
                      item.status === AssetItemStatus.ALLOCATED ? 'bg-blue-100 text-blue-700' : 
                      item.status === AssetItemStatus.DAMAGED ? 'bg-orange-100 text-orange-700' :
                      item.status === AssetItemStatus.MAINTENANCE ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.status === AssetItemStatus.IN_STOCK ? 'bg-green-500' : 
                        item.status === AssetItemStatus.ALLOCATED ? 'bg-blue-500' : 
                        item.status === AssetItemStatus.DAMAGED ? 'bg-orange-500' :
                        item.status === AssetItemStatus.MAINTENANCE ? 'bg-amber-500' : 'bg-red-500'
                      }`}></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      {item.currentDeptId ? (
                        <div className="flex items-center">
                          <i className="fas fa-building text-slate-300 text-xs mr-2"></i>
                          {departments.find(d => d.id === item.currentDeptId)?.name}
                        </div>
                      ) : (
                        <span className="text-slate-300 italic font-medium">
                          {item.status === AssetItemStatus.RETIRED ? 'Khu vực thanh lý' : 'Kho trung tâm'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.status === AssetItemStatus.IN_STOCK && (
                        <>
                          <button onClick={() => openActionForItem(item.id, setAllocateModalOpen)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm" title="Cấp phát">
                            <i className="fas fa-paper-plane text-xs"></i>
                          </button>
                          <button onClick={() => openActionForItem(item.id, setDamageReportModalOpen)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-orange-500 hover:bg-orange-500 hover:text-white rounded-xl transition-all shadow-sm" title="Báo hỏng">
                            <i className="fas fa-exclamation-triangle text-xs"></i>
                          </button>
                        </>
                      )}
                      
                      {item.status === AssetItemStatus.ALLOCATED && (
                        <>
                          <button onClick={() => openActionForItem(item.id, setDamageReportModalOpen)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-orange-500 hover:bg-orange-500 hover:text-white rounded-xl transition-all shadow-sm" title="Báo hỏng">
                            <i className="fas fa-exclamation-triangle text-xs"></i>
                          </button>
                          <button onClick={() => openActionForItem(item.id, setRecoverModalOpen)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-800 hover:text-white rounded-xl transition-all shadow-sm" title="Thu hồi">
                            <i className="fas fa-undo text-xs"></i>
                          </button>
                          <button onClick={() => openActionForItem(item.id, setTransferModalOpen)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm" title="Điều chuyển">
                            <i className="fas fa-exchange-alt text-xs"></i>
                          </button>
                        </>
                      )}

                      {item.status !== AssetItemStatus.MAINTENANCE && item.status !== AssetItemStatus.RETIRED && (
                        <button onClick={() => openActionForItem(item.id, setMaintenanceModalOpen)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl transition-all shadow-sm" title="Gửi sửa chữa">
                          <i className="fas fa-tools text-xs"></i>
                        </button>
                      )}

                      {item.status !== AssetItemStatus.RETIRED && item.status !== AssetItemStatus.MAINTENANCE && (
                        <button onClick={() => openActionForItem(item.id, setRetireModalOpen)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm" title="Thanh lý">
                          <i className="fas fa-trash-alt text-xs"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl p-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Nhập kho lô tài sản mới</h3>
              <button onClick={() => setImportModalOpen(false)} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times"></i></button>
            </div>
            
            <form onSubmit={handleImport} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên tài sản</label>
                  <input name="name" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all" placeholder="Ví dụ: Laptop Dell XPS 13" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Danh mục</label>
                  <select name="category" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold transition-all cursor-pointer">
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số lượng nhập</label>
                  <input name="quantity" type="number" min="1" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold transition-all" placeholder="1" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Đơn giá (VNĐ)</label>
                  <div className="relative">
                    <input name="unitPrice" type="number" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold transition-all" placeholder="0" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">VNĐ</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ngày mua / Ngày nhập</label>
                  <input name="purchaseDate" type="date" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold transition-all" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nhà cung cấp</label>
                  <select name="supplierId" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold transition-all cursor-pointer">
                    <option value="">-- Chọn đơn vị cung ứng --</option>
                    {suppliers.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thời gian bảo hành</label>
                  <div className="flex gap-2">
                    <input name="warrantyValue" type="number" min="0" required className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold transition-all" placeholder="0" />
                    <select name="warrantyUnit" className="w-32 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold transition-all cursor-pointer">
                      <option value="month">Tháng</option>
                      <option value="year">Năm</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hóa đơn chứng từ (PDF)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full px-5 py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group ${isProcessingFile ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm mb-3 ${isProcessingFile ? 'animate-pulse' : ''}`}>
                    <i className={`fas ${isProcessingFile ? 'fa-spinner fa-spin' : 'fa-file-pdf'} text-xl`}></i>
                  </div>
                  <span className="text-sm font-bold text-slate-600">{isProcessingFile ? 'Đang đọc nội dung file...' : (selectedFileName || 'Chọn hoặc kéo thả file hóa đơn PDF vào đây')}</span>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileRead(file, setSelectedFileData, setIsProcessingFile, setSelectedFileName);
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={isProcessingFile}
                  className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
                >
                  {isProcessingFile ? 'Vui lòng đợi...' : 'Hoàn tất nhập kho'}
                </button>
                <button type="button" onClick={() => setImportModalOpen(false)} className="px-8 py-4 text-slate-400 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocate Modal */}
      {isAllocateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] w-full max-md shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-2xl"><i className="fas fa-paper-plane"></i></div>
              <h3 className="text-2xl font-black text-slate-900">Cấp phát tài sản</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Đang thao tác cho {selectedIds.length} tài sản</p>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (isProcessingAllocFile) return;
              const deptId = (e.currentTarget.elements.namedItem('deptId') as HTMLSelectElement).value;
              const deptName = departments.find(d => d.id === deptId)?.name;
              updateItemsStatus(AssetItemStatus.ALLOCATED, { currentDeptId: deptId, allocationDate: new Date().toISOString() }, 'Allocation', `Bàn giao cho: ${deptName}`, allocFileData || undefined);
              setAllocateModalOpen(false);
            }} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Đơn vị tiếp nhận</label>
                <select name="deptId" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold">
                  <option value="">-- Chọn đơn vị --</option>
                  {departments.filter(d => d.id !== 'stock').map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Biên bản bàn giao (PDF)</label>
                <div 
                  onClick={() => allocFileInputRef.current?.click()}
                  className={`w-full px-5 py-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group ${isProcessingAllocFile ? 'opacity-50' : ''}`}
                >
                  <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm mb-2 ${isProcessingAllocFile ? 'animate-pulse' : ''}`}>
                    <i className={`fas ${isProcessingAllocFile ? 'fa-spinner fa-spin' : 'fa-file-pdf'} text-lg`}></i>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 text-center">{isProcessingAllocFile ? 'Đang đọc file...' : (allocFileName || 'Tải lên biên bản bàn giao')}</span>
                  <input 
                    type="file" 
                    ref={allocFileInputRef} 
                    className="hidden" 
                    accept=".pdf" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileRead(file, setAllocFileData, setIsProcessingAllocFile, setAllocFileName);
                    }}
                  />
                </div>
              </div>

              <button type="submit" disabled={isProcessingAllocFile} className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 disabled:opacity-50 uppercase text-xs tracking-widest">Xác nhận bàn giao</button>
              <button type="button" onClick={() => setAllocateModalOpen(false)} className="w-full text-slate-400 font-bold uppercase text-xs tracking-widest">Quay lại</button>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-2xl"><i className="fas fa-exchange-alt"></i></div>
              <h3 className="text-2xl font-black text-slate-900">Điều chuyển tài sản</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Luân chuyển tài sản giữa các đơn vị</p>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const deptId = (e.currentTarget.elements.namedItem('toDeptId') as HTMLSelectElement).value;
              const deptName = departments.find(d => d.id === deptId)?.name;
              updateItemsStatus(AssetItemStatus.ALLOCATED, { currentDeptId: deptId, allocationDate: new Date().toISOString() }, 'Transfer', `Điều chuyển hàng loạt sang: ${deptName}`);
              setTransferModalOpen(false);
            }} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Đến đơn vị tiếp nhận mới</label>
                <select name="toDeptId" required className="w-full px-5 py-3.5 bg-blue-50 border border-blue-200 rounded-2xl font-bold focus:ring-4 focus:ring-blue-500/10 outline-none">
                  <option value="">-- Chọn đơn vị --</option>
                  {departments.filter(d => d.id !== 'stock').map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/30 uppercase text-xs tracking-widest">Xác nhận điều chuyển</button>
              <button type="button" onClick={() => setTransferModalOpen(false)} className="w-full text-slate-400 font-bold text-center uppercase text-xs tracking-widest">Hủy</button>
            </form>
          </div>
        </div>
      )}

      {/* Recover Modal */}
      {isRecoverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] w-full max-sm shadow-2xl p-10 space-y-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-slate-50 text-slate-800 rounded-3xl flex items-center justify-center mx-auto text-2xl shadow-inner"><i className="fas fa-undo"></i></div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Thu hồi tài sản</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium">Xác nhận thu hồi {selectedIds.length} tài sản về kho trung tâm?</p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => {
                updateItemsStatus(AssetItemStatus.IN_STOCK, { currentDeptId: undefined, allocationDate: undefined }, 'Recovery', 'Thu hồi về kho trung tâm');
                setRecoverModalOpen(false);
              }} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-900/20 uppercase text-xs tracking-widest">Xác nhận thu hồi</button>
              <button onClick={() => setRecoverModalOpen(false)} className="w-full py-4 text-slate-400 font-black rounded-2xl hover:bg-slate-50 uppercase text-xs tracking-widest">Quay lại</button>
            </div>
          </div>
        </div>
      )}

      {/* Damage Report Modal */}
      {isDamageReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mx-auto text-2xl shadow-inner">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Báo hỏng tài sản</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium">Ghi nhận hư hỏng cho {selectedIds.length} tài sản được chọn.</p>
            </div>
            <form onSubmit={handleDamageReportSubmit} className="space-y-6 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mô tả tình trạng hư hỏng</label>
                <textarea 
                  name="damageReason" 
                  required 
                  rows={3}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 font-bold transition-all" 
                  placeholder="Ví dụ: Laptop không lên nguồn, Màn hình bị sọc, v.v."
                />
              </div>
              <div className="flex flex-col gap-3">
                <button type="submit" className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-500/30 hover:bg-orange-700 transition-all uppercase text-xs tracking-widest">
                  Xác nhận báo hỏng
                </button>
                <button type="button" onClick={() => setDamageReportModalOpen(false)} className="w-full py-4 text-slate-400 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase text-xs tracking-widest">
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Retire Modal */}
      {isRetireModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner"><i className="fas fa-trash-alt"></i></div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Thanh lý tài sản</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Đang lập phiếu thanh lý cho {selectedIds.length} tài sản</p>
            </div>
            
            <form onSubmit={handleRetireSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lý do thanh lý cụ thể</label>
                <textarea 
                  name="reason" 
                  required 
                  rows={3} 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 font-bold transition-all" 
                  placeholder="Ví dụ: Hỏng hóc không thể sửa chữa, Lỗi thời, Hết khấu hao..." 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Biên bản thanh lý (PDF)</label>
                <div 
                  onClick={() => retireFileInputRef.current?.click()}
                  className={`w-full px-5 py-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-red-50 hover:border-red-200 transition-all group ${isProcessingRetireFile ? 'opacity-50' : ''}`}
                >
                  <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-red-600 shadow-sm mb-2 ${isProcessingRetireFile ? 'animate-pulse' : ''}`}>
                    <i className={`fas ${isProcessingRetireFile ? 'fa-spinner fa-spin' : 'fa-file-pdf'} text-lg`}></i>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 text-center">{isProcessingRetireFile ? 'Đang đọc file...' : (retireFileName || 'Tải lên biên bản thanh lý')}</span>
                  <input 
                    type="file" 
                    ref={retireFileInputRef} 
                    className="hidden" 
                    accept=".pdf" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileRead(file, setRetireFileData, setIsProcessingRetireFile, setRetireFileName);
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button type="submit" disabled={isProcessingRetireFile} className="w-full py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-500/30 hover:bg-red-700 transition-all uppercase text-xs tracking-widest disabled:opacity-50">
                  Xác nhận Thanh lý
                </button>
                <button type="button" onClick={() => setRetireModalOpen(false)} className="w-full py-4 text-slate-400 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase text-xs tracking-widest">
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Maintenance Modal */}
      {isMaintenanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 lg:p-10">
          <div className="bg-white rounded-[3rem] w-full max-w-5xl shadow-2xl p-8 lg:p-12 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-start mb-8 shrink-0">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Gửi bảo trì & Sửa chữa chi tiết</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Đang lập phiếu cho {selectedIds.length} tài sản được chọn</p>
              </div>
              <button onClick={() => setMaintenanceModalOpen(false)} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times text-xl"></i></button>
            </div>

            <form onSubmit={handleIndividualMaintenanceSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="mb-6 shrink-0">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Đơn vị sửa chữa chung cho đợt này</label>
                <input 
                  value={maintProvider}
                  onChange={(e) => setMaintProvider(e.target.value)}
                  required 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-amber-500/10 transition-all" 
                  placeholder="Ví dụ: Trung tâm bảo hành Dell, FPT Services..." 
                />
              </div>

              <div className="flex-1 overflow-y-auto rounded-[2rem] border border-slate-100 bg-slate-50/50 mb-8 custom-scrollbar shadow-inner">
                <table className="min-w-full divide-y divide-slate-100 text-left">
                  <thead className="bg-white sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Tài sản</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Đơn vị sử dụng</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Nội dung sửa chữa hỏng hóc</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest w-40">Phí dự kiến (VNĐ)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white/40">
                    {selectedItems.map(item => (
                      <tr key={item.id} className="hover:bg-white/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-xs text-slate-900">{item.parentBatch.name}</div>
                          <div className="font-mono text-[10px] text-blue-500 font-bold mt-0.5">{item.assetCode}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <i className="fas fa-building text-[10px] text-slate-300"></i>
                            <span className="text-[11px] font-bold text-slate-600">
                              {item.currentDeptId ? departments.find(d => d.id === item.currentDeptId)?.name : 'Kho trung tâm'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            value={individualMaintData[item.id]?.reason || ''}
                            onChange={(e) => setIndividualMaintData({
                              ...individualMaintData,
                              [item.id]: { ...individualMaintData[item.id], reason: e.target.value }
                            })}
                            required
                            placeholder="Mô tả lỗi của máy này..."
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-xs font-bold transition-all"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <input 
                              type="number"
                              value={individualMaintData[item.id]?.cost || 0}
                              onChange={(e) => setIndividualMaintData({
                                ...individualMaintData,
                                [item.id]: { ...individualMaintData[item.id], cost: parseInt(e.target.value) || 0 }
                              })}
                              className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-xs font-black transition-all"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-400">VNĐ</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-4 shrink-0">
                <button type="submit" className="flex-1 py-4 bg-amber-600 text-white font-black rounded-2xl shadow-xl shadow-amber-500/30 hover:bg-amber-700 transition-all uppercase tracking-widest text-xs">Xác nhận gửi bảo trì hàng loạt</button>
                <button type="button" onClick={() => setMaintenanceModalOpen(false)} className="px-10 py-4 text-slate-400 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Đóng</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default AssetManagement;
