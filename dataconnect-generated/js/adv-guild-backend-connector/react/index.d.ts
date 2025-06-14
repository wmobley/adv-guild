import { CreateQuestData, CreateQuestVariables, GetPublicQuestsData, GetQuestData, GetQuestVariables, UpdateQuestData, UpdateQuestVariables, DeleteQuestData, DeleteQuestVariables, ListCampaignsData, CreateCampaignData, CreateCampaignVariables, LocationDetailsData, GetAllLocationsData, AddNewCommentData, QuestReviewsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateQuest(options?: useDataConnectMutationOptions<CreateQuestData, FirebaseError, CreateQuestVariables>): UseDataConnectMutationResult<CreateQuestData, CreateQuestVariables>;
export function useCreateQuest(dc: DataConnect, options?: useDataConnectMutationOptions<CreateQuestData, FirebaseError, CreateQuestVariables>): UseDataConnectMutationResult<CreateQuestData, CreateQuestVariables>;

export function useGetPublicQuests(options?: useDataConnectQueryOptions<GetPublicQuestsData>): UseDataConnectQueryResult<GetPublicQuestsData, undefined>;
export function useGetPublicQuests(dc: DataConnect, options?: useDataConnectQueryOptions<GetPublicQuestsData>): UseDataConnectQueryResult<GetPublicQuestsData, undefined>;

export function useGetQuest(vars: GetQuestVariables, options?: useDataConnectQueryOptions<GetQuestData>): UseDataConnectQueryResult<GetQuestData, GetQuestVariables>;
export function useGetQuest(dc: DataConnect, vars: GetQuestVariables, options?: useDataConnectQueryOptions<GetQuestData>): UseDataConnectQueryResult<GetQuestData, GetQuestVariables>;

export function useUpdateQuest(options?: useDataConnectMutationOptions<UpdateQuestData, FirebaseError, UpdateQuestVariables>): UseDataConnectMutationResult<UpdateQuestData, UpdateQuestVariables>;
export function useUpdateQuest(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateQuestData, FirebaseError, UpdateQuestVariables>): UseDataConnectMutationResult<UpdateQuestData, UpdateQuestVariables>;

export function useDeleteQuest(options?: useDataConnectMutationOptions<DeleteQuestData, FirebaseError, DeleteQuestVariables>): UseDataConnectMutationResult<DeleteQuestData, DeleteQuestVariables>;
export function useDeleteQuest(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteQuestData, FirebaseError, DeleteQuestVariables>): UseDataConnectMutationResult<DeleteQuestData, DeleteQuestVariables>;

export function useListCampaigns(options?: useDataConnectQueryOptions<ListCampaignsData>): UseDataConnectQueryResult<ListCampaignsData, undefined>;
export function useListCampaigns(dc: DataConnect, options?: useDataConnectQueryOptions<ListCampaignsData>): UseDataConnectQueryResult<ListCampaignsData, undefined>;

export function useCreateCampaign(options?: useDataConnectMutationOptions<CreateCampaignData, FirebaseError, CreateCampaignVariables>): UseDataConnectMutationResult<CreateCampaignData, CreateCampaignVariables>;
export function useCreateCampaign(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCampaignData, FirebaseError, CreateCampaignVariables>): UseDataConnectMutationResult<CreateCampaignData, CreateCampaignVariables>;

export function useLocationDetails(options?: useDataConnectQueryOptions<LocationDetailsData>): UseDataConnectQueryResult<LocationDetailsData, undefined>;
export function useLocationDetails(dc: DataConnect, options?: useDataConnectQueryOptions<LocationDetailsData>): UseDataConnectQueryResult<LocationDetailsData, undefined>;

export function useGetAllLocations(options?: useDataConnectQueryOptions<GetAllLocationsData>): UseDataConnectQueryResult<GetAllLocationsData, undefined>;
export function useGetAllLocations(dc: DataConnect, options?: useDataConnectQueryOptions<GetAllLocationsData>): UseDataConnectQueryResult<GetAllLocationsData, undefined>;

export function useAddNewComment(options?: useDataConnectMutationOptions<AddNewCommentData, FirebaseError, void>): UseDataConnectMutationResult<AddNewCommentData, undefined>;
export function useAddNewComment(dc: DataConnect, options?: useDataConnectMutationOptions<AddNewCommentData, FirebaseError, void>): UseDataConnectMutationResult<AddNewCommentData, undefined>;

export function useQuestReviews(options?: useDataConnectQueryOptions<QuestReviewsData>): UseDataConnectQueryResult<QuestReviewsData, undefined>;
export function useQuestReviews(dc: DataConnect, options?: useDataConnectQueryOptions<QuestReviewsData>): UseDataConnectQueryResult<QuestReviewsData, undefined>;
