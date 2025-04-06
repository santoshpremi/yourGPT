import { visit } from "unist-util-visit";

/**
 * Plugin to turn `:cite` directives into <cite> tags with a source attribute.
 */
const RemarkCitePlugin = () => {
  return (tree, file) => {
    visit(tree, function (node) {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        if (node.name !== "cite") {
          node.type = "text";
          node.value = ":" + node.name;
          return;
        }

        const data = node.data || (node.data = {});

        if (node.type !== "textDirective") {
          file.fail("Unexpected `:cite` directive, must be text", node);
        }

        const child = node.children[0];
        if (child == undefined || child.type !== "text") {
          return;
        }

        data.hName = "cite";
        data.hProperties = {
          source: child.value,
        };
      }
    });
  };
};

export default RemarkCitePlugin;
