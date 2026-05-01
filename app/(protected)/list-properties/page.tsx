"use client"

import EmptyPropertyState from "@/components/property-cm/list-pr/empty-property";
import PropertyCard from "@/components/property-cm/property-card";
import PropertySkeletonGrid from "@/components/property-cm/property-loder-grid";
import { useGetMyProperties } from "@/app/apis/mutations/use-property/use-get-my-properties";

export default function ListPropertiesPage() {
  const {  data, isLoading, error} = useGetMyProperties();
 

  const properties = data?.data ?? [];

  if (isLoading) {
    return <PropertySkeletonGrid />;
  }
  
  if (error) {
    return (
      console.log((error as Error).message)
    );
  }

  if (properties.length === 0) {
    return <EmptyPropertyState />;
  }

  return (
    <div
      className="
      grid
      grid-cols-1
      sm:grid-cols-2
      xl:grid-cols-4
      gap-6
      md:gap-8
      p-4 sm:p-6
      mt-15
    "
    >
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          id={property._id}
          title={property.title}
          price={property.price}
          status={property.status as "For_Rent" | "For_Sale" | "Sold"}
          bedrooms={property.bathrooms}
          bathrooms={property.bathrooms}
          sqft={property.size}
          image={property.images[5]?.url}
        />
      ))}
    </div>
  );
}
