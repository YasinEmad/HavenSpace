'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Square, MapPin } from 'lucide-react';

interface PropertyCardProps {
  property: {
    _id: string;
    title: string;
    price: number;
    address: string;
    city: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    propertyType: string;
    imageUrls: string[];
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.imageUrls?.[0] || '/placeholder-property.jpg';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-[#231e1b]">
      <div className="relative h-64 bg-[#231e1b]">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-property.jpg';
          }}
        />
        <Badge className="absolute top-4 right-4 bg-[#231e1b] text-primary-foreground capitalize">
          {property.propertyType}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-[#ffffff] mb-2 line-clamp-2">
          {property.title}
        </h3>

        <div className="flex items-center text-sm text-[#dddddd] mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">
            {property.city}, {property.address}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-t border-b border-border">
          <div className="text-center">
            <div className="flex items-center justify-center text-[#231e1b] mb-1">
              <Bed className="w-4 h-4" />
            </div>
            <p className="text-sm font-medium">{property.bedrooms}</p>
            <p className="text-xs text-[#dddddd]">Beds</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-[#231e1b] mb-1">
              <Bath className="w-4 h-4" />
            </div>
            <p className="text-sm font-medium">{property.bathrooms}</p>
            <p className="text-xs text-[#dddddd]">Baths</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-[#231e1b] mb-1">
              <Square className="w-4 h-4" />
            </div>
            <p className="text-sm font-medium">{(property.squareFeet / 1000).toFixed(1)}k</p>
            <p className="text-xs text-[#dddddd]">Sq Ft</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#231e1b]">
            ${(property.price / 1000000).toFixed(2)}M
          </span>
          <span className="text-sm text-[#dddddd]">per unit</span>
        </div>
      </CardContent>
    </Card>
  );
}
