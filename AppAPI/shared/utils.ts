import { marshall } from "@aws-sdk/util-dynamodb";
import { Game, GameStudio } from "./types";

type Entity = Game | GameStudio;
export const generateItem = (entity: Entity) => {
  return {
    PutRequest: {
      Item: marshall(entity),
    },
  };
};

export const generateBatch = (data: Entity[]) => {
  return data.map((e) => {
    return generateItem(e);
  });
};
