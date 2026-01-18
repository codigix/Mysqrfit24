import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { Plus, Edit, Trash2, LogOut, FileUp, Download } from 'lucide-react';

interface LegalContent {
  id: string;
  type: 'terms_and_conditions' | 'privacy_policy' | 'about_us' | 'disclaimer' | 'cookie_policy';
  title: string;
  content: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface UploadedFile {
  id: string;
  filename: string;
  url: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

const AdminLegal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [legalContents, setLegalContents] = useState<LegalContent[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingContent, setEditingContent] = useState<LegalContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('terms');

  const legalTypes = [
    { value: 'terms_and_conditions', label: 'Terms & Conditions' },
    { value: 'privacy_policy', label: 'Privacy Policy' },
    { value: 'about_us', label: 'About Us' },
    { value: 'disclaimer', label: 'Disclaimer' },
    { value: 'cookie_policy', label: 'Cookie Policy' },
  ];

  const [formData, setFormData] = useState({
    type: 'terms_and_conditions' as LegalContent['type'],
    title: '',
    content: '',
    is_published: true,
  });

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/admin-login');
    }
  };

  const fetchLegalContent = async () => {
    try {
      setLoading(true);
      const data = await apiService.legal.list();
      setLegalContents(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch legal content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async () => {
    try {
      const data = await apiService.files.list();
      setFiles(data);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchLegalContent();
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    try {
      if (!formData.type || !formData.title || !formData.content) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        });
        return;
      }

      if (editingContent) {
        await apiService.legal.update(editingContent.id, formData);
        toast({
          title: 'Success',
          description: 'Legal content updated successfully',
        });
      } else {
        await apiService.legal.create(formData);
        toast({
          title: 'Success',
          description: 'Legal content created successfully',
        });
      }

      setFormData({
        type: 'terms_and_conditions',
        title: '',
        content: '',
        is_published: true,
      });
      setEditingContent(null);
      setIsDialogOpen(false);
      fetchLegalContent();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save legal content';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (content: LegalContent) => {
    setEditingContent(content);
    setFormData({
      type: content.type,
      title: content.title,
      content: content.content,
      is_published: content.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.legal.delete(id);
      toast({
        title: 'Success',
        description: 'Legal content deleted successfully',
      });
      fetchLegalContent();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete legal content';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await apiService.files.upload(file);
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
      fetchFiles();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await apiService.files.delete(fileId);
      toast({
        title: 'Success',
        description: 'File deleted successfully',
      });
      fetchFiles();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete file';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Legal & Settings Management</h1>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="legal">Legal Content</TabsTrigger>
            <TabsTrigger value="files">Files & Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="legal" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Legal Content</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="gap-2"
                    onClick={() => {
                      setEditingContent(null);
                      setFormData({
                        type: 'terms_and_conditions',
                        title: '',
                        content: '',
                        is_published: true,
                      });
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Legal Content
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingContent ? 'Edit Legal Content' : 'Add Legal Content'}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="type">Content Type</Label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as LegalContent['type'],
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        {legalTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Enter content title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        placeholder="Enter content"
                        className="min-h-96"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="published"
                        checked={formData.is_published}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            is_published: checked === true,
                          })
                        }
                      />
                      <Label htmlFor="published">Publish Content</Label>
                    </div>

                    <Button onClick={handleSave} className="w-full">
                      {editingContent ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : legalContents.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No legal content yet. Add your first legal document.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {legalContents.map((content) => (
                  <Card key={content.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{content.title}</CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={content.is_published ? 'default' : 'secondary'}>
                              {content.is_published ? 'Published' : 'Draft'}
                            </Badge>
                            <Badge variant="outline">
                              {legalTypes.find((t) => t.value === content.type)?.label}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(content)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Legal Content</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(content.id)}
                                  className="bg-destructive"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-2">{content.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Updated: {new Date(content.updated_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">File Management</h2>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Upload New File</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-lg p-6">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp,.avif,.zip"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <FileUp className="w-8 h-8 text-gray-400" />
                        <p className="text-sm font-medium">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, TXT, Images (JPG, PNG, WEBP, AVIF), ZIP (Max 50MB)
                        </p>
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {files.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    No files uploaded yet.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {files.map((file) => (
                    <Card key={file.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{file.filename}</p>
                            <p className="text-sm text-gray-500">
                              {(file.fileSize / 1024).toFixed(2)} KB • {file.fileType}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(file.url)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete File</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteFile(file.id)}
                                    className="bg-destructive"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminLegal;
