const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'adv-guild-backend',
  service: 'adventurer-guild-ikihm-service',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createQuestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateQuest', inputVars);
}
createQuestRef.operationName = 'CreateQuest';
exports.createQuestRef = createQuestRef;

exports.createQuest = function createQuest(dcOrVars, vars) {
  return executeMutation(createQuestRef(dcOrVars, vars));
};

const getPublicQuestsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPublicQuests');
}
getPublicQuestsRef.operationName = 'GetPublicQuests';
exports.getPublicQuestsRef = getPublicQuestsRef;

exports.getPublicQuests = function getPublicQuests(dc) {
  return executeQuery(getPublicQuestsRef(dc));
};

const getQuestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetQuest', inputVars);
}
getQuestRef.operationName = 'GetQuest';
exports.getQuestRef = getQuestRef;

exports.getQuest = function getQuest(dcOrVars, vars) {
  return executeQuery(getQuestRef(dcOrVars, vars));
};

const updateQuestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateQuest', inputVars);
}
updateQuestRef.operationName = 'UpdateQuest';
exports.updateQuestRef = updateQuestRef;

exports.updateQuest = function updateQuest(dcOrVars, vars) {
  return executeMutation(updateQuestRef(dcOrVars, vars));
};

const deleteQuestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQuest', inputVars);
}
deleteQuestRef.operationName = 'DeleteQuest';
exports.deleteQuestRef = deleteQuestRef;

exports.deleteQuest = function deleteQuest(dcOrVars, vars) {
  return executeMutation(deleteQuestRef(dcOrVars, vars));
};

const listCampaignsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCampaigns');
}
listCampaignsRef.operationName = 'ListCampaigns';
exports.listCampaignsRef = listCampaignsRef;

exports.listCampaigns = function listCampaigns(dc) {
  return executeQuery(listCampaignsRef(dc));
};

const createCampaignRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCampaign', inputVars);
}
createCampaignRef.operationName = 'CreateCampaign';
exports.createCampaignRef = createCampaignRef;

exports.createCampaign = function createCampaign(dcOrVars, vars) {
  return executeMutation(createCampaignRef(dcOrVars, vars));
};

const locationDetailsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'LocationDetails');
}
locationDetailsRef.operationName = 'LocationDetails';
exports.locationDetailsRef = locationDetailsRef;

exports.locationDetails = function locationDetails(dc) {
  return executeQuery(locationDetailsRef(dc));
};

const getAllLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAllLocations');
}
getAllLocationsRef.operationName = 'GetAllLocations';
exports.getAllLocationsRef = getAllLocationsRef;

exports.getAllLocations = function getAllLocations(dc) {
  return executeQuery(getAllLocationsRef(dc));
};

const addNewCommentRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewComment');
}
addNewCommentRef.operationName = 'AddNewComment';
exports.addNewCommentRef = addNewCommentRef;

exports.addNewComment = function addNewComment(dc) {
  return executeMutation(addNewCommentRef(dc));
};

const questReviewsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'QuestReviews');
}
questReviewsRef.operationName = 'QuestReviews';
exports.questReviewsRef = questReviewsRef;

exports.questReviews = function questReviews(dc) {
  return executeQuery(questReviewsRef(dc));
};
