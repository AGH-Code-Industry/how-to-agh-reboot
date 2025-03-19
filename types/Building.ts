import { Building, BuildingEntry } from '@prisma/client';

export type BuildingDO = Building & { building_entries: BuildingEntry[] };

export type BuildingEntryDTO = {
  id: BuildingEntry['building_entry_id'];
  longitude: BuildingEntry['map_longitude'];
  latitude: BuildingEntry['map_latitude'];
  createdAt: BuildingEntry['created_at'];
  updatedAt: BuildingEntry['updated_at'];
};
export const buildingEntryDOtoDTO = (entry: BuildingEntry): BuildingEntryDTO => ({
  id: entry.building_entry_id,
  longitude: entry.map_longitude,
  latitude: entry.map_latitude,
  createdAt: entry.created_at,
  updatedAt: entry.updated_at,
});

export type BuildingDTO = {
  id: BuildingDO['building_id'];
  name: BuildingDO['name'];
  entries: BuildingEntryDTO[];
  createdAt: BuildingDO['created_at'];
  updatedAt: BuildingDO['updated_at'];
};

export const buildingDOtoDTO = (building: BuildingDO): BuildingDTO => ({
  id: building.building_id,
  name: building.name,
  entries: building.building_entries.map(buildingEntryDOtoDTO),
  createdAt: building.created_at,
  updatedAt: building.updated_at,
});
