export interface GalleryItem {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'gallery-1',
    title: 'Workspace light before a late build session',
    date: '2026-03-02',
    location: 'Home office',
    description: 'A quiet desk, warm light, and the kind of setup where product decisions tend to get cleaner.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'gallery-2',
    title: 'Street walk after closing the laptop',
    date: '2026-02-21',
    location: 'Evening city',
    description: 'A reset walk that usually turns vague ideas into clearer product decisions.',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'gallery-3',
    title: 'Notebook page full of rough product cuts',
    date: '2026-02-12',
    location: 'Desk',
    description: 'Most final interfaces start as blunt notes about what should be removed, not added.',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'gallery-4',
    title: 'Weekend coffee and architecture sketches',
    date: '2026-01-28',
    location: 'Cafe corner',
    description: 'A slower environment helps when the problem is structure rather than raw implementation speed.',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1400&auto=format&fit=crop',
  },
];
