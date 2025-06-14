# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
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

# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `adv-guild-backend`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@firebasegen/adv-guild-backend-connector/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `adv-guild-backend`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `adv-guild-backend`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/adv-guild-backend-connector';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/adv-guild-backend-connector';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `adv-guild-backend` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## GetPublicQuests
You can execute the `GetPublicQuests` Query using the following Query hook function, which is defined in [adv-guild-backend-connector/react/index.d.ts](./index.d.ts):

```javascript
useGetPublicQuests(dc: DataConnect, options?: useDataConnectQueryOptions<GetPublicQuestsData>): UseDataConnectQueryResult<GetPublicQuestsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetPublicQuests(options?: useDataConnectQueryOptions<GetPublicQuestsData>): UseDataConnectQueryResult<GetPublicQuestsData, undefined>;
```

### Variables
The `GetPublicQuests` Query has no variables.
### Return Type
Recall that calling the `GetPublicQuests` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetPublicQuests` Query is of type `GetPublicQuestsData`, which is defined in [adv-guild-backend-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetPublicQuests`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/adv-guild-backend-connector';
import { useGetPublicQuests } from '@firebasegen/adv-guild-backend-connector/react'

export default function GetPublicQuestsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetPublicQuests();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetPublicQuests(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetPublicQuests(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetPublicQuests(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.quests);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetQuest
You can execute the `GetQuest` Query using the following Query hook function, which is defined in [adv-guild-backend-connector/react/index.d.ts](./index.d.ts):

```javascript
useGetQuest(dc: DataConnect, vars: GetQuestVariables, options?: useDataConnectQueryOptions<GetQuestData>): UseDataConnectQueryResult<GetQuestData, GetQuestVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetQuest(vars: GetQuestVariables, options?: useDataConnectQueryOptions<GetQuestData>): UseDataConnectQueryResult<GetQuestData, GetQuestVariables>;
```

### Variables
The `GetQuest` Query requires an argument of type `GetQuestVariables`, which is defined in [adv-guild-backend-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetQuestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetQuest` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetQuest` Query is of type `GetQuestData`, which is defined in [adv-guild-backend-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetQuest`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetQuestVariables } from '@firebasegen/adv-guild-backend-connector';
import { useGetQuest } from '@firebasegen/adv-guild-backend-connector/react'

export default function GetQuestComponent() {
  // The `useGetQuest` Query hook requires an argument of type `GetQuestVariables`:
  const getQuestVars: GetQuestVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetQuest(getQuestVars);
  // Variables can be defined inline as well.
  const query = useGetQuest({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetQuest(dataConnect, getQuestVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetQuest(getQuestVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetQuest(dataConnect, getQuestVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.quest);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListCampaigns
You can execute the `ListCampaigns` Query using the following Query hook function, which is defined in [adv-guild-backend-connector/react/index.d.ts](./index.d.ts):

```javascript
useListCampaigns(dc: DataConnect, options?: useDataConnectQueryOptions<ListCampaignsData>): UseDataConnectQueryResult<ListCampaignsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListCampaigns(options?: useDataConnectQueryOptions<ListCampaignsData>): UseDataConnectQueryResult<ListCampaignsData, undefined>;
```

### Variables
The `ListCampaigns` Query has no variables.
### Return Type
Recall that calling the `ListCampaigns` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListCampaigns` Query is of type `ListCampaignsData`, which is defined in [adv-guild-backend-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListCampaignsData {
  campaigns: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    createdAt: TimestampString;
  } & Campaign_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListCampaigns`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/adv-guild-backend-connector';
import { useListCampaigns } from '@firebasegen/adv-guild-backend-connector/react'

export default function ListCampaignsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListCampaigns();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListCampaigns(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListCampaigns(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListCampaigns(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.campaigns);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## LocationDetails
You can execute the `LocationDetails` Query using the following Query hook function, which is defined in [adv-guild-backend-connector/react/index.d.ts](./index.d.ts):

```javascript
useLocationDetails(dc: DataConnect, options?: useDataConnectQueryOptions<LocationDetailsData>): UseDataConnectQueryResult<LocationDetailsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useLocationDetails(options?: useDataConnectQueryOptions<LocationDetailsData>): UseDataConnectQueryResult<LocationDetailsData, undefined>;
```

### Variables
The `LocationDetails` Query has no variables.
### Return Type
Recall that calling the `LocationDetails` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `LocationDetails` Query is of type `LocationDetailsData`, which is defined in [adv-guild-backend-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `LocationDetails`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/adv-guild-backend-connector';
import { useLocationDetails } from '@firebasegen/adv-guild-backend-connector/react'

export default function LocationDetailsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useLocationDetails();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useLocationDetails(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useLocationDetails(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useLocationDetails(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.locations);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetAllLocations
You can execute the `GetAllLocations` Query using the following Query hook function, which is defined in [adv-guild-backend-connector/react/index.d.ts](./index.d.ts):

```javascript
useGetAllLocations(dc: DataConnect, options?: useDataConnectQueryOptions<GetAllLocationsData>): UseDataConnectQueryResult<GetAllLocationsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetAllLocations(options?: useDataConnectQueryOptions<GetAllLocationsData>): UseDataConnectQueryResult<GetAllLocationsData, undefined>;
```

### Variables
The `GetAllLocations` Query has no variables.
### Return Type
Recall that calling the `GetAllLocations` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetAllLocations` Query is of type `GetAllLocationsData`, which is defined in [adv-guild-backend-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetAllLocations`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/adv-guild-backend-connector';
import { useGetAllLocations } from '@firebasegen/adv-guild-backend-connector/react'

export default function GetAllLocationsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetAllLocations();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetAllLocations(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetAllLocations(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetAllLocations(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.locations);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## QuestReviews
You can execute the `QuestReviews` Query using the following Query hook function, which is defined in [adv-guild-backend-connector/react/index.d.ts](./index.d.ts):

```javascript
useQuestReviews(dc: DataConnect, options?: useDataConnectQueryOptions<QuestReviewsData>): UseDataConnectQueryResult<QuestReviewsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useQuestReviews(options?: useDataConnectQueryOptions<QuestReviewsData>): UseDataConnectQueryResult<QuestReviewsData, undefined>;
```

### Variables
The `QuestReviews` Query has no variables.
### Return Type
Recall that calling the `QuestReviews` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `QuestReviews` Query is of type `QuestReviewsData`, which is defined in [adv-guild-backend-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `QuestReviews`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/adv-guild-backend-connector';
import { useQuestReviews } from '@firebasegen/adv-guild-backend-connector/react'

export default function QuestReviewsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useQuestReviews();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useQuestReviews(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useQuestReviews(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useQuestReviews(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.quests);
    console.log(query.data.locations);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `adv-guild-backend` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## CreateQuest
You can execute the `CreateQuest` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [adv-guild-backend-connector/react/index.d.ts](./index.d.ts)):
```javascript
useCreateQuest(options?: useDataConnectMutationOptions<CreateQuestData, FirebaseError, CreateQuestVariables>): UseDataConnectMutationResult<CreateQuestData, CreateQuestVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateQuest(dc: DataConnect, options?: useDataConnectMutationOptions<CreateQuestData, FirebaseError, CreateQuestVariables>): UseDataConnectMutationResult<CreateQuestData, CreateQuestVariables>;
```

### Variables
The `CreateQuest` Mutation requires an argument of type `CreateQuestVariables`, which is defined in [adv-guild-backend-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateQuest` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateQuest` Mutation is of type `CreateQuestData`, which is defined in [adv-guild-backend-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateQuestData {
  quest_insert: Quest_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateQuest`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateQuestVariables } from '@firebasegen/adv-guild-backend-connector';
import { useCreateQuest } from '@firebasegen/adv-guild-backend-connector/react'

export default function CreateQuestComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateQuest();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateQuest(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateQuest(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateQuest(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateQuest` Mutation requires an argument of type `CreateQuestVariables`:
  const createQuestVars: CreateQuestVariables = {
    name: ..., 
    synopsis: ..., 
    difficultyId: ..., 
    interestId: ..., 
    questTypeId: ..., 
    startLocationId: ..., 
  };
  mutation.mutate(createQuestVars);
  // Variables can be defined inline as well.
  mutation.mutate({ name: ..., synopsis: ..., difficultyId: ..., interestId: ..., questTypeId: ..., startLocationId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createQuestVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.quest_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateQuest
You can execute the `UpdateQuest` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [adv-guild-backend-connector/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateQuest(options?: useDataConnectMutationOptions<UpdateQuestData, FirebaseError, UpdateQuestVariables>): UseDataConnectMutationResult<UpdateQuestData, UpdateQuestVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateQuest(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateQuestData, FirebaseError, UpdateQuestVariables>): UseDataConnectMutationResult<UpdateQuestData, UpdateQuestVariables>;
```

### Variables
The `UpdateQuest` Mutation requires an argument of type `UpdateQuestVariables`, which is defined in [adv-guild-backend-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateQuest` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateQuest` Mutation is of type `UpdateQuestData`, which is defined in [adv-guild-backend-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateQuestData {
  quest_update?: Quest_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateQuest`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateQuestVariables } from '@firebasegen/adv-guild-backend-connector';
import { useUpdateQuest } from '@firebasegen/adv-guild-backend-connector/react'

export default function UpdateQuestComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateQuest();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateQuest(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateQuest(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateQuest(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateQuest` Mutation requires an argument of type `UpdateQuestVariables`:
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
  mutation.mutate(updateQuestVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., name: ..., synopsis: ..., difficultyId: ..., interestId: ..., questTypeId: ..., startLocationId: ..., itinerary: ..., reward: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateQuestVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.quest_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteQuest
You can execute the `DeleteQuest` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [adv-guild-backend-connector/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteQuest(options?: useDataConnectMutationOptions<DeleteQuestData, FirebaseError, DeleteQuestVariables>): UseDataConnectMutationResult<DeleteQuestData, DeleteQuestVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteQuest(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteQuestData, FirebaseError, DeleteQuestVariables>): UseDataConnectMutationResult<DeleteQuestData, DeleteQuestVariables>;
```

### Variables
The `DeleteQuest` Mutation requires an argument of type `DeleteQuestVariables`, which is defined in [adv-guild-backend-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteQuestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteQuest` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteQuest` Mutation is of type `DeleteQuestData`, which is defined in [adv-guild-backend-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteQuestData {
  quest_delete?: Quest_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteQuest`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteQuestVariables } from '@firebasegen/adv-guild-backend-connector';
import { useDeleteQuest } from '@firebasegen/adv-guild-backend-connector/react'

export default function DeleteQuestComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteQuest();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteQuest(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteQuest(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteQuest(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteQuest` Mutation requires an argument of type `DeleteQuestVariables`:
  const deleteQuestVars: DeleteQuestVariables = {
    id: ..., 
  };
  mutation.mutate(deleteQuestVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteQuestVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.quest_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateCampaign
You can execute the `CreateCampaign` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [adv-guild-backend-connector/react/index.d.ts](./index.d.ts)):
```javascript
useCreateCampaign(options?: useDataConnectMutationOptions<CreateCampaignData, FirebaseError, CreateCampaignVariables>): UseDataConnectMutationResult<CreateCampaignData, CreateCampaignVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateCampaign(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCampaignData, FirebaseError, CreateCampaignVariables>): UseDataConnectMutationResult<CreateCampaignData, CreateCampaignVariables>;
```

### Variables
The `CreateCampaign` Mutation requires an argument of type `CreateCampaignVariables`, which is defined in [adv-guild-backend-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateCampaignVariables {
  title: string;
  description: string;
}
```
### Return Type
Recall that calling the `CreateCampaign` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateCampaign` Mutation is of type `CreateCampaignData`, which is defined in [adv-guild-backend-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateCampaignData {
  campaign_insert: Campaign_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateCampaign`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateCampaignVariables } from '@firebasegen/adv-guild-backend-connector';
import { useCreateCampaign } from '@firebasegen/adv-guild-backend-connector/react'

export default function CreateCampaignComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateCampaign();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateCampaign(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateCampaign(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateCampaign(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateCampaign` Mutation requires an argument of type `CreateCampaignVariables`:
  const createCampaignVars: CreateCampaignVariables = {
    title: ..., 
    description: ..., 
  };
  mutation.mutate(createCampaignVars);
  // Variables can be defined inline as well.
  mutation.mutate({ title: ..., description: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createCampaignVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.campaign_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AddNewComment
You can execute the `AddNewComment` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [adv-guild-backend-connector/react/index.d.ts](./index.d.ts)):
```javascript
useAddNewComment(options?: useDataConnectMutationOptions<AddNewCommentData, FirebaseError, void>): UseDataConnectMutationResult<AddNewCommentData, undefined>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useAddNewComment(dc: DataConnect, options?: useDataConnectMutationOptions<AddNewCommentData, FirebaseError, void>): UseDataConnectMutationResult<AddNewCommentData, undefined>;
```

### Variables
The `AddNewComment` Mutation has no variables.
### Return Type
Recall that calling the `AddNewComment` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `AddNewComment` Mutation is of type `AddNewCommentData`, which is defined in [adv-guild-backend-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AddNewCommentData {
  quest_insert: Quest_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `AddNewComment`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/adv-guild-backend-connector';
import { useAddNewComment } from '@firebasegen/adv-guild-backend-connector/react'

export default function AddNewCommentComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useAddNewComment();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useAddNewComment(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAddNewComment(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAddNewComment(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  mutation.mutate();

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  // Since this Mutation accepts no variables, you must pass `undefined` where you would normally pass the variables.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(undefined, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.quest_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

