export interface PropertyFilters {
  city?: string | null;
  maxPrice?: number | null;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  type?: string | null;
  pool?: string | null;
  hasView?: string | null;
  maxHOA?: number | null;
}

export interface ListingRow {
  L_ListingID: string | null;
  L_DisplayId: string | null;
  L_Address: string | null;
  L_City: string | null;
  L_Zip: string | null;
  price: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  type: string | null;
  status: string | null;
  lat: number | null;
  lng: number | null;
  YearBuilt: number | null;
  AssociationFee: number | null;
  DaysOnMarket: number | null;
  PoolPrivateYN: string | null;
  ViewYN: string | null;
  FireplaceYN: string | null;
  PhotoCount: number | null;
  LA1_UserFirstName: string | null;
  LA1_UserLastName: string | null;
  LO1_OrganizationName: string | null;
}

export interface SoldRow {
  ListingKey: number | string | null;
  UnparsedAddress: string | null;
  City: string | null;
  CloseDate: string | null;
  ClosePrice: number | null;
  OriginalListPrice: number | null;
  ListPrice: number | null;
  DaysOnMarket: number | null;
  BedroomsTotal: number | null;
  BathroomsTotalInteger: number | null;
  LivingArea: number | null;
  PropertyType: string | null;
  PropertySubType: string | null;
  YearBuilt: number | null;
  ListAgentFullName: string | null;
  ListOfficeName: string | null;
  BuyerOfficeName: string | null;
}