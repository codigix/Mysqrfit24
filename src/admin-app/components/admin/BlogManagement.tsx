import { useState, useEffect } from 'react';
import { apiService, getFileUrl } from '@/services/api';
import { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: '',
    status: 'draft' as 'draft' | 'published',
    image_url: '',
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await apiService.blog.getAll();
      setPosts(data);
    } catch (error) {
      toast.error('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
      };

      if (editingId) {
        await apiService.blog.update(editingId, payload);
        toast.success('Blog post updated');
      } else {
        await apiService.blog.create(payload);
        toast.success('Blog post created');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        author: '',
        status: 'draft',
        image_url: '',
      });
      fetchPosts();
    } catch (error) {
      toast.error('Failed to save blog post');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      author: post.author,
      status: (post.status || 'draft') as 'draft' | 'published',
      image_url: post.image_url || '',
    });
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiService.blog.delete(id);
        toast.success('Blog post deleted');
        fetchPosts();
      } catch (error) {
        toast.error('Failed to delete blog post');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Blog Posts</h2>
          <p className="text-gray-500 text-sm mt-1">Create and manage blog content</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); }} className="gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg">
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      {showForm && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 space-y-4 shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {editingId ? 'Edit Post' : 'New Post'}
            </h3>
            <button onClick={() => { setShowForm(false); setEditingId(null); }}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData({
                      ...formData,
                      title,
                      slug: formData.slug || generateSlug(title),
                    });
                  }}
                  required
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label>Featured Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    className="flex-1"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="uploads/images/... or https://..."
                  />
                  {formData.image_url && (
                    <div className="w-10 h-10 border rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={getFileUrl(formData.image_url)} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-1">
                <Label>Status</Label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Author</Label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Excerpt</Label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Short summary of the post"
              />
            </div>

            <div>
              <Label>Content</Label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? 'Update' : 'Create'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => { setShowForm(false); setEditingId(null); }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">No blog posts yet. Create your first post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col md:flex-row">
              {post.image_url && (
                <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden flex-shrink-0">
                  <img 
                    src={getFileUrl(post.image_url)} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{post.title}</h3>
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status || 'draft'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">by {post.author}</p>
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors border"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors border"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogManagement;
