import { Game, GameStudio } from '../shared/types'

export const games : Game[] = [
  {
    id: 123,
    title: "Skyrim",
    description: "The game is set 200 years after the events of Oblivion and takes place in Skyrim, the northernmost province of Tamriel, a continent on the planet Nirn. Its main story focuses on the player character, the Dragonborn, on their quest to defeat Alduin the World-Eater, a dragon prophesied to destroy the world. Throughout the game, the player completes quests and develops the character by improving skills. The game continues the open world tradition of its predecessors by allowing the player to travel to discovered locations in the game world at any time, and to ignore or postpone the main storyline indefinitely.",
    mature: true
  },
  {
    id: 456,
    title: "Factorio",
    description: "Factorio is a construction and management simulation game developed and published by Czech studio Wube Software. The game follows an engineer who crash-lands on an alien planet and must harvest resources and create automated industry to build a rocket; players can continue the game after achieving the end goal. There are both single-player and multiplayer modes as well as eight additional game scenarios.",
    mature: false
  },
  {
    id: 789,
    title: "Dragon Age: Inquisition",
    description: "Dragon Age: Inquisition is a 2014 action role-playing video game developed by BioWare and published by Electronic Arts. The third major game in the Dragon Age franchise, Inquisition is the sequel to Dragon Age II (2011). The story follows a player character known as the Inquisitor on a journey to settle the civil unrest in the continent of Thedas and close a mysterious tear in the sky called the 'Breach', which is unleashing dangerous demons upon the world. Dragon Age: Inquisition's gameplay is similar to its predecessors, although it consists of several semi-open worlds for players to explore. Players control the Inquisitor or their companions mainly from a third-person perspective, although a traditional role-playing game top-down camera angle is also available.",
    mature: true
  }
]

export const gameStudios : GameStudio[] = [
  {
    gameId: 123,
    studioName: "Bethesda Game Studios",
    primaryGenre: "Action"
  },
  {
    gameId: 123,
    studioName: "Obsidian Entertainment",
    primaryGenre: "FPS"
  },
  {
    gameId: 456,
    studioName: "Wube Software",
    primaryGenre: "Strategy"
  },
  {
    gameId: 789,
    studioName: "Bioware",
    primaryGenre: "RPG"
  }
]
