import { Building, BuildingEntry } from '@prisma/client';

export type BuildingEntryDO = BuildingEntry;

export type BuildingEntryDTO = {
  id: BuildingEntryDO['building_entry_id'];
  longitude: BuildingEntryDO['map_longitude'];
  latitude: BuildingEntryDO['map_latitude'];
};

export const buildingEntryDOtoDTO = (entry: BuildingEntryDO): BuildingEntryDTO => ({
  id: entry.building_entry_id,
  longitude: entry.map_longitude,
  latitude: entry.map_latitude,
});

export type BuildingDO = Building & { building_entries: BuildingEntry[] };

export type BuildingDTO = {
  id: BuildingDO['building_id'];
  name: BuildingDO['name'];
  entries: {
    id: BuildingDO['building_entries'][number]['building_entry_id'];
    longitude: BuildingDO['building_entries'][number]['map_longitude'];
    latitude: BuildingDO['building_entries'][number]['map_latitude'];
  }[];
};

export const buildingDOtoDTO = (building: BuildingDO): BuildingDTO => ({
  id: building.building_id,
  name: building.name,
  entries: building.building_entries.map((entry) => ({
    id: entry.building_entry_id,
    longitude: entry.map_longitude,
    latitude: entry.map_latitude,
  })),
});
