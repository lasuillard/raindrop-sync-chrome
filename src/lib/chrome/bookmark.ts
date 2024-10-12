import { generated, utils } from '@lasuillard/raindrop-client';
import rd from '~/lib/raindrop';

/**
 * Create Chrome bookmarks for given collections recursively.
 * @param parentId Parent bookmark ID.
 * @param tree Root node of tree.
 */
export async function createBookmarks(
	parentId: string,
	tree: utils.tree.TreeNode<generated.Collection | null>
) {
	// Create all bookmarks
	const raindrops = tree.data?._id ? await rd.raindrop.getAllRaindrops(tree.data?._id) : [];
	await Promise.all(
		raindrops.map((rd) =>
			chrome.bookmarks.create({
				parentId,
				title: rd.title,
				url: rd.link
			})
		)
	);

	// Recursion on child collections
	await Promise.all(
		tree.children.map(async (collection) => {
			chrome.bookmarks.create(
				{
					parentId,
					title: collection.data?.title || 'No Title'
				},
				async (result) => await createBookmarks(result.id, collection)
			);
		})
	);
}

/**
 * Clear all bookmarks in a folder.
 * @param folder Folder to clear bookmarks.
 */
export async function clearBookmarks(folder: chrome.bookmarks.BookmarkTreeNode) {
	for (const child of folder.children ?? []) {
		await chrome.bookmarks.removeTree(child.id);
	}
}
