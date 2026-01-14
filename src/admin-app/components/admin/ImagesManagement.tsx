import { useState, useEffect } from 'react';
import { apiService, getFileUrl } from '@/services/api';
import { UploadedFile } from '@/types/site';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trash2, Download, Upload } from 'lucide-react';

const ImagesManagement = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const data = await apiService.files.getAll();
      setFiles(data);
    } catch (error) {
      toast.error('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    let fileList: FileList | null = null;
    if ('dataTransfer' in e) {
      fileList = e.dataTransfer.files;
    } else {
      fileList = e.currentTarget.files;
    }

    if (!fileList) return;

    setUploading(true);
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        await apiService.files.upload(file, 'image');
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    setUploading(false);
    fetchFiles();
  };

  const handleDelete = async (fileId: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiService.files.delete(fileId);
        toast.success('File deleted');
        fetchFiles();
      } catch (error) {
        toast.error('Failed to delete file');
      }
    }
  };

  const getFilePreview = (file: UploadedFile) => {
    if (file.mime_type.startsWith('image/')) {
      return (
        <img
          src={getFileUrl(file.file_path)}
          alt={file.original_filename}
          className="w-full h-40 object-cover rounded"
        />
      );
    }
    return (
      <div className="w-full h-40 bg-slate-100 rounded flex items-center justify-center">
        <span className="text-slate-500">{file.file_type}</span>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Images & Media</h2>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={(e) => {
          setDragActive(false);
          handleUpload(e);
        }}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-slate-300'
        }`}
      >
        <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
        <p className="text-lg font-semibold mb-2">Drag and drop files here</p>
        <p className="text-muted-foreground mb-4">or click to select files</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
          id="file-input"
        />
        <Button
          onClick={() => document.getElementById('file-input')?.click()}
          disabled={uploading}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Select Files'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {files.map((file) => (
          <div key={file.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {getFilePreview(file)}
            <div className="p-3">
              <p className="text-sm font-medium truncate mb-2">{file.original_filename}</p>
              <p className="text-xs text-muted-foreground mb-3">
                {(file.file_size / 1024).toFixed(2)} KB
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(getFileUrl(file.file_path), '_blank')}
                  className="text-blue-600 hover:text-blue-800 p-1 flex-1"
                  title="View / Download"
                >
                  <Download className="h-4 w-4 mx-auto" />
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="text-red-600 hover:text-red-800 p-1 flex-1"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagesManagement;
