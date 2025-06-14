# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetPublicQuests*](#getpublicquests)
  - [*GetQuest*](#getquest)
  - [*ListCampaigns*](#listcampaigns)
  - [*LocationDetails*](#locationdetails)
  - [*GetAllLocations*](#getalllocations)
  - [*QuestReviews*](#questreviews)
- [**Mutations**](#mutations)
  - [*CreateQuest*](#createquest)
  - [*UpdateQuest*](#updatequest)
  - [*DeleteQuest*](#deletequest)
  - [*CreateCampaign*](#createcampaign)
  - [*AddNewComment*](#addnewcomment)

# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `adv-guild-backend`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@firebasegen/adv-guild-backend-connector` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `adv-guild-backend`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/adv-guild-backend-connector';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/adv-guild-backend-connector';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `adv-guild-backend` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetPublicQuests
You can execute the `GetPublicQuests` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts):
```typescript
getPublicQuests(): QueryPromise<GetPublicQuestsData, undefined>;

interface GetPublicQuestsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPublicQuestsData, undefined>;
}
export const getPublicQuestsRef: GetPublicQuestsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPublicQuests(dc: DataConnect): QueryPromise<GetPublicQuestsData, undefined>;

interface GetPublicQuestsRef {
  ...
  (dc: DataConnect): QueryRef<GetPublicQuestsData, undefined>;
}
export const getPublicQuestsRef: GetPublicQuestsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPublicQuestsRef:
```typescript
const name = getPublicQuestsRef.operationName;
console.log(name);
```

### Variables
The `GetPublicQuests` query has no variables.
### Return Type
Recall that executing the `GetPublicQuests` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPublicQuestsData`, which is defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetPublicQuests`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPublicQuests } from '@firebasegen/adv-guild-backend-connector';


// Call the `getPublicQuests()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPublicQuests();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPublicQuests(dataConnect);

console.log(data.quests);

// Or, you can use the `Promise` API.
getPublicQuests().then((response) => {
  const data = response.data;
  console.log(data.quests);
});
```

### Using `GetPublicQuests`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPublicQuestsRef } from '@firebasegen/adv-guild-backend-connector';


// Call the `getPublicQuestsRef()` function to get a reference to the query.
const ref = getPublicQuestsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPublicQuestsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quests);
});
```

## GetQuest
You can execute the `GetQuest` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts):
```typescript
getQuest(vars: GetQuestVariables): QueryPromise<GetQuestData, GetQuestVariables>;

interface GetQuestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuestVariables): QueryRef<GetQuestData, GetQuestVariables>;
}
export const getQuestRef: GetQuestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getQuest(dc: DataConnect, vars: GetQuestVariables): QueryPromise<GetQuestData, GetQuestVariables>;

interface GetQuestRef {
  ...
  (dc: DataConnect, vars: GetQuestVariables): QueryRef<GetQuestData, GetQuestVariables>;
}
export const getQuestRef: GetQuestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getQuestRef:
```typescript
const name = getQuestRef.operationName;
console.log(name);
```

### Variables
The `GetQuest` query requires an argument of type `GetQuestVariables`, which is defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetQuestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetQuest` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetQuestData`, which is defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetQuest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getQuest, GetQuestVariables } from '@firebasegen/adv-guild-backend-connector';

// The `GetQuest` query requires an argument of type `GetQuestVariables`:
const getQuestVars: GetQuestVariables = {
  id: ..., 
};

// Call the `getQuest()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getQuest(getQuestVars);
// Variables can be defined inline as well.
const { data } = await getQuest({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getQuest(dataConnect, getQuestVars);

console.log(data.quest);

// Or, you can use the `Promise` API.
getQuest(getQuestVars).then((response) => {
  const data = response.data;
  console.log(data.quest);
});
```

### Using `GetQuest`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getQuestRef, GetQuestVariables } from '@firebasegen/adv-guild-backend-connector';

// The `GetQuest` query requires an argument of type `GetQuestVariables`:
const getQuestVars: GetQuestVariables = {
  id: ..., 
};

// Call the `getQuestRef()` function to get a reference to the query.
const ref = getQuestRef(getQuestVars);
// Variables can be defined inline as well.
const ref = getQuestRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getQuestRef(dataConnect, getQuestVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quest);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quest);
});
```

## ListCampaigns
You can execute the `ListCampaigns` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts):
```typescript
listCampaigns(): QueryPromise<ListCampaignsData, undefined>;

interface ListCampaignsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCampaignsData, undefined>;
}
export const listCampaignsRef: ListCampaignsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCampaigns(dc: DataConnect): QueryPromise<ListCampaignsData, undefined>;

interface ListCampaignsRef {
  ...
  (dc: DataConnect): QueryRef<ListCampaignsData, undefined>;
}
export const listCampaignsRef: ListCampaignsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCampaignsRef:
```typescript
const name = listCampaignsRef.operationName;
console.log(name);
```

### Variables
The `ListCampaigns` query has no variables.
### Return Type
Recall that executing the `ListCampaigns` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCampaignsData`, which is defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCampaignsData {
  campaigns: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    createdAt: TimestampString;
  } & Campaign_Key)[];
}
```
### Using `ListCampaigns`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCampaigns } from '@firebasegen/adv-guild-backend-connector';


// Call the `listCampaigns()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCampaigns();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCampaigns(dataConnect);

console.log(data.campaigns);

// Or, you can use the `Promise` API.
listCampaigns().then((response) => {
  const data = response.data;
  console.log(data.campaigns);
});
```

### Using `ListCampaigns`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCampaignsRef } from '@firebasegen/adv-guild-backend-connector';


// Call the `listCampaignsRef()` function to get a reference to the query.
const ref = listCampaignsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCampaignsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.campaigns);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.campaigns);
});
```

## LocationDetails
You can execute the `LocationDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts):
```typescript
locationDetails(): QueryPromise<LocationDetailsData, undefined>;

interface LocationDetailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<LocationDetailsData, undefined>;
}
export const locationDetailsRef: LocationDetailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
locationDetails(dc: DataConnect): QueryPromise<LocationDetailsData, undefined>;

interface LocationDetailsRef {
  ...
  (dc: DataConnect): QueryRef<LocationDetailsData, undefined>;
}
export const locationDetailsRef: LocationDetailsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the locationDetailsRef:
```typescript
const name = locationDetailsRef.operationName;
console.log(name);
```

### Variables
The `LocationDetails` query has no variables.
### Return Type
Recall that executing the `LocationDetails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LocationDetailsData`, which is defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `LocationDetails`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, locationDetails } from '@firebasegen/adv-guild-backend-connector';


// Call the `locationDetails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await locationDetails();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await locationDetails(dataConnect);

console.log(data.locations);

// Or, you can use the `Promise` API.
locationDetails().then((response) => {
  const data = response.data;
  console.log(data.locations);
});
```

### Using `LocationDetails`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, locationDetailsRef } from '@firebasegen/adv-guild-backend-connector';


// Call the `locationDetailsRef()` function to get a reference to the query.
const ref = locationDetailsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = locationDetailsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.locations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.locations);
});
```

## GetAllLocations
You can execute the `GetAllLocations` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts):
```typescript
getAllLocations(): QueryPromise<GetAllLocationsData, undefined>;

interface GetAllLocationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAllLocationsData, undefined>;
}
export const getAllLocationsRef: GetAllLocationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAllLocations(dc: DataConnect): QueryPromise<GetAllLocationsData, undefined>;

interface GetAllLocationsRef {
  ...
  (dc: DataConnect): QueryRef<GetAllLocationsData, undefined>;
}
export const getAllLocationsRef: GetAllLocationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAllLocationsRef:
```typescript
const name = getAllLocationsRef.operationName;
console.log(name);
```

### Variables
The `GetAllLocations` query has no variables.
### Return Type
Recall that executing the `GetAllLocations` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAllLocationsData`, which is defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetAllLocations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAllLocations } from '@firebasegen/adv-guild-backend-connector';


// Call the `getAllLocations()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAllLocations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAllLocations(dataConnect);

console.log(data.locations);

// Or, you can use the `Promise` API.
getAllLocations().then((response) => {
  const data = response.data;
  console.log(data.locations);
});
```

### Using `GetAllLocations`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAllLocationsRef } from '@firebasegen/adv-guild-backend-connector';


// Call the `getAllLocationsRef()` function to get a reference to the query.
const ref = getAllLocationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAllLocationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.locations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.locations);
});
```

## QuestReviews
You can execute the `QuestReviews` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts):
```typescript
questReviews(): QueryPromise<QuestReviewsData, undefined>;

interface QuestReviewsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<QuestReviewsData, undefined>;
}
export const questReviewsRef: QuestReviewsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
questReviews(dc: DataConnect): QueryPromise<QuestReviewsData, undefined>;

interface QuestReviewsRef {
  ...
  (dc: DataConnect): QueryRef<QuestReviewsData, undefined>;
}
export const questReviewsRef: QuestReviewsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the questReviewsRef:
```typescript
const name = questReviewsRef.operationName;
console.log(name);
```

### Variables
The `QuestReviews` query has no variables.
### Return Type
Recall that executing the `QuestReviews` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `QuestReviewsData`, which is defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `QuestReviews`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, questReviews } from '@firebasegen/adv-guild-backend-connector';


// Call the `questReviews()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await questReviews();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await questReviews(dataConnect);

console.log(data.quests);
console.log(data.locations);

// Or, you can use the `Promise` API.
questReviews().then((response) => {
  const data = response.data;
  console.log(data.quests);
  console.log(data.locations);
});
```

### Using `QuestReviews`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, questReviewsRef } from '@firebasegen/adv-guild-backend-connector';


// Call the `questReviewsRef()` function to get a reference to the query.
const ref = questReviewsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = questReviewsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quests);
console.log(data.locations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quests);
  console.log(data.locations);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `adv-guild-backend` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateQuest
You can execute the `CreateQuest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts):
```typescript
createQuest(vars: CreateQuestVariables): MutationPromise<CreateQuestData, CreateQuestVariables>;

interface CreateQuestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQuestVariables): MutationRef<CreateQuestData, CreateQuestVariables>;
}
export const createQuestRef: CreateQuestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createQuest(dc: DataConnect, vars: CreateQuestVariables): MutationPromise<CreateQuestData, CreateQuestVariables>;

interface CreateQuestRef {
  ...
  (dc: DataConnect, vars: CreateQuestVariables): MutationRef<CreateQuestData, CreateQuestVariables>;
}
export const createQuestRef: CreateQuestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createQuestRef:
```typescript
const name = createQuestRef.operationName;
console.log(name);
```

### Variables
The `CreateQuest` mutation requires an argument of type `CreateQuestVariables`, which is defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateQuestVariables {
  name: string;
  synopsis: string;
  difficultyId: UUIDString;
  interestId: UUIDString;
  questTypeId: UUIDString;
  startLocationId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateQuest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateQuestData`, which is defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateQuestData {
  quest_insert: Quest_Key;
}
```
### Using `CreateQuest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createQuest, CreateQuestVariables } from '@firebasegen/adv-guild-backend-connector';

// The `CreateQuest` mutation requires an argument of type `CreateQuestVariables`:
const createQuestVars: CreateQuestVariables = {
  name: ..., 
  synopsis: ..., 
  difficultyId: ..., 
  interestId: ..., 
  questTypeId: ..., 
  startLocationId: ..., 
};

// Call the `createQuest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createQuest(createQuestVars);
// Variables can be defined inline as well.
const { data } = await createQuest({ name: ..., synopsis: ..., difficultyId: ..., interestId: ..., questTypeId: ..., startLocationId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createQuest(dataConnect, createQuestVars);

console.log(data.quest_insert);

// Or, you can use the `Promise` API.
createQuest(createQuestVars).then((response) => {
  const data = response.data;
  console.log(data.quest_insert);
});
```

### Using `CreateQuest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createQuestRef, CreateQuestVariables } from '@firebasegen/adv-guild-backend-connector';

// The `CreateQuest` mutation requires an argument of type `CreateQuestVariables`:
const createQuestVars: CreateQuestVariables = {
  name: ..., 
  synopsis: ..., 
  difficultyId: ..., 
  interestId: ..., 
  questTypeId: ..., 
  startLocationId: ..., 
};

// Call the `createQuestRef()` function to get a reference to the mutation.
const ref = createQuestRef(createQuestVars);
// Variables can be defined inline as well.
const ref = createQuestRef({ name: ..., synopsis: ..., difficultyId: ..., interestId: ..., questTypeId: ..., startLocationId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createQuestRef(dataConnect, createQuestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quest_insert);
});
```

## UpdateQuest
You can execute the `UpdateQuest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts):
```typescript
updateQuest(vars: UpdateQuestVariables): MutationPromise<UpdateQuestData, UpdateQuestVariables>;

interface UpdateQuestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQuestVariables): MutationRef<UpdateQuestData, UpdateQuestVariables>;
}
export const updateQuestRef: UpdateQuestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateQuest(dc: DataConnect, vars: UpdateQuestVariables): MutationPromise<UpdateQuestData, UpdateQuestVariables>;

interface UpdateQuestRef {
  ...
  (dc: DataConnect, vars: UpdateQuestVariables): MutationRef<UpdateQuestData, UpdateQuestVariables>;
}
export const updateQuestRef: UpdateQuestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateQuestRef:
```typescript
const name = updateQuestRef.operationName;
console.log(name);
```

### Variables
The `UpdateQuest` mutation requires an argument of type `UpdateQuestVariables`, which is defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpdateQuest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateQuestData`, which is defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateQuestData {
  quest_update?: Quest_Key | null;
}
```
### Using `UpdateQuest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateQuest, UpdateQuestVariables } from '@firebasegen/adv-guild-backend-connector';

// The `UpdateQuest` mutation requires an argument of type `UpdateQuestVariables`:
const updateQuestVars: UpdateQuestVariables = {
  id: ..., 
  name: ..., // optional
  synopsis: ..., // optional
  difficultyId: ..., // optional
  interestId: ..., // optional
  questTypeId: ..., // optional
  startLocationId: ..., // optional
  itinerary: ..., // optional
  reward: ..., // optional
};

// Call the `updateQuest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateQuest(updateQuestVars);
// Variables can be defined inline as well.
const { data } = await updateQuest({ id: ..., name: ..., synopsis: ..., difficultyId: ..., interestId: ..., questTypeId: ..., startLocationId: ..., itinerary: ..., reward: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateQuest(dataConnect, updateQuestVars);

console.log(data.quest_update);

// Or, you can use the `Promise` API.
updateQuest(updateQuestVars).then((response) => {
  const data = response.data;
  console.log(data.quest_update);
});
```

### Using `UpdateQuest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateQuestRef, UpdateQuestVariables } from '@firebasegen/adv-guild-backend-connector';

// The `UpdateQuest` mutation requires an argument of type `UpdateQuestVariables`:
const updateQuestVars: UpdateQuestVariables = {
  id: ..., 
  name: ..., // optional
  synopsis: ..., // optional
  difficultyId: ..., // optional
  interestId: ..., // optional
  questTypeId: ..., // optional
  startLocationId: ..., // optional
  itinerary: ..., // optional
  reward: ..., // optional
};

// Call the `updateQuestRef()` function to get a reference to the mutation.
const ref = updateQuestRef(updateQuestVars);
// Variables can be defined inline as well.
const ref = updateQuestRef({ id: ..., name: ..., synopsis: ..., difficultyId: ..., interestId: ..., questTypeId: ..., startLocationId: ..., itinerary: ..., reward: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateQuestRef(dataConnect, updateQuestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quest_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quest_update);
});
```

## DeleteQuest
You can execute the `DeleteQuest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts):
```typescript
deleteQuest(vars: DeleteQuestVariables): MutationPromise<DeleteQuestData, DeleteQuestVariables>;

interface DeleteQuestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuestVariables): MutationRef<DeleteQuestData, DeleteQuestVariables>;
}
export const deleteQuestRef: DeleteQuestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteQuest(dc: DataConnect, vars: DeleteQuestVariables): MutationPromise<DeleteQuestData, DeleteQuestVariables>;

interface DeleteQuestRef {
  ...
  (dc: DataConnect, vars: DeleteQuestVariables): MutationRef<DeleteQuestData, DeleteQuestVariables>;
}
export const deleteQuestRef: DeleteQuestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteQuestRef:
```typescript
const name = deleteQuestRef.operationName;
console.log(name);
```

### Variables
The `DeleteQuest` mutation requires an argument of type `DeleteQuestVariables`, which is defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteQuestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteQuest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteQuestData`, which is defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteQuestData {
  quest_delete?: Quest_Key | null;
}
```
### Using `DeleteQuest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteQuest, DeleteQuestVariables } from '@firebasegen/adv-guild-backend-connector';

// The `DeleteQuest` mutation requires an argument of type `DeleteQuestVariables`:
const deleteQuestVars: DeleteQuestVariables = {
  id: ..., 
};

// Call the `deleteQuest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteQuest(deleteQuestVars);
// Variables can be defined inline as well.
const { data } = await deleteQuest({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteQuest(dataConnect, deleteQuestVars);

console.log(data.quest_delete);

// Or, you can use the `Promise` API.
deleteQuest(deleteQuestVars).then((response) => {
  const data = response.data;
  console.log(data.quest_delete);
});
```

### Using `DeleteQuest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteQuestRef, DeleteQuestVariables } from '@firebasegen/adv-guild-backend-connector';

// The `DeleteQuest` mutation requires an argument of type `DeleteQuestVariables`:
const deleteQuestVars: DeleteQuestVariables = {
  id: ..., 
};

// Call the `deleteQuestRef()` function to get a reference to the mutation.
const ref = deleteQuestRef(deleteQuestVars);
// Variables can be defined inline as well.
const ref = deleteQuestRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteQuestRef(dataConnect, deleteQuestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quest_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quest_delete);
});
```

## CreateCampaign
You can execute the `CreateCampaign` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts):
```typescript
createCampaign(vars: CreateCampaignVariables): MutationPromise<CreateCampaignData, CreateCampaignVariables>;

interface CreateCampaignRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCampaignVariables): MutationRef<CreateCampaignData, CreateCampaignVariables>;
}
export const createCampaignRef: CreateCampaignRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCampaign(dc: DataConnect, vars: CreateCampaignVariables): MutationPromise<CreateCampaignData, CreateCampaignVariables>;

interface CreateCampaignRef {
  ...
  (dc: DataConnect, vars: CreateCampaignVariables): MutationRef<CreateCampaignData, CreateCampaignVariables>;
}
export const createCampaignRef: CreateCampaignRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCampaignRef:
```typescript
const name = createCampaignRef.operationName;
console.log(name);
```

### Variables
The `CreateCampaign` mutation requires an argument of type `CreateCampaignVariables`, which is defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCampaignVariables {
  title: string;
  description: string;
}
```
### Return Type
Recall that executing the `CreateCampaign` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCampaignData`, which is defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCampaignData {
  campaign_insert: Campaign_Key;
}
```
### Using `CreateCampaign`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCampaign, CreateCampaignVariables } from '@firebasegen/adv-guild-backend-connector';

// The `CreateCampaign` mutation requires an argument of type `CreateCampaignVariables`:
const createCampaignVars: CreateCampaignVariables = {
  title: ..., 
  description: ..., 
};

// Call the `createCampaign()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCampaign(createCampaignVars);
// Variables can be defined inline as well.
const { data } = await createCampaign({ title: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCampaign(dataConnect, createCampaignVars);

console.log(data.campaign_insert);

// Or, you can use the `Promise` API.
createCampaign(createCampaignVars).then((response) => {
  const data = response.data;
  console.log(data.campaign_insert);
});
```

### Using `CreateCampaign`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCampaignRef, CreateCampaignVariables } from '@firebasegen/adv-guild-backend-connector';

// The `CreateCampaign` mutation requires an argument of type `CreateCampaignVariables`:
const createCampaignVars: CreateCampaignVariables = {
  title: ..., 
  description: ..., 
};

// Call the `createCampaignRef()` function to get a reference to the mutation.
const ref = createCampaignRef(createCampaignVars);
// Variables can be defined inline as well.
const ref = createCampaignRef({ title: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCampaignRef(dataConnect, createCampaignVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.campaign_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.campaign_insert);
});
```

## AddNewComment
You can execute the `AddNewComment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts):
```typescript
addNewComment(): MutationPromise<AddNewCommentData, undefined>;

interface AddNewCommentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<AddNewCommentData, undefined>;
}
export const addNewCommentRef: AddNewCommentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addNewComment(dc: DataConnect): MutationPromise<AddNewCommentData, undefined>;

interface AddNewCommentRef {
  ...
  (dc: DataConnect): MutationRef<AddNewCommentData, undefined>;
}
export const addNewCommentRef: AddNewCommentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addNewCommentRef:
```typescript
const name = addNewCommentRef.operationName;
console.log(name);
```

### Variables
The `AddNewComment` mutation has no variables.
### Return Type
Recall that executing the `AddNewComment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddNewCommentData`, which is defined in [adv-guild-backend-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddNewCommentData {
  quest_insert: Quest_Key;
}
```
### Using `AddNewComment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addNewComment } from '@firebasegen/adv-guild-backend-connector';


// Call the `addNewComment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addNewComment();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addNewComment(dataConnect);

console.log(data.quest_insert);

// Or, you can use the `Promise` API.
addNewComment().then((response) => {
  const data = response.data;
  console.log(data.quest_insert);
});
```

### Using `AddNewComment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addNewCommentRef } from '@firebasegen/adv-guild-backend-connector';


// Call the `addNewCommentRef()` function to get a reference to the mutation.
const ref = addNewCommentRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addNewCommentRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quest_insert);
});
```

