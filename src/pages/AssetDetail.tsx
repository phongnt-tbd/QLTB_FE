
import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Asset, Department, AssetItemStatus, User, Supplier } from '@/types';

interface AssetDetailProps {
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  departments: Department[];
  suppliers: Supplier[];
  user: User;
}

const AssetDetail: React.FC<AssetDetailProps> = ({ assets, setAssets, departments, suppliers, user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [viewingBlobUrl, setViewingBlobUrl] = useState<string | null>(null);

  const itemData = useMemo(() => {
    for (const batch of assets) {
      const item = batch.items.find(i => i.id === id);
      if (item) return { item, batch };
    }
    return null;
  }, [assets, id]);

  // Clean up Object URL khi modal đóng hoặc component unmount
  useEffect(() => {
    return () => {
      if (viewingBlobUrl) {
        URL.revokeObjectURL(viewingBlobUrl);
      }
    };
  }, [viewingBlobUrl]);

  if (!itemData) return <div className="text-center py-20 text-slate-500 font-bold">Tài sản không tồn tại trong hệ thống.</div>;

  const { item, batch } = itemData;
  const itemHistory = batch.history.slice(0, 10);

  const handleViewPdf = async (fullDataString: string) => {
    try {
      if (!fullDataString) {
        alert('Không tìm thấy dữ liệu file PDF.');
        return;
      }

      // Xử lý chuỗi Base64 an toàn
      let base64Content = fullDataString;
      
      // Nếu là Data URL (có chứa dấu phẩy), tách lấy phần nội dung sau dấu phẩy
      if (fullDataString.includes(',')) {
        base64Content = fullDataString.split(',')[1];
      }

      // Làm sạch chuỗi: loại bỏ khoảng trắng, xuống dòng (lỗi phổ biến của atob)
      base64Content = base64Content.trim().replace(/\s/g, '');

      // Kiểm tra độ dài hợp lệ của Base64 (phải chia hết cho 4)
      if (base64Content.length % 4 !== 0) {
        console.warn('Base64 string padding might be incorrect');
      }

      // Giải mã chuỗi sang nhị phân
      const binaryString = window.atob(base64Content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: 'application/pdf' });
      
      // Xóa URL cũ trước khi tạo mới
      if (viewingBlobUrl) {
        URL.revokeObjectURL(viewingBlobUrl);
      }

      const url = URL.createObjectURL(blob);
      setViewingBlobUrl(url);
    } catch (error) {
      console.error('Error viewing PDF:', error);
      alert('Lỗi định dạng: File PDF này không thể giải mã hoặc đã bị hỏng dữ liệu.');
    }
  };

  const closePdfViewer = () => {
    if (viewingBlobUrl) {
      URL.revokeObjectURL(viewingBlobUrl);
    }
    setViewingBlobUrl(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-blue-600 font-black text-sm uppercase tracking-widest transition-all">
          <i className="fas fa-chevron-left mr-2"></i> Trở về danh sách
        </button>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
          ID Hệ thống: {item.id}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center text-3xl mb-6 shadow-inner">
              <i className="fas fa-laptop"></i>
            </div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight mb-2">{batch.name}</h1>
            <span className="font-mono font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-xl border border-blue-100 shadow-sm text-sm">
              {item.assetCode}
            </span>
            <div className="mt-8 w-full space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Trạng thái hiện tại</p>
                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm ${
                  item.status === AssetItemStatus.IN_STOCK ? 'bg-green-100 text-green-700' : 
                  item.status === AssetItemStatus.ALLOCATED ? 'bg-blue-100 text-blue-700' : 
                  item.status === AssetItemStatus.MAINTENANCE ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Vị trí sử dụng</p>
                <p className="text-sm font-bold text-slate-700">
                  {item.currentDeptId ? departments.find(d => d.id === item.currentDeptId)?.name : 'Kho trung tâm'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center">
              <i className="fas fa-microchip mr-3 text-blue-600"></i> Cấu hình & Thông số
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Danh mục</p>
                <p className="font-bold text-slate-800">{batch.category}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bảo hành</p>
                <p className="font-bold text-slate-800">{batch.warrantyMonths} tháng</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mô tả kỹ thuật</p>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{batch.specifications}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đơn giá nhập</p>
                <p className="font-bold text-slate-800">{batch.unitPrice.toLocaleString()} VNĐ</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ngày nhập kho</p>
                <p className="font-bold text-slate-800">{batch.purchaseDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center">
              <i className="fas fa-history mr-3 text-indigo-600"></i> Nhật ký vòng đời tài sản
            </h3>
            <div className="space-y-6">
              {itemHistory.map((h, idx) => (
                <div key={h.id} className="flex gap-4 relative group/history">
                  {idx !== itemHistory.length - 1 && <div className="absolute left-[1.35rem] top-10 bottom-0 w-0.5 bg-slate-100"></div>}
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm z-10 ${
                    h.type === 'Import' ? 'bg-green-50 text-green-600' :
                    h.type === 'Allocation' ? 'bg-blue-50 text-blue-600' :
                    h.type === 'Maintenance' ? 'bg-amber-50 text-amber-600' :
                    h.type === 'Transfer' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <i className={`fas ${
                      h.type === 'Import' ? 'fa-download' :
                      h.type === 'Allocation' ? 'fa-paper-plane' :
                      h.type === 'Maintenance' ? 'fa-tools' :
                      h.type === 'Transfer' ? 'fa-exchange-alt' : 'fa-info-circle'
                    } text-sm`}></i>
                  </div>
                  <div className="pb-8 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{h.date}</p>
                        <p className="text-sm font-bold text-slate-800 mt-1">{h.type === 'Import' ? 'Nhập kho lô hàng' : h.type}</p>
                      </div>
                      {h.pdfUrl && h.pdfUrl.length > 0 && (
                        <button 
                          onClick={() => handleViewPdf(h.pdfUrl!)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm shadow-red-100"
                        >
                          <i className="fas fa-file-pdf"></i> Xem chứng từ
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1 font-medium leading-relaxed">{h.description}</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Thực hiện bởi: {h.performedBy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {viewingBlobUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 lg:p-10">
          <div className="bg-white w-full h-full rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                  <i className="fas fa-file-pdf text-lg"></i>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Chi tiết chứng từ PDF</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nhật ký tài sản: {item.assetCode}</p>
                </div>
              </div>
              <button 
                onClick={closePdfViewer} 
                className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="flex-1 bg-slate-200 relative">
              <object
                data={viewingBlobUrl}
                type="application/pdf"
                className="w-full h-full"
              >
                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 p-10 text-center">
                  <i className="fas fa-exclamation-triangle text-4xl"></i>
                  <p className="font-bold">Trình duyệt không thể hiển thị PDF nhúng.</p>
                  <a 
                    href={viewingBlobUrl} 
                    download="chung-tu-tbd.pdf" 
                    className="px-8 py-3 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-500/20"
                  >
                    Tải file về máy
                  </a>
                </div>
              </object>
            </div>
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button 
                onClick={closePdfViewer}
                className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-black transition-all"
              >
                Đóng trình xem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetDetail;
