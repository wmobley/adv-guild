import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'adv-guild-backend',
  service: 'adventurer-guild-ikihm-service',
  location: 'us-central1'
};

export const createQuestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateQuest', inputVars);
}
createQuestRef.operationName = 'CreateQuest';

export function createQuest(dcOrVars, vars) {
  return executeMutation(createQuestRef(dcOrVars, vars));
}

export const getPublicQuestsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPublicQuests');
}
getPublicQuestsRef.operationName = 'GetPublicQuests';

export function getPublicQuests(dc) {
  return executeQuery(getPublicQuestsRef(dc));
}

export const getQuestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetQuest', inputVars);
}
getQuestRef.operationName = 'GetQuest';

export function getQuest(dcOrVars, vars) {
  return executeQuery(getQuestRef(dcOrVars, vars));
}

export const updateQuestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateQuest', inputVars);
}
updateQuestRef.operationName = 'UpdateQuest';

export function updateQuest(dcOrVars, vars) {
  return executeMutation(updateQuestRef(dcOrVars, vars));
}

export const deleteQuestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQuest', inputVars);
}
deleteQuestRef.operationName = 'DeleteQuest';

export function deleteQuest(dcOrVars, vars) {
  return executeMutation(deleteQuestRef(dcOrVars, vars));
}

export const listCampaignsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCampaigns');
}
listCampaignsRef.operationName = 'ListCampaigns';

export function listCampaigns(dc) {
  return executeQuery(listCampaignsRef(dc));
}

export const createCampaignRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCampaign', inputVars);
}
createCampaignRef.operationName = 'CreateCampaign';

export function createCampaign(dcOrVars, vars) {
  return executeMutation(createCampaignRef(dcOrVars, vars));
}

export const locationDetailsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'LocationDetails');
}
locationDetailsRef.operationName = 'LocationDetails';

export function locationDetails(dc) {
  return executeQuery(locationDetailsRef(dc));
}

export const getAllLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAllLocations');
}
getAllLocationsRef.operationName = 'GetAllLocations';

export function getAllLocations(dc) {
  return executeQuery(getAllLocationsRef(dc));
}

export const addNewCommentRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewComment');
}
addNewCommentRef.operationName = 'AddNewComment';

export function addNewComment(dc) {
  return executeMutation(addNewCommentRef(dc));
}

export const questReviewsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'QuestReviews');
}
questReviewsRef.operationName = 'QuestReviews';

export function questReviews(dc) {
  return executeQuery(questReviewsRef(dc));
}

