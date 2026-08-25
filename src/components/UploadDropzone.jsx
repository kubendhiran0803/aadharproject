import React, { useCallback, useState } from 'react';
import { UploadCloud, FileImage } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UploadDropzone({ onFileSelect }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`upload-dropzone ${isDragActive ? 'active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload').click()}
    >
      <input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleChange}
      />
      
      {file ? (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          <div className="upload-icon">
            <FileImage size={32} />
          </div>
          <h3 className="text-gradient">Document Selected</h3>
          <p>{file.name}</p>
        </motion.div>
      ) : (
        <>
          <div className="upload-icon">
            <UploadCloud size={32} />
          </div>
          <h3>Upload Aadhar Card</h3>
          <p>Drag and drop your image here, or click to browse</p>
          <p style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>Supports JPG, PNG, WEBP (Max 5MB)</p>
        </>
      )}
    </motion.div>
  );
}
