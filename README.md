# markdown-it-codewrap

A Markdown-It plugin to wrap custom markup around blocks of code, optionally adding a Copy button.

## Options

You can customise how the wrapper renders with the following options:

| Property            | Type                                | Default        |
| ------------------- | ----------------------------------- | -------------- |
| `wrapTag`           | `string`                            | `'div'`        |
| `wrapClass`         | `string`                            | `''`           |
| `hasToolbar`        | `boolean`                           | `false`        |
| `toolbarTag`        | `string`                            | `'div'`        |
| `toolbarClass`      | `string`                            | `''`           |
| `toolbarLabel`      | `string\|function`                  | `''`           |
| `hasCopyButton`     | `boolean`                           | `true`         |
| `isButtonInToolbar` | `boolean`                           | `false`        |
| `copyButtonLabel`   | `string\|function`                  | `'Copy code'`. |
| `copyButtonAttrs`   | `Object.<string, string\|function>` | `''`           |
| `inlineCopyHandler` | `boolean\|string`                   | `true`         |

The `toolbarLabel`, `copyButtonLabel`, and property values of `copyButtonAttrs` can be a function, which all have the same signature, mimicking the original renderer function:

For example, if you want to show the code language in the toolbar, you can set your options object to the following:

```js
const codeWrapOptions = {
	toolbarLabel: (tokens, idx, options, env, self) => tokens[idx].info.toUpperCase(),
};
```

You could also customise your Copy button:

```js
const codeWrapOptions = {
	copyButtonLabel: (tokens, idx, options, env, self) => `Copy ${tokens[idx].info.toUpperCase()} code`,
	copyButtonAttrs: {
		'data-copy': (tokens, idx, options, env, self) => tokens[idx].info,
	},
};
```
