import type { ConfigAPI, NodePath, Visitor } from "@babel/core";
import type {
  Program,
  ImportDeclaration,
  ImportSpecifier,
  Identifier,
  FunctionDeclaration,
  ArrowFunctionExpression,
  FunctionExpression,
  VariableDeclaration,
  Node,
} from "@babel/types";

export function decoPlugin(api: ConfigAPI) {
  return {
    name: "deco-plugin",
    visitor: {
      Program(path: NodePath<Program>) {
        let hasUseDecoImport = false;
        path.node.body.forEach((node: Node) => {
          if (
            node.type === "ImportDeclaration" &&
            (node as ImportDeclaration).source.value === "@decoui/ui" &&
            (node as ImportDeclaration).specifiers.some(
              (spec) =>
                spec.type === "ImportSpecifier" &&
                (spec as ImportSpecifier).imported &&
                ((spec as ImportSpecifier).imported as Identifier).name ===
                  "useDeco"
            )
          ) {
            hasUseDecoImport = true;
          }
        });

        if (!hasUseDecoImport) {
          const decoImport = path.node.body.find(
            (node): node is ImportDeclaration =>
              node.type === "ImportDeclaration" &&
              node.source.value === "@decoui/ui"
          );

          if (decoImport) {
            decoImport.specifiers.push({
              type: "ImportSpecifier",
              local: {
                type: "Identifier",
                name: "useDeco",
              },
              imported: {
                type: "Identifier",
                name: "useDeco",
              },
            });
          }
        }
      },
      FunctionDeclaration(path: NodePath<FunctionDeclaration>) {
        handleFunction(path);
      },
      ArrowFunctionExpression(path: NodePath<ArrowFunctionExpression>) {
        handleFunction(path);
      },
      FunctionExpression(path: NodePath<FunctionExpression>) {
        handleFunction(path);
      },
    },
  };
}

type FunctionNodePath =
  | NodePath<FunctionDeclaration>
  | NodePath<ArrowFunctionExpression>
  | NodePath<FunctionExpression>;

function handleFunction(path: FunctionNodePath) {
  // Skip if not a React component
  // TODO: assuming components start with capital letter
  let functionName: string | undefined;

  if (path.node.type === "FunctionDeclaration") {
    functionName = path.node.id?.name;
  } else if (
    path.node.type === "ArrowFunctionExpression" ||
    path.node.type === "FunctionExpression"
  ) {
    // Check if the arrow function is assigned to a variable
    if (
      path.parent.type === "VariableDeclarator" &&
      path.parent.id.type === "Identifier"
    ) {
      functionName = path.parent.id.name;
    }
  }

  if (!functionName || !/^[A-Z]/.test(functionName)) {
    return;
  }

  let hasDecoHook = false;
  const reactiveProps = new Set<string>();

  const visitor: Visitor = {
    CallExpression(callPath) {
      const callee = callPath.node.callee;
      if (callee.type === "Identifier" && callee.name === "deco") {
        const arg = callPath.node.arguments[0];
        if (arg && arg.type === "ObjectExpression") {
          arg.properties.forEach((prop) => {
            if (
              prop.type === "ObjectProperty" &&
              prop.key.type === "Identifier"
            ) {
              const key = prop.key.name;
              if (key === "dark") {
                reactiveProps.add("colorScheme");
              } else if (["sm", "md", "lg", "xl", "2xl"].includes(key)) {
                reactiveProps.add("windowWidth");
              }
            }
          });
        }
        if (reactiveProps.size > 0) {
          callPath.replaceWith({
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "decoFn",
            },
            arguments: callPath.node.arguments,
          });
        }
      }
    },
    VariableDeclaration(varPath) {
      if (
        varPath.node.declarations.some(
          (d) =>
            d.id.type === "Identifier" &&
            d.id.name === "decoFn" &&
            d.init?.type === "CallExpression" &&
            (d.init.callee as Identifier).name === "useDeco"
        )
      ) {
        hasDecoHook = true;
      }
    },
  };

  path.traverse(visitor);

  if (reactiveProps.size > 0 && !hasDecoHook) {
    const decoHookDeclaration: VariableDeclaration = {
      type: "VariableDeclaration",
      declarations: [
        {
          type: "VariableDeclarator",
          id: {
            type: "Identifier",
            name: "decoFn",
          },
          init: {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "useDeco",
            },
            arguments: [
              {
                type: "ArrayExpression",
                elements: Array.from(reactiveProps).map((prop) => ({
                  type: "StringLiteral",
                  value: prop,
                })),
              },
            ],
          },
        },
      ],
      kind: "const",
    };

    // Add the hook declaration at the beginning of the function body
    if (path.node.body.type === "BlockStatement") {
      path.node.body.body.unshift(decoHookDeclaration);
    }
  }
}
