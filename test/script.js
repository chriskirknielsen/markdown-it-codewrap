const markdownIt = require('markdown-it');
let markdownItCodeWrap = require('markdown-it-codewrap');
let markdownItCodeWrapOptions = {
	wrapTag: 'figure',
	wrapClass: 'codeblock',
	hasToolbar: true,
	hasCopyButton: true,
	toolbarTag: 'figcaption',
	toolbarClass: 'codeblock-toolbar',
	toolbarLabel: (tokens, idx, options, env, self) => tokens[idx].info.toUpperCase(),
	isButtonInToolbar: true,
	copyButtonAttrs: { class: 'codeblock-button' },
	copyButtonLabel: 'Copy code',
	inlineCopyHandler: true,
};
const md = new markdownIt().use(markdownItCodeWrap, markdownItCodeWrapOptions);

console.log(
	md.render(`
\`\`\`css
#id.class[data-attr="test"] {
    display: flex !important;
}
\`\`\``)
);
