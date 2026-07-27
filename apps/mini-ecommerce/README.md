## Setting up React query TansStack and Trpc Client

> Create a file

src/provider/ReactQueryProvider.tsx

 <!-- Applying pagination -->

li

### TYping Background image style stypes

```ts
import type { CSSProperties } from "react";
```

<!--  -->

## Implementing Cart fetature

### Add to cart button

> Optimistic update

```ts
onMutate();
```

lets undrstand this

### So on order slug page i will apply polling for gettting the pending payments done

```ts
const { data, isLoading } = useQuery(
  trpc.order.getOrdderById.queryOptions(
    { orderId: Number(orderId) },
    {
      enabled: !!orderId,
      refetchInterval: (query) =>
        query.state.data?.paymentStatus === "PENDING" ? 2000 : false,
    },
  ),
);
```

command to move the file name is

```node
 git mv src/app/components/ProductDetails src/app/components/temp

```
## Why used tanstack and trpc in frontend 
>TanStack Query complements this by handling caching, background refetching, pagination, and request deduplication automatically, which would otherwise require a lot of custom state management if I used Axios or fetch directly.

## Guest and User bug in Ui rendering
> TO fixt that remove the redux of user and use the authprovider which will act as a gateway contoller to render ui or blok ui 
