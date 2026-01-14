import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { SiteSetting } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const SettingsManagement = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await apiService.settings.getAll();
      setSettings(data);
    } catch (error) {
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setEditing({ ...editing, [key]: value });
  };

  const handleSave = async (key: string) => {
    try {
      const setting = settings.find((s) => s.setting_key === key);
      if (!setting) return;

      let value = editing[key];
      if (setting.setting_type === 'number') {
        value = parseFloat(value).toString();
      } else if (setting.setting_type === 'boolean') {
        value = (value === 'true' || value === '1').toString();
      }

      await apiService.settings.update(key, value);
      toast.success('Setting updated');
      setEditing({ ...editing, [key]: '' });
      fetchSettings();
    } catch (error) {
      toast.error('Failed to save setting');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Site Settings</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          Manage global site settings and configuration values
        </p>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => (
          <div key={setting.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <Label className="text-base font-semibold">{setting.setting_key}</Label>
                {setting.description && (
                  <p className="text-sm text-muted-foreground mt-1">{setting.description}</p>
                )}
              </div>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                {setting.setting_type}
              </span>
            </div>

            <div className="flex gap-2">
              {setting.setting_type === 'boolean' ? (
                <select
                  value={editing[setting.setting_key] || setting.setting_value}
                  onChange={(e) => handleInputChange(setting.setting_key, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md"
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              ) : (
                <Input
                  type={setting.setting_type === 'number' ? 'number' : 'text'}
                  value={editing[setting.setting_key] || setting.setting_value}
                  onChange={(e) => handleInputChange(setting.setting_key, e.target.value)}
                  placeholder={setting.setting_value}
                />
              )}
              <Button
                onClick={() => handleSave(setting.setting_key)}
                size="sm"
              >
                Save
              </Button>
            </div>
          </div>
        ))}
      </div>

      {settings.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No settings found
        </div>
      )}
    </div>
  );
};

export default SettingsManagement;
