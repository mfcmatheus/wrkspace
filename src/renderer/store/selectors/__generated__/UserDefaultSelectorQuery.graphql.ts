/**
 * @generated SignedSource<<3220eb28187840f031cce0bd45900bae>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UserDefaultSelectorQuery$variables = Record<PropertyKey, never>;
export type UserDefaultSelectorQuery$data = {
  readonly Me: {
    readonly name: string;
  } | null | undefined;
};
export type UserDefaultSelectorQuery = {
  response: UserDefaultSelectorQuery$data;
  variables: UserDefaultSelectorQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "Me",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "UserDefaultSelectorQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "UserDefaultSelectorQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "64cb8d7c82208f244862e4c8ae11bf1a",
    "id": null,
    "metadata": {},
    "name": "UserDefaultSelectorQuery",
    "operationKind": "query",
    "text": "query UserDefaultSelectorQuery {\n  Me {\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "f59d0d7b2bf34310f0b69f5d2f9d0133";

export default node;
