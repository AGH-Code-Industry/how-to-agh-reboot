import { BuildingEntry } from '@prisma/client';
import { buildingEntryDOtoDTO, buildingDOtoDTO, BuildingDO } from '@/types/Building';

describe('Building Types', () => {
  describe('buildingEntryDOtoDTO', () => {
    it('should correctly transform BuildingEntry to DTO', () => {
      const mockBuildingEntry: BuildingEntry = {
        building_entry_id: 1,
        building_id: 1,
        map_longitude: 19.912345,
        map_latitude: 50.06789,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = buildingEntryDOtoDTO(mockBuildingEntry);

      expect(result).toEqual({
        id: 1,
        longitude: 19.912345,
        latitude: 50.06789,
      });
    });
  });

  describe('buildingDOtoDTO', () => {
    it('should correctly transform Building with entries to DTO', () => {
      const mockBuilding: BuildingDO = {
        building_id: 1,
        name: 'D-17',
        created_at: new Date(),
        updated_at: new Date(),
        building_entries: [
          {
            building_entry_id: 1,
            building_id: 1,
            map_longitude: 19.912345,
            map_latitude: 50.06789,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            building_entry_id: 2,
            building_id: 1,
            map_longitude: 19.923456,
            map_latitude: 50.078901,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      };

      const result = buildingDOtoDTO(mockBuilding);

      expect(result).toEqual({
        id: 1,
        name: 'D-17',
        entries: [
          {
            id: 1,
            longitude: 19.912345,
            latitude: 50.06789,
          },
          {
            id: 2,
            longitude: 19.923456,
            latitude: 50.078901,
          },
        ],
      });
    });

    it('should handle building with no entries', () => {
      const mockBuilding: BuildingDO = {
        building_id: 1,
        name: 'D-17',
        created_at: new Date(),
        updated_at: new Date(),
        building_entries: [],
      };

      const result = buildingDOtoDTO(mockBuilding);

      expect(result).toEqual({
        id: 1,
        name: 'D-17',
        entries: [],
      });
    });
  });
});
