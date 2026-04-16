export interface PCComponent {
  id: string;
  category: 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case' | 'cooling';
  name: string;
  brand: string;
  specs: string[];
  price: number;
  image: string;
  performance?: number;
}

export const pcComponents: PCComponent[] = [
  // CPUs
  {
    id: 'cpu-1',
    category: 'cpu',
    name: 'AMD Ryzen 9 7950X',
    brand: 'AMD',
    specs: ['16 ядер / 32 потока', '5.7 GHz Boost', 'AM5'],
    price: 12500000,
    image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=300&fit=crop',
    performance: 95,
  },
  {
    id: 'cpu-2',
    category: 'cpu',
    name: 'Intel Core i9-14900K',
    brand: 'Intel',
    specs: ['24 ядра / 32 потока', '6.0 GHz Boost', 'LGA1700'],
    price: 13200000,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop',
    performance: 97,
  },
  {
    id: 'cpu-3',
    category: 'cpu',
    name: 'AMD Ryzen 7 7800X3D',
    brand: 'AMD',
    specs: ['8 ядер / 16 потоков', '5.0 GHz Boost', '3D V-Cache'],
    price: 9800000,
    image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=300&fit=crop',
    performance: 92,
  },

  // GPUs
  {
    id: 'gpu-1',
    category: 'gpu',
    name: 'NVIDIA RTX 4090',
    brand: 'NVIDIA',
    specs: ['24GB GDDR6X', '450W TDP', 'DLSS 3.0'],
    price: 42000000,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&h=300&fit=crop',
    performance: 100,
  },
  {
    id: 'gpu-2',
    category: 'gpu',
    name: 'AMD Radeon RX 7900 XTX',
    brand: 'AMD',
    specs: ['24GB GDDR6', '355W TDP', 'FSR 3.0'],
    price: 28000000,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop',
    performance: 90,
  },
  {
    id: 'gpu-3',
    category: 'gpu',
    name: 'NVIDIA RTX 4070 Ti',
    brand: 'NVIDIA',
    specs: ['12GB GDDR6X', '285W TDP', 'DLSS 3.0'],
    price: 21000000,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&h=300&fit=crop',
    performance: 85,
  },

  // Motherboards
  {
    id: 'mb-1',
    category: 'motherboard',
    name: 'ASUS ROG Maximus Z790 HERO',
    brand: 'ASUS',
    specs: ['LGA1700', 'DDR5', 'PCIe 5.0'],
    price: 15000000,
    image: 'https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=400&h=300&fit=crop',
    performance: 95,
  },
  {
    id: 'mb-2',
    category: 'motherboard',
    name: 'MSI MAG X670E TOMAHAWK',
    brand: 'MSI',
    specs: ['AM5', 'DDR5', 'PCIe 5.0'],
    price: 11500000,
    image: 'https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=400&h=300&fit=crop',
    performance: 90,
  },

  // RAM
  {
    id: 'ram-1',
    category: 'ram',
    name: 'G.SKILL Trident Z5 RGB',
    brand: 'G.SKILL',
    specs: ['32GB (2x16GB)', 'DDR5-6000', 'CL30'],
    price: 4500000,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=300&fit=crop',
    performance: 90,
  },
  {
    id: 'ram-2',
    category: 'ram',
    name: 'Corsair Dominator Platinum',
    brand: 'Corsair',
    specs: ['64GB (2x32GB)', 'DDR5-5600', 'CL36'],
    price: 8200000,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=300&fit=crop',
    performance: 95,
  },

  // Storage
  {
    id: 'storage-1',
    category: 'storage',
    name: 'Samsung 990 PRO',
    brand: 'Samsung',
    specs: ['2TB NVMe', '7450 MB/s Read', 'PCIe 4.0'],
    price: 5000000,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop',
    performance: 95,
  },
  {
    id: 'storage-2',
    category: 'storage',
    name: 'WD Black SN850X',
    brand: 'Western Digital',
    specs: ['4TB NVMe', '7300 MB/s Read', 'PCIe 4.0'],
    price: 9500000,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop',
    performance: 93,
  },

  // PSU
  {
    id: 'psu-1',
    category: 'psu',
    name: 'Corsair HX1500i',
    brand: 'Corsair',
    specs: ['1500W', '80+ Platinum', 'Modular'],
    price: 7500000,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop',
    performance: 95,
  },
  {
    id: 'psu-2',
    category: 'psu',
    name: 'ASUS ROG Thor 1200W',
    brand: 'ASUS',
    specs: ['1200W', '80+ Platinum', 'OLED Display'],
    price: 6800000,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop',
    performance: 92,
  },

  // Cases
  {
    id: 'case-1',
    category: 'case',
    name: 'Lian Li O11 Dynamic EVO',
    brand: 'Lian Li',
    specs: ['E-ATX', 'Tempered Glass', 'RGB'],
    price: 4200000,
    image: 'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=400&h=300&fit=crop',
    performance: 90,
  },
  {
    id: 'case-2',
    category: 'case',
    name: 'Fractal Design Torrent',
    brand: 'Fractal Design',
    specs: ['E-ATX', 'High Airflow', 'RGB'],
    price: 3800000,
    image: 'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=400&h=300&fit=crop',
    performance: 88,
  },

  // Cooling
  {
    id: 'cooling-1',
    category: 'cooling',
    name: 'NZXT Kraken Z73 RGB',
    brand: 'NZXT',
    specs: ['360mm AIO', 'LCD Display', 'RGB'],
    price: 6500000,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=300&fit=crop',
    performance: 95,
  },
  {
    id: 'cooling-2',
    category: 'cooling',
    name: 'Arctic Liquid Freezer II',
    brand: 'Arctic',
    specs: ['280mm AIO', 'Silent', 'VRM Fan'],
    price: 3500000,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=300&fit=crop',
    performance: 88,
  },
];

export function getComponentsByCategory(category: PCComponent['category']) {
  return pcComponents.filter((c) => c.category === category);
}

export function getComponentById(id: string) {
  return pcComponents.find((c) => c.id === id);
}

export function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU').replace(/,/g, ' ');
}
