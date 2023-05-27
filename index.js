/** @typedef {string|function(array, number, object, object, object): string} CodeWrapStringOrContextContent A string or a function taking MarkdownIt parameters and returning a string. */
/**
 * Code Wrap, to wrap up your Markdown-It code fences with custom HTML.
 * @param {object} md MarkdownIt instance.
 * @param {object} [options] Markdown-It Code Wrap configuration.
 * @param {string} [options.wrapTag] Optional. HTML tag to use to wrap the code block. Defaults to `div`.
 * @param {string} [options.wrapClass] Optional. Does not add a `class` attribute if empty.
 * @param {boolean} [options.hasToolbar] Optional. Whether a toolbar is added in the wrapper, before the code block. Defaults to `false`.
 * @param {string} [options.toolbarTag] Optional. HTML tag to use to define the toolbar. Defaults to `div`.
 * @param {object} [options.toolbarClass] Optional. Class attribute to attach to the toolbar.
 * @param {CodeWrapStringOrContextContent} [options.toolbarLabel] Optional. The label to display in the toolbar. Can be a string, or if a function is provided, it takes the full renderer arguments to give context.
 * @param {boolean} [options.hasCopyButton] Optional. Whether a copy button is generated and added in the wrapper. Defaults to `true`.
 * @param {boolean} [options.isButtonInToolbar] Optional. Whether the copy button is in the toolbar instead of the wrapper. Defaults to `false`.
 * @param {CodeWrapStringOrContextContent} [options.copyButtonLabel] Optional. The label to display in the button. If a function is provided, it takes the full renderer arguments to give context. If a string is provided, it can be HTML or whitespace (but please add an aria-label attribute in that case!). Defaults to `Copy code`.
 * @param {Object.<string, CodeWrapStringOrContextContent>} [options.copyButtonAttrs] Optional. Attributes to attach to the button element. Any function provided takes the full renderer arguments to give context. Defaults to `{}`.
 * @param {boolean|string} [options.inlineCopyHandler] Optional. Defaults to `true`, which adds an `onclick` attribute to the button to copy the code. Can be overwritten with a string for inline code, or removed with `false` to allow authors to implement a global custom handler instead.
 */
function CodeWrap(md, options = {}) {
	if (!md) {
		throw new Error('A MarkdownIt instance must be provided!');
	}

	// Store defaults
	const proxy = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);
	const defaultFenceRenderer = md.renderer.rules.fence || proxy;
	const defaultCodeBlockRenderer = md.renderer.rules.code_block || proxy;

	// Parse options
	const wrapTag = options.wrapTag || 'div';
	const wrapClass = options.wrapClass || '';
	const hasToolbar = options.hasToolbar || false;
	const hasCopyButton = options.hasOwnProperty('hasCopyButton') ? Boolean(options.hasCopyButton) : true;
	const toolbarTag = options.toolbarTag || 'div';
	const toolbarLabel = options.toolbarLabel || '';
	const toolbarClass = options.toolbarClass || '';
	const isButtonInToolbar = options.isButtonInToolbar || false;
	const copyButtonGlobalAttrs = options.copyButtonAttrs || {};
	const copyButtonLabel = options.copyButtonLabel || 'Copy';
	const inlineCopyHandler = options.inlineCopyHandler === true;
	const defaultInlineCopyHandler =
		'navigator.clipboard.writeText(this.parentElement' + `${hasToolbar && isButtonInToolbar ? '.parentElement' : ''}` + ".querySelector('pre').innerText)"; // If the button is in a toolbar, go up one more level to find the parent element

	if (typeof wrapTag !== 'string') {
		throw new Error('The CodeWrap `wrapTag` property must be provided as a string');
	}
	if (typeof toolbarTag !== 'string') {
		throw new Error('The CodeWrap `toolbarTag` property must be provided as a string');
	}

	// A function that returns a function, so we can pass in the default renderer — currying? Probably…
	const customRenderer = (defaultRenderer) =>
		function (tokens, idx, options, env, self) {
			// Set up copy button attributes
			let copyButtonAttrs = { type: 'button' }; // You could overwrite this but… why?
			if (inlineCopyHandler) {
				copyButtonAttrs.onclick = inlineCopyHandler === true ? defaultInlineCopyHandler : inlineCopyHandler; // Add the onclick handler
			}
			Object.assign(copyButtonAttrs, copyButtonGlobalAttrs); // Expand the attributes with the user-provided ones

			// Create a string for all button attributes
			let buttonAttrs = Object.entries(copyButtonAttrs)
				.map((attr) => `${attr[0]}="${typeof attr[1] === 'function' ? attr[1](tokens, idx, options, env, self) : attr[1]}"`) // All attributes can be callbacks
				.join(' ');

			// Markup
			let wrapOpenTag = wrapClass ? `<${wrapTag} class="${wrapClass}">` : `<${wrapTag}>`;
			let wrapCloseTag = `</${wrapTag}>`;
			let buttonMarkup = `<button ${buttonAttrs}>${typeof copyButtonLabel === 'function' ? copyButtonLabel(tokens, idx, options, env, self) : copyButtonLabel}</button>`;
			let toolbar = hasToolbar
				? `<${toolbarTag} class="${toolbarClass}">${
						typeof toolbarLabel === 'function' ? toolbarLabel(tokens, idx, options, env, self) : toolbarLabel
				  }${buttonMarkup}</${toolbarTag}>`
				: '';
			let beforeClose = hasCopyButton && (!hasToolbar || !isButtonInToolbar) ? buttonMarkup : '';

			// console.log(tokens[idx]);
			return `${wrapOpenTag}${toolbar}${defaultRenderer(tokens, idx, options, env, self)}${beforeClose}${wrapCloseTag}`;
		};

	md.renderer.rules.fence = customRenderer(defaultFenceRenderer);
	md.renderer.rules.code_block = customRenderer(defaultCodeBlockRenderer);
}

module.exports = CodeWrap;
