
// local store
const store = {
  baseUrl: null,
};

export function initBaseUrl(baseUrl) {
  store.baseUrl = baseUrl;
}

export function gql() {
  return `${store.baseUrl}/v1.0/graphql`;
}

export function test() {
  // TODO: remove later
}

export default {
  initBaseUrl,
  gql,
};
