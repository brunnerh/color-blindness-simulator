import 'file-loader?name=[name].[ext]!./index.html';

import App from './js/components/app.svelte';

new App({
	target: document.body
});