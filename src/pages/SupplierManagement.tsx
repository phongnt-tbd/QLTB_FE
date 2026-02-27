
import React, { useState } from 'react';
import { Supplier, Asset } from '@/types';

interface SupplierManagementProps {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  assets: Asset[];
}

const SupplierManagement: React.FC<SupplierManagementProps> = ({ suppliers, setSuppliers, assets }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSup, setEditingSup] = useState<Supplier | null>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Supplier = {
      id: editingSup?.id || `s${Date.now()}`,
      name: formData.get('name') as string,
      taxCode: formData.get('taxCode') as string,
      contactPerson: formData.get('contactPerson') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
    };
    if (editingSup) setSuppliers(prev => prev.map(s => s.id === editingSup.id ? data : s));
    else setSuppliers(prev => [...prev, data]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Quản lý Đối tác & Nhà cung cấp</h2>
          <p className="text-sm text-slate-500">Thông tin liên hệ và danh sách tài sản cung ứng</p>
        </div>
        <button onClick={() => { setEditingSup(null); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 flex items-center">
          <i className="fas fa-handshake mr-2"></i> Kết nối Đối tác
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suppliers.map(sup => (
          <div key={sup.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <i className="fas fa-truck-loading text-2xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-slate-900">{sup.name}</h3>
                  <p className="text-xs text-slate-500">MST: {sup.taxCode}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button onClick={() => { setEditingSup(sup); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><i className="fas fa-edit"></i></button>
                <button onClick={() => setSuppliers(prev => prev.filter(s => s.id !== sup.id))} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><i className="fas fa-trash-alt"></i></button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Đại diện</p>
                <p className="text-sm font-semibold text-slate-700">{sup.contactPerson}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Hotline</p>
                <p className="text-sm font-semibold text-slate-700">{sup.phone}</p>
              </div>
              <div className="col-span-2 p-3 bg-slate-50 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Email</p>
                <p className="text-sm font-semibold text-slate-700">{sup.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-sm font-medium text-slate-600">Tổng tài sản đã cung ứng</span>
              <span className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-200">
                {assets.filter(a => a.supplierId === sup.id).length}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl">
              <h3 className="text-lg font-bold text-slate-900">Thông tin đối tác</h3>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Tên công ty/Nhà cung cấp</label>
                <input name="name" defaultValue={editingSup?.name} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Mã số thuế</label>
                  <input name="taxCode" defaultValue={editingSup?.taxCode} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Người đại diện</label>
                  <input name="contactPerson" defaultValue={editingSup?.contactPerson} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Điện thoại</label>
                  <input name="phone" defaultValue={editingSup?.phone} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Email</label>
                  <input type="email" name="email" defaultValue={editingSup?.email} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700">Xác nhận Lưu</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-slate-200 font-bold rounded-xl text-slate-600">Hủy bỏ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManagement;
