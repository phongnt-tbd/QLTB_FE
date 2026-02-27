import { useState, useRef } from 'react';

interface UseFileUploadReturn {
  fileName: string | null;
  fileData: string | null;
  isProcessing: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileSelect: (file: File) => void;
  resetFile: () => void;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileData, setFileData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Vui lòng chỉ chọn file định dạng PDF.');
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();

    reader.onload = (event) => {
      setFileData(event.target?.result as string);
      setIsProcessing(false);
    };

    reader.onerror = () => {
      alert('Có lỗi xảy ra khi đọc file.');
      setIsProcessing(false);
      setFileName(null);
    };

    reader.readAsDataURL(file);
  };

  const resetFile = () => {
    setFileName(null);
    setFileData(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    fileName,
    fileData,
    isProcessing,
    fileInputRef,
    handleFileSelect,
    resetFile,
  };
};
