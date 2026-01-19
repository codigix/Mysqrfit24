import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService } from '@/services/api';

interface LegalContent {
  id: string;
  type: string;
  title: string;
  content: string;
  is_published: boolean;
}

const Legal = () => {
  const [searchParams] = useSearchParams();
  const [legalContent, setLegalContent] = useState<LegalContent | null>(null);
  const [allContent, setAllContent] = useState<LegalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState(
    searchParams.get('type') || 'terms_and_conditions'
  );

  const legalTypes = [
    { value: 'terms_and_conditions', label: 'Terms & Conditions' },
    { value: 'privacy_policy', label: 'Privacy Policy' },
    { value: 'about_us', label: 'About Us' },
    { value: 'disclaimer', label: 'Disclaimer' },
    { value: 'cookie_policy', label: 'Cookie Policy' },
  ];

  const fetchLegalContent = async () => {
    try {
      setLoading(true);
      const data = await apiService.legal.list();
      const publishedContent = data.filter((c: LegalContent) => c.is_published);
      setAllContent(publishedContent);
      
      const defaultContent = publishedContent.find(
        (c: LegalContent) => c.type === activeType
      );
      setLegalContent(defaultContent || publishedContent[0] || null);
    } catch (error) {
      console.error('Failed to fetch legal content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLegalContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const content = allContent.find((c) => c.type === activeType);
    setLegalContent(content || null);
  }, [activeType, allContent]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Legal Information</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {legalTypes.map((type) => {
            const hasContent = allContent.some((c) => c.type === type.value);
            return (
              <button
                key={type.value}
                onClick={() => setActiveType(type.value)}
                disabled={!hasContent}
                className={`p-4 rounded-lg font-medium transition-all ${
                  activeType === type.value
                    ? 'bg-blue-600 text-white shadow-lg'
                    : hasContent
                      ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : legalContent ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{legalContent.title}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <div
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: legalContent.content }}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No legal content available at this time.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Legal;
