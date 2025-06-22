/** @import {BundledLanguage} from "shiki" */
/** @import {BundledTheme} from "shiki" */
/** @import {HighlighterGeneric} from "shiki" */

/**
 * @typedef DualTheme
 * @property {BundledTheme} light
 * @property {BundledTheme} dark
 */

/**
 *
 * @param {HighlighterGeneric<BundledLanguage,BundledTheme>} highlighter
 * @param {BundledTheme | DualTheme} [themes]
 * @return {import("@lwe8/text-types").TextileExtension}
 */
export default function textileShiki(highlighter, themes) {
  const _theme =
    themes && typeof themes === "object"
      ? { themes: { light: themes.light, dark: themes.dark } }
      : themes
      ? { theme: themes }
      : { theme: "github-light" };

  return {
    walkTree(node, index, parent) {
      if (node.type === "element" && node.tagName === "pre" && node.children) {
        const _code = node.children.find(
          (i) => i.type === "element" && i.tagName === "code"
        );
        if (
          _code &&
          _code.properties &&
          _code.properties.class &&
          _code.children
        ) {
          const lang =
            _code.properties.class
              .split(" ")
              .find((i) => i.startsWith("language-"))
              ?.split("-")[1] || "";
          const cd = _code.children.find((i) => i.type === "text");
          if (lang && cd) {
            const newNode = highlighter.codeToHast(cd.value, {
              lang,
              ..._theme,
            });
            parent.splice(index, 1, newNode.children[0]);
          }
        }
      }
    },
  };
}
