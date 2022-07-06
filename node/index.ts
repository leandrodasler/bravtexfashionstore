import { ClientsConfig, LRUCache, method, Service, ServiceContext, UserInputError } from "@vtex/api";
import { Clients } from "./clients";

const TIMEOUT_MS = 800;
const memoryCache = new LRUCache<string, never>({ max: 5000 });

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    status: {
      memoryCache,
    },
  },
};

export default new Service({
  clients,
  routes: {
    collection: method({
      GET: async (context: ServiceContext<Clients>) => {
        // context.clients.search.products({
        //   collection
        // })

        const {
          vtex: {
            route: {
              params: { collection },
            },
          },
        } = context;

        console.log(collection)

        if (!collection) {
          throw new UserInputError("collection is required");
        }

        const response = await context.clients.collection.getCollection(collection as string);

        context.body = response;
        context.status = 200;
        context.set("Cache-Control", "no-cache");
      },
    }),
  },
});
