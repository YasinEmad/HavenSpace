'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PropertyCard from './PropertyCard';
import { Empty } from '@/components/ui/empty';

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  imageUrls: string[];
}

interface PropertyGridProps {
  searchCity: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  hasSearched: boolean;
}

export default function PropertyGrid({
  searchCity,
  minPrice,
  maxPrice,
  propertyType,
  hasSearched,
}: PropertyGridProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hasSearched) {
      fetchFeaturedProperties();
    } else {
      fetchSearchResults();
    }
  }, [searchCity, minPrice, maxPrice, propertyType, hasSearched]);

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/properties?status=available&_limit=6`);
      const data = await res.json();
      setProperties(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: 'available',
      });

      if (searchCity) params.append('city', searchCity);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (propertyType) params.append('propertyType', propertyType);

      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();
      setProperties(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch search results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[#231e1b] animate-pulse h-80 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive text-center py-8">{error}</div>;
  }

  if (properties.length === 0) {
    return (
      <Empty
        icon="House"
        className="text-[#231e1b] bg-[#231e1b]/10"
        title={hasSearched ? 'No properties found' : 'No featured properties'}
        description={
          hasSearched
            ? 'Try adjusting your search criteria'
            : 'Check back soon for more listings'
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Link key={property._id} href={`/properties/${property._id}`}>
          <PropertyCard property={property} />
        </Link>
      ))}
    </div>
  );
}
