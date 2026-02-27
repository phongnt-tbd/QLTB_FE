import React, { useRef } from 'react';
import { Asset, Department, User, AssetItemStatus } from '@/types';
import { useAllocations } from '../hooks/useAllocations';

interface AllocationsPageProps {
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  departments: Department[];
  user: User;
}

export const AllocationsPage: React.FC<AllocationsPageProps> = ({
  assets,
  setAssets,
  departments,
  user,
}) => {
  const allocFileInputRef = useRef<HTMLInputElement>(null);

  const {
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
    deptStats,
    deptAssets,
    stockAssets,
    handleToggleSelect,
    handleAllocate,
    handleRecover,
    handleFileUpload,
  } = useAllocations(assets, setAssets, departments, user);

  const activeDept = departments.find(d => d.id === selectedDeptId);

  if (selectedDeptId) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Department Detail View - Same UI as before */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedDeptId(null);
              setSelectedAssetIds([]);
              setAssetSearchTerm('');
            }}
            className="text-slate-500 hover:text-blue-600 font-black text-xs uppercase tracking-widest flex items-center transition-all px-4 py-2 hover:bg-white rounded-xl"
          >
            <i className="fas fa-chevron-left mr-2"></i> Quay lại danh sách đơn vị
          </button>
          <div className="text-right">
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              {activeDept?.name}
            </h2>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
              {activeDept?.code}
            </p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col xl:flex-row gap-6 justify-between items-center">
          <div className="relative flex-1 w-full">
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              type="text"
              placeholder="Tìm mã tài sản hoặc tên..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm transition-all"
              value={assetSearchTerm}
              onChange={e => setAssetSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full xl:w-auto">
            {selectedAssetIds.length > 0 && (
              <button
                onClick={() => setIsRecoverModalOpen(true)}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-black transition-all flex items-center gap-2"
              >
                <i className="fas fa-undo"></i> Thu hồi ({selectedAssetIds.length})
              </button>
            )}
            <button
              onClick={() => {
                setSelectedAssetIds([]);
                setIsAllocateModalOpen(true);
              }}
              className="flex-1 xl:flex-none bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center group"
            >
              <i className="fas fa-plus-circle mr-2 group-hover:rotate-90 transition-transform duration-300"></i>{' '}
              Cấp phát mới
            </button>
          </div>
        </div>

        {/* Assets Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-100 text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-6 w-10">
                  <input
                    type="checkbox"
                    onChange={e =>
                      setSelectedAssetIds(e.target.checked ? deptAssets.map(i => i.id) : [])
                    }
                    checked={
                      selectedAssetIds.length === deptAssets.length && deptAssets.length > 0
                    }
                    className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 cursor-pointer"
                  />
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Mã tài sản
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Tên tài sản
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Ngày cấp phát
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deptAssets.map(item => (
                <tr
                  key={item.id}
                  onClick={() => handleToggleSelect(item.id)}
                  className={`hover:bg-slate-50 transition-all group cursor-pointer ${
                    selectedAssetIds.includes(item.id) ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <td className="px-8 py-6">
                    <input
                      type="checkbox"
                      checked={selectedAssetIds.includes(item.id)}
                      onChange={() => handleToggleSelect(item.id)}
                      className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-mono font-bold text-blue-600 text-[11px] bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                      {item.assetCode}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-900 text-sm">
                    {item.parentBatch.name}
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-500">
                    {item.allocationDate?.split('T')[0] || 'N/A'}
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        item.status === AssetItemStatus.ALLOCATED
                          ? 'bg-blue-100 text-blue-700'
                          : item.status === AssetItemStatus.MAINTENANCE
                          ? 'bg-amber-100 text-amber-700'
                          : item.status === AssetItemStatus.RETIRED
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {deptAssets.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-20 text-center text-slate-400 italic font-medium"
                  >
                    Đơn vị này hiện không có tài sản nào đang sử dụng.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Allocate Modal */}
        {isAllocateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl p-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Cấp phát cho {activeDept?.name}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Chọn tài sản trong kho và đính kèm hồ sơ bàn giao
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAllocateModalOpen(false);
                    setSelectedAssetIds([]);
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              {/* PDF Upload */}
              <div className="mb-6">
                <div
                  onClick={() => allocFileInputRef.current?.click()}
                  className={`w-full p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center gap-4 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group ${
                    fileUpload.isProcessing ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <div
                    className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm ${
                      fileUpload.isProcessing ? 'animate-pulse' : ''
                    }`}
                  >
                    <i
                      className={`fas ${
                        fileUpload.isProcessing ? 'fa-spinner fa-spin' : 'fa-file-pdf'
                      } text-xl`}
                    ></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {fileUpload.fileName || 'Đính kèm hồ sơ cấp phát / Biên bản bàn giao (PDF)'}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {fileUpload.isProcessing
                        ? 'Đang đọc dữ liệu...'
                        : 'Bấm để chọn file chứng từ'}
                    </p>
                  </div>
                  <input
                    type="file"
                    ref={allocFileInputRef}
                    className="hidden"
                    accept=".pdf"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                </div>
              </div>

              {/* Stock Assets Table */}
              <div className="flex-1 overflow-y-auto mb-8 border border-slate-100 rounded-[2rem] bg-slate-50/50 shadow-inner">
                <table className="min-w-full divide-y divide-slate-100 text-left">
                  <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-8 py-4 w-10">#</th>
                      <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Mã tài sản
                      </th>
                      <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Tên & Phân loại
                      </th>
                      <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Thông số
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stockAssets.map(item => (
                      <tr
                        key={item.id}
                        onClick={() => handleToggleSelect(item.id)}
                        className={`cursor-pointer transition-all ${
                          selectedAssetIds.includes(item.id)
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-blue-50'
                        }`}
                      >
                        <td className="px-8 py-4">
                          <input
                            type="checkbox"
                            checked={selectedAssetIds.includes(item.id)}
                            readOnly
                            className="w-4 h-4 rounded"
                          />
                        </td>
                        <td className="px-8 py-4 font-mono font-bold text-[11px]">
                          {item.assetCode}
                        </td>
                        <td className="px-8 py-4">
                          <div className="font-bold text-xs">{item.parentBatch.name}</div>
                          <div
                            className={`text-[9px] font-black uppercase tracking-widest ${
                              selectedAssetIds.includes(item.id)
                                ? 'text-blue-200'
                                : 'text-slate-400'
                            }`}
                          >
                            {item.parentBatch.category}
                          </div>
                        </td>
                        <td className="px-8 py-4 text-[10px] font-medium opacity-80">
                          {item.parentBatch.specifications}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAllocate}
                  disabled={selectedAssetIds.length === 0 || fileUpload.isProcessing}
                  className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 disabled:opacity-50 uppercase tracking-widest text-xs"
                >
                  Xác nhận bàn giao{' '}
                  {selectedAssetIds.length > 0 ? `(${selectedAssetIds.length})` : ''}
                </button>
                <button
                  onClick={() => setIsAllocateModalOpen(false)}
                  className="px-10 py-4 text-slate-400 font-black rounded-2xl hover:bg-slate-50 uppercase tracking-widest text-xs"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recover Modal */}
        {isRecoverModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[3rem] w-full max-sm shadow-2xl p-10 space-y-8 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-slate-50 text-slate-800 rounded-3xl flex items-center justify-center mx-auto text-2xl shadow-inner">
                <i className="fas fa-undo"></i>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Thu hồi tài sản
                </h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">
                  Bạn có chắc chắn muốn thu hồi <b>{selectedAssetIds.length}</b> tài sản từ{' '}
                  <b>{activeDept?.name}</b>?
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRecover}
                  className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-xs tracking-widest"
                >
                  Xác nhận thu hồi
                </button>
                <button
                  onClick={() => setIsRecoverModalOpen(false)}
                  className="w-full py-4 text-slate-400 font-black rounded-2xl hover:bg-slate-50 uppercase text-xs tracking-widest"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Department List View
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Cấp phát - Thu hồi tài sản
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Theo dõi và điều chuyển tài sản giữa các đơn vị phòng ban
        </p>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200">
        <div className="relative mb-6">
          <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn vị hoặc tên đơn vị..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm transition-all"
            value={deptSearchTerm}
            onChange={e => setDeptSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-slate-100">
          <table className="min-w-full divide-y divide-slate-100 text-left">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Mã đơn vị
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Tên đơn vị
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Tài sản sử dụng
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deptStats.map(dept => {
                return (
                  <tr
                    key={dept.id}
                    onClick={() => setSelectedDeptId(dept.id)}
                    className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                  >
                    <td className="px-8 py-5">
                      <span className="font-mono font-bold text-blue-600 text-xs bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                        {dept.code}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-black text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                        {dept.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium line-clamp-1">
                        {dept.description}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-xl font-black text-slate-900">{dept.assetCount}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase ml-1.5">
                        Tài sản
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10">
                        <i className="fas fa-arrow-right text-xs"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {deptStats.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-8 py-20 text-center text-slate-400 italic font-medium"
                  >
                    Không tìm thấy đơn vị nào phù hợp với từ khóa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
