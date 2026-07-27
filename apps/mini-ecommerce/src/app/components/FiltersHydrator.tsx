import { createPublicTRPCClient } from "@/utils/fetchServerData";
import ReduxHydrator from "./ReduxHydrator";

export default async function FiltersHydrator() {
  const trpc = createPublicTRPCClient();
  const filters = await trpc.filters.getFilterData.query();

  return <ReduxHydrator filtersData={filters} />;
}
