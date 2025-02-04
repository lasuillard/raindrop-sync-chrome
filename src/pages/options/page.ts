import { mount } from 'svelte';
import '~/app.css';
import Page from './Page.svelte';

const page = mount(Page, {
	target: document.getElementById('page') as HTMLElement
});

export default page;
