import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface AddNewCommentData {
  quest_insert: Quest_Key;
}

export interface Campaign_Key {
  id: UUIDString;
  __typename?: 'Campaign_Key';
}

export interface CreateCampaignData {
  campaign_insert: Campaign_Key;
}

export interface CreateCampaignVariables {
  title: string;
  description: string;
}

export interface CreateQuestData {
  quest_insert: Quest_Key;
}

export interface CreateQuestVariables {
  name: string;
  synopsis: string;
  difficultyId: UUIDString;
  interestId: UUIDString;
  questTypeId: UUIDString;
  startLocationId: UUIDString;
}

export interface DeleteQuestData {
  quest_delete?: Quest_Key | null;
}

export interface DeleteQuestVariables {
  id: UUIDString;
}

export interface Difficulty_Key {
  id: UUIDString;
  __typename?: 'Difficulty_Key';
}

export interface GetAllLocationsData {
  locations: ({
    id: UUIDString;
    name?: string | null;
    latitude: number;
    longitude: number;
    description?: string | null;
    realWorldInspiration?: string | null;
  } & Location_Key)[];
}

export interface GetPublicQuestsData {
  quests: ({
    id: UUIDString;
    name: string;
    synopsis: string;
    difficulty: {
      name: string;
    };
      interest: {
        name: string;
      };
        questType: {
          name: string;
        };
          startLocation: {
            name?: string | null;
          };
  } & Quest_Key)[];
}

export interface GetQuestData {
  quest?: {
    id: UUIDString;
    name: string;
    synopsis: string;
    difficulty: {
      name: string;
    };
      interest: {
        name: string;
      };
        questType: {
          name: string;
        };
          startLocation: {
            name?: string | null;
          };
            itinerary?: string | null;
            reward?: string | null;
  } & Quest_Key;
}

export interface GetQuestVariables {
  id: UUIDString;
}

export interface Interest_Key {
  id: UUIDString;
  __typename?: 'Interest_Key';
}

export interface ListCampaignsData {
  campaigns: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    createdAt: TimestampString;
  } & Campaign_Key)[];
}

export interface LocationDetailsData {
  locations: ({
    id: UUIDString;
    name?: string | null;
    description?: string | null;
    latitude: number;
    longitude: number;
    realWorldInspiration?: string | null;
    quests_on_destination: ({
      id: UUIDString;
      name: string;
    } & Quest_Key)[];
      quests_on_startLocation: ({
        id: UUIDString;
        name: string;
      } & Quest_Key)[];
  } & Location_Key)[];
}

export interface Location_Key {
  id: UUIDString;
  __typename?: 'Location_Key';
}

export interface QuestReviewsData {
  quests: ({
    id: UUIDString;
    name: string;
    synopsis: string;
  } & Quest_Key)[];
    locations: ({
      id: UUIDString;
      name?: string | null;
      description?: string | null;
    } & Location_Key)[];
}

export interface QuestType_Key {
  id: UUIDString;
  __typename?: 'QuestType_Key';
}

export interface Quest_Key {
  id: UUIDString;
  __typename?: 'Quest_Key';
}

export interface UpdateQuestData {
  quest_update?: Quest_Key | null;
}

export interface UpdateQuestVariables {
  id: UUIDString;
  name?: string | null;
  synopsis?: string | null;
  difficultyId?: UUIDString | null;
  interestId?: UUIDString | null;
  questTypeId?: UUIDString | null;
  startLocationId?: UUIDString | null;
  itinerary?: string | null;
  reward?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateQuestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQuestVariables): MutationRef<CreateQuestData, CreateQuestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateQuestVariables): MutationRef<CreateQuestData, CreateQuestVariables>;
  operationName: string;
}
export const createQuestRef: CreateQuestRef;

export function createQuest(vars: CreateQuestVariables): MutationPromise<CreateQuestData, CreateQuestVariables>;
export function createQuest(dc: DataConnect, vars: CreateQuestVariables): MutationPromise<CreateQuestData, CreateQuestVariables>;

interface GetPublicQuestsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPublicQuestsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetPublicQuestsData, undefined>;
  operationName: string;
}
export const getPublicQuestsRef: GetPublicQuestsRef;

export function getPublicQuests(): QueryPromise<GetPublicQuestsData, undefined>;
export function getPublicQuests(dc: DataConnect): QueryPromise<GetPublicQuestsData, undefined>;

interface GetQuestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuestVariables): QueryRef<GetQuestData, GetQuestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetQuestVariables): QueryRef<GetQuestData, GetQuestVariables>;
  operationName: string;
}
export const getQuestRef: GetQuestRef;

export function getQuest(vars: GetQuestVariables): QueryPromise<GetQuestData, GetQuestVariables>;
export function getQuest(dc: DataConnect, vars: GetQuestVariables): QueryPromise<GetQuestData, GetQuestVariables>;

interface UpdateQuestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQuestVariables): MutationRef<UpdateQuestData, UpdateQuestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateQuestVariables): MutationRef<UpdateQuestData, UpdateQuestVariables>;
  operationName: string;
}
export const updateQuestRef: UpdateQuestRef;

export function updateQuest(vars: UpdateQuestVariables): MutationPromise<UpdateQuestData, UpdateQuestVariables>;
export function updateQuest(dc: DataConnect, vars: UpdateQuestVariables): MutationPromise<UpdateQuestData, UpdateQuestVariables>;

interface DeleteQuestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuestVariables): MutationRef<DeleteQuestData, DeleteQuestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteQuestVariables): MutationRef<DeleteQuestData, DeleteQuestVariables>;
  operationName: string;
}
export const deleteQuestRef: DeleteQuestRef;

export function deleteQuest(vars: DeleteQuestVariables): MutationPromise<DeleteQuestData, DeleteQuestVariables>;
export function deleteQuest(dc: DataConnect, vars: DeleteQuestVariables): MutationPromise<DeleteQuestData, DeleteQuestVariables>;

interface ListCampaignsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCampaignsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCampaignsData, undefined>;
  operationName: string;
}
export const listCampaignsRef: ListCampaignsRef;

export function listCampaigns(): QueryPromise<ListCampaignsData, undefined>;
export function listCampaigns(dc: DataConnect): QueryPromise<ListCampaignsData, undefined>;

interface CreateCampaignRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCampaignVariables): MutationRef<CreateCampaignData, CreateCampaignVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCampaignVariables): MutationRef<CreateCampaignData, CreateCampaignVariables>;
  operationName: string;
}
export const createCampaignRef: CreateCampaignRef;

export function createCampaign(vars: CreateCampaignVariables): MutationPromise<CreateCampaignData, CreateCampaignVariables>;
export function createCampaign(dc: DataConnect, vars: CreateCampaignVariables): MutationPromise<CreateCampaignData, CreateCampaignVariables>;

interface LocationDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<LocationDetailsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<LocationDetailsData, undefined>;
  operationName: string;
}
export const locationDetailsRef: LocationDetailsRef;

export function locationDetails(): QueryPromise<LocationDetailsData, undefined>;
export function locationDetails(dc: DataConnect): QueryPromise<LocationDetailsData, undefined>;

interface GetAllLocationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAllLocationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetAllLocationsData, undefined>;
  operationName: string;
}
export const getAllLocationsRef: GetAllLocationsRef;

export function getAllLocations(): QueryPromise<GetAllLocationsData, undefined>;
export function getAllLocations(dc: DataConnect): QueryPromise<GetAllLocationsData, undefined>;

interface AddNewCommentRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<AddNewCommentData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<AddNewCommentData, undefined>;
  operationName: string;
}
export const addNewCommentRef: AddNewCommentRef;

export function addNewComment(): MutationPromise<AddNewCommentData, undefined>;
export function addNewComment(dc: DataConnect): MutationPromise<AddNewCommentData, undefined>;

interface QuestReviewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<QuestReviewsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<QuestReviewsData, undefined>;
  operationName: string;
}
export const questReviewsRef: QuestReviewsRef;

export function questReviews(): QueryPromise<QuestReviewsData, undefined>;
export function questReviews(dc: DataConnect): QueryPromise<QuestReviewsData, undefined>;

