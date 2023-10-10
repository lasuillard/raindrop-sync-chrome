import type { Collection } from '~/lib/raindrop/collections';
import type { TreeNode } from '~/lib/tree';

/**
 * Create Chrome bookmarks for given collections recursively.
 * @param parentId Parent bookmark ID.
 * @param tree Root node of tree.
 */
export async function createBookmarks(parentId: string, tree: TreeNode<Collection>) {
	// Create all bookmarks
	const raindrops = (await tree.data?.getBookmarks()) ?? [];
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
