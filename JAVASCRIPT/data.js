

/*
   Product data array
 */

'use strict';

const PRODUCTS = [
  {
    id: 1, name: 'Premium Salone Rice',
    category: 'produce', emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    price: 180, oldPrice: 210,
    seller: 'Mamie Kadie Farm', location: 'Bo District',
    badge: 'HOT', rating: 4.8, reviews: 124,
  },
  {
    id: 2, name: 'Fresh Atlantic Barracuda',
    category: 'fish', 
    image: 'https://images.unsplash.com/photo-1567087978459-8a8eeac7bc75?w=400&h=300&fit=crop',
    price: 85, oldPrice: null,
    seller: 'Kola Fishing Co.', location: 'Freetown Docks',
    badge: 'FRESH', rating: 4.9, reviews: 88,
  },
  {
    id: 3, name: 'Hand-dyed Gara Fabric (6 yds)',
    category: 'fashion', 
    image: './IMAGES/Gara.jpeg?w=400&h=300&fit=crop',
    price: 240, oldPrice: 280,
    seller: 'Fatmata Designs', location: 'Kenema',
    badge: 'NEW', rating: 4.7, reviews: 56,
  },
  {
    id: 4, name: 'Red Palm Oil — 5 Litres',
    category: 'spices', 
    image: './IMAGES/palm oil.jpeg?w=400&h=300&fit=crop',
    price: 95, oldPrice: null,
    seller: 'Salone Organics', location: 'Moyamba',
    badge: null, rating: 4.6, reviews: 203,
  },
  {
    id: 5, name: 'Handwoven Country Basket',
    category: 'crafts', 
    image: 'https://images.unsplash.com/photo-1758784881676-68e4b9e26da2?w=400&h=300&fit=crop',
    price: 55, oldPrice: 70,
    seller: 'Tonkolili Weavers', location: 'Tonkolili',
    badge: null, rating: 4.8, reviews: 41,
  },
  {
    id: 6, name: 'Fresh Cassava (50 kg)',
    category: 'produce', 
    image: 'https://images.unsplash.com/photo-1717152456821-d9718440556c?w=400&h=300&fit=crop',
    price: 60, oldPrice: null,
    seller: 'Conteh Family Farm', location: 'Port Loko',
    badge: null, rating: 4.5, reviews: 77,
  },
  {
    id: 7, name: 'Smoked Bonga Fish (1 kg)',
    category: 'fish', 
    image: 'https://images.unsplash.com/photo-1695134104521-173f156a05ed?w=400&h=300&fit=crop',
    price: 45, oldPrice: 55,
    seller: 'Madam Sia Traders', location: 'Bonthe Island',
    badge: 'HOT', rating: 4.7, reviews: 139,
  },
  {
    id: 8, name: 'Traditional Country Cloth',
    category: 'fashion', 
    image: './IMAGES/Traditional cloth.jpeg?w=400&h=300&fit=crop',
    price: 320, oldPrice: null,
    seller: 'Krio Weavers Guild', location: 'Freetown',
    badge: 'NEW', rating: 4.9, reviews: 29,
  },
  {
    id: 9, name: 'Ground Pepper — 500g',
    category: 'spices', 
    image: './IMAGES/Grounded papper.jpeg?w=400&h=300&fit=crop',
    price: 22, oldPrice: null,
    seller: 'Mama Fanta Spices', location: 'Bo Market',
    badge: null, rating: 4.4, reviews: 310,
  },
  {
    id: 10, name: 'Carved Wooden Mask',
    category: 'crafts',
    image: './IMAGES/Carved African Tribal Wooden Head Sculpture – Ethnic Mask-.jpeg?w=400&h=300&fit=crop',
    price: 130, oldPrice: 160,
    seller: 'Kailahun Artisans', location: 'Kailahun',
    badge: null, rating: 4.6, reviews: 22,
  },
  {
    id: 11, name: 'Sweet Potato (25 kg sack)',
    category: 'produce', 
    image: 'https://images.unsplash.com/photo-1730815048561-45df6f7f331d?w=400&h=300&fit=crop',
    price: 48, oldPrice: null,
    seller: 'Green Valley Farms', location: 'Pujehun',
    badge: 'FRESH', rating: 4.5, reviews: 65,
  },
  {
    id: 12, name: 'Fresh Tilapia (5 kg)',
    category: 'fish', 
    image: 'https://images.unsplash.com/photo-1623260858519-f910440955e5?w=400&h=300&fit=crop',
    price: 110, oldPrice: 130,
    seller: 'Lake Sonfon Fishers', location: 'Tonkolili',
    badge: null, rating: 4.8, reviews: 47,
  },
];