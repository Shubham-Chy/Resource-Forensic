
import { Resource, ResourceCategory } from '../types';

const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'sw-1',
    name: 'After Effects Pro Kit',
    category: ResourceCategory.SOFTWARE,
    description: 'A pre-configured setup for high-end motion graphics with essential pre-installed scripts.',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
    downloadUrl: '#',
    youtubeId: 'dQw4w9WgXcQ',
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'pl-1',
    name: 'Sapphire Revived',
    category: ResourceCategory.PLUGINS,
    description: 'The legendary VFX plugin pack with custom presets for modern editing styles.',
    thumbnail: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1200',
    downloadUrl: '#',
    youtubeId: '9bZkp7q19f0',
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'ac-1',
    name: 'Jujutsu Kaisen 4K Raw',
    category: ResourceCategory.ANIME_CLIPS,
    description: 'Lossless 4K clips from the Shibuya Incident arc, perfectly synced for AMVs.',
    thumbnail: 'https://images.unsplash.com/photo-1578632738980-23055509e3e1?auto=format&fit=crop&q=80&w=1200',
    downloadUrl: '#',
    driveUrl: 'https://drive.google.com',
    getKeyUrl: 'https://example.com/get-key',
    createdAt: Date.now() - 86400000
  }
];

const STORAGE_KEY = 'resource_forensic_vault';

export const getResources = (): Resource[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESOURCES));
    return INITIAL_RESOURCES;
  }
  return JSON.parse(stored);
};

export const saveResource = (resource: Resource) => {
  const resources = getResources();
  const updated = [resource, ...resources];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const updateResource = (updatedResource: Resource) => {
  const resources = getResources();
  const updated = resources.map(r => r.id === updatedResource.id ? updatedResource : r);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteResource = (id: string) => {
  const resources = getResources();
  const updated = resources.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
