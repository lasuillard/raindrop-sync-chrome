import '~/app.css';
import Page from './Page.svelte';

const page = new Page({
	target: document.getElementById('page') as HTMLElement
});

export default page;
