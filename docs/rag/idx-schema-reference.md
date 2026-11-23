# IDX Exchange Database Schema Reference

## Table: california_sold

The `california_sold` table stores historical property sale records. It contains 46 columns covering listing identifiers, sale prices, property characteristics, location, agents, and amenities.

### Listing and Sale Information

| Column | Data Type | Description |
|---|---|---|
| ListingKey | bigint | Listing identifier |
| OriginalListPrice | double | Original listing price |
| ListPrice | double | Listing price |
| ClosePrice | double | Final sale price |
| CloseDate | varchar(255) | Recorded closing date |
| PurchaseContractDate | varchar(255) | Date purchase contract was recorded |
| ListingContractDate | varchar(255) | Date listing contract was recorded |
| DaysOnMarket | bigint | Days the property spent on the market |
| PropertyType | varchar(255) | General property classification |
| PropertySubType | varchar(255) | More specific property classification |

### Property Characteristics

| Column | Data Type | Description |
|---|---|---|
| BedroomsTotal | double | Total bedrooms |
| BathroomsTotalInteger | double | Total bathrooms |
| LivingArea | double | Property living area |
| YearBuilt | double | Year the property was built |
| Stories | double | Number of stories |
| Levels | varchar(255) | Property levels |
| MainLevelBedrooms | double | Bedrooms on the main level |
| LotSizeAcres | double | Lot size in acres |
| LotSizeSquareFeet | double | Lot size in square feet |
| GarageSpaces | double | Number of garage spaces |
| ParkingTotal | double | Total parking spaces |
| AttachedGarageYN | varchar(255) | Indicates whether an attached garage exists |
| BasementYN | varchar(255) | Indicates whether a basement exists |
| FireplaceYN | varchar(255) | Indicates whether a fireplace exists |
| PoolPrivateYN | varchar(255) | Indicates whether a private pool exists |
| WaterfrontYN | varchar(255) | Indicates whether the property is waterfront |
| ViewYN | varchar(255) | Indicates whether the property has a view |
| NewConstructionYN | varchar(255) | Indicates whether the property is new construction |

### Location Information

| Column | Data Type | Description |
|---|---|---|
| UnparsedAddress | varchar(255) | Full property address as recorded |
| City | varchar(255) | Property city |
| StateOrProvince | varchar(255) | State or province |
| PostalCode | varchar(255) | Postal code |
| Latitude | double | Geographic latitude |
| Longitude | double | Geographic longitude |
| SubdivisionName | varchar(255) | Property subdivision |

### Agent and Office Information

| Column | Data Type | Description |
|---|---|---|
| ListAgentFirstName | varchar(255) | Listing agent first name |
| ListAgentLastName | varchar(255) | Listing agent last name |
| ListAgentFullName | varchar(255) | Listing agent full name |
| BuyerAgentFirstName | varchar(255) | Buyer agent first name |
| BuyerAgentLastName | varchar(255) | Buyer agent last name |
| ListOfficeName | varchar(255) | Listing brokerage or office |
| BuyerOfficeName | varchar(255) | Buyer brokerage or office |

### School Information

| Column | Data Type | Description |
|---|---|---|
| MiddleOrJuniorSchool | varchar(255) | Middle or junior high school |
| HighSchool | varchar(255) | High school |
| HighSchoolDistrict | varchar(255) | High school district |

### Additional Information

| Column | Data Type | Description |
|---|---|---|
| AssociationFee | double | Property association fee |

## Important Notes

- The table contains historical sold-property records.
- `ClosePrice`, `ListPrice`, `LivingArea`, and `DaysOnMarket` are used by the market analytics service.
- `CloseDate` is stored as `varchar(255)`, not a native SQL date type.
- Several fields ending in `YN` represent yes/no property attributes, but are stored as `varchar(255)`.
- The schema was obtained directly using MySQL `DESCRIBE california_sold`.

**Source:** IDX Exchange MySQL database, `california_sold` table.

## Table: rets_property

The `rets_property` table stores active and historical MLS listing records, including property details, listing information, agent information, and property features. It contains legacy MLS fields alongside newer RESO-style fields.

### Core Legacy MLS Fields

| Column | Data Type | Description |
|---|---|---|
| L_ListingID | varchar(255) | Listing identifier |
| L_DisplayId | varchar(255) | Display listing identifier |
| L_Address | varchar(100) | Property address |
| L_Zip | varchar(20) | ZIP code |
| L_City | varchar(50) | Property city |
| L_State | varchar(50) | Property state |
| L_Class | varchar(50) | Listing class |
| L_Type_ | varchar(50) | Property type |
| L_SystemPrice | int | System listing price |
| L_Status | varchar(50) | Listing status |
| L_Remarks | mediumtext | Property description |
| L_Keyword1 | varchar(50) | Legacy MLS keyword field |
| L_Keyword2 | int | Legacy MLS keyword field |
| L_Keyword5 | int | Legacy MLS keyword field |
| L_Keyword7 | varchar(50) | Legacy MLS keyword field |
| LM_Dec_3 | decimal(4,1) | Legacy MLS decimal field |
| LM_Int2_3 | int | Legacy MLS integer field |
| LM_char10_70 | varchar(50) | Legacy MLS character field |

### Additional Important Fields

| Column | Data Type | Description |
|---|---|---|
| YearBuilt | int | Year the property was built |
| DaysOnMarket | int | Days on market |
| LivingAreaUnits | varchar(16) | Living area measurement units |
| LivingAreaSource | varchar(64) | Source of living area measurement |
| LotSizeUnits | varchar(32) | Lot size measurement units |
| LotSizeAcres | decimal(10,4) | Lot size in acres |
| LotSizeSquareFeet | decimal(14,2) | Lot size in square feet |
| StandardStatus | varchar(32) | Standardized listing status |
| PropertySubTypeAdditional | varchar(128) | Additional property subtype |
| ListAgentFullName | varchar(128) | Listing agent full name |
| ListOfficeEmail | varchar(191) | Listing office email |
| ListAgentEmail | varchar(191) | Listing agent email |
| Latitude | decimal(18,15) | Listing latitude (stored as LMD_MP_Latitude) |
| Longitude | decimal(19,15) | Listing longitude (stored as LMD_MP_Longitude) |

### RESO-Style Property Fields

The table also contains fields such as `BedroomsTotal`-related property information where available, `ViewYN`, `PoolPrivateYN`, `AttachedGarageYN`, `WaterfrontYN`, `PropertySubTypeAdditional`, `ArchitecturalStyle`, `Heating`, `Cooling`, `InteriorFeatures`, and `CommunityFeatures`.

### Important Notes

- `rets_property` is the active listing data source used by the property search and recommendation services.
- `L_SystemPrice`, `L_Keyword2`, `LM_Dec_3`, and `LM_Int2_3` are legacy MLS fields.
- Legacy field names should not be assumed to have standard RESO definitions without additional metadata.
- The schema was obtained directly using MySQL `DESCRIBE rets_property`.

**Source:** IDX Exchange MySQL database, `rets_property` table.