/**
 * Generic tree class.
 */
export class TreeNode<T> {
	private _data: T | null;
	private _parent: TreeNode<T> | null = null;
	private _children: TreeNode<T>[] = [];

	/**
	 * Create tree node.
	 * @param data Node data.
	 * @param children Initial tree children.
	 */
	constructor(data: T | null, children?: TreeNode<T>[]) {
		this._data = data;
		if (children) {
			this.addChildren(...children);
		}
	}

	get data(): T | null {
		return this._data;
	}

	get parent(): TreeNode<T> | null {
		return this._parent;
	}

	set parent(parent: TreeNode<T>) {
		this._parent = parent;
		parent._children.push(this);
	}

	isRoot(): boolean {
		return this._parent === null;
	}

	get children(): TreeNode<T>[] {
		return this._children;
	}

	/**
	 * Add children to current node.
	 * @param children Children nodes to append.
	 */
	addChildren(...children: TreeNode<T>[]) {
		this._children.push(...children);
		for (const child of children) {
			child._parent = this;
		}
	}

	/**
	 * Pre-order traverse this tree.
	 * @param callbackFn Function to be called with traversing nodes.
	 */
	traverse(callbackFn: (node: TreeNode<T>) => void) {
		callbackFn(this);
		for (const child of this.children) {
			child.traverse(callbackFn);
		}
	}
}

/**
 * Interface for building tree, {@link TreeNode}.
 */
export interface TreeSource<D, T> {
	/** Raw data for referencing. */
	data: D;

	/** Get ID of source. */
	get id(): string;

	/** Return source' parent ID. Should return `null` if parent is root. */
	get parent(): string | null;

	/** Create {@link TreeNode} from current source. */
	toNode(): TreeNode<T>;
}

/**
 * Create the tree recursively.
 * @param parent Parent node.
 * @param parentID ID of parent node.
 * @param source Full list of all source nodes.
 */
function buildTree<_, T>(parent: TreeNode<T>, parentID: string | null, source: TreeSource<_, T>[]) {
	const children = source.filter((src) => src.parent == parentID);
	for (const src of children) {
		const srcNode = src.toNode();
		buildTree(srcNode, src.id, source);
		parent.addChildren(srcNode);
	}
}

/**
 * Create the tree from sources.
 * @param data Data of root node.
 * @param source Array of sources.
 * @returns Root node of built tree.
 */
export function makeTree<_, T>(data: T, source: TreeSource<_, T>[]): TreeNode<T> {
	const root = new TreeNode<T>(data);
	buildTree(root, null, source);
	return root;
}

/* c8 ignore start */
if (import.meta.vitest) {
	const { expect, it } = import.meta.vitest;

	it('should have following default values', () => {
		const node = new TreeNode('test');
		expect(node.data).toEqual('test');
		expect(node.parent).toBeNull();
		expect(node.children).toEqual([]);
	});

	it('can be built from array of sources', () => {
		/**
		 *   1
		 *  / \
		 * 2   3
		 *    / \
		 *   4   5
		 *      /
		 *     6
		 */
		const data: Pick<TreeSource<string, string>, 'data' | 'id' | 'parent'>[] = [
			{ data: '1', id: '1', parent: null },
			{ data: '2', id: '2', parent: '1' },
			{ data: '3', id: '3', parent: '1' },
			{ data: '4', id: '4', parent: '3' },
			{ data: '5', id: '5', parent: '3' },
			{ data: '6', id: '6', parent: '5' }
		];
		const source: TreeSource<string, string>[] = data.map((data) => ({
			...data,
			toNode() {
				return new TreeNode(this.data);
			}
		}));
		const tree = makeTree(null, source);
		const visits: (string | null)[] = [];
		tree.traverse((node) => {
			visits.push(node.data);
		});
		expect(visits).toEqual([null, '1', '2', '3', '4', '5', '6']);
	});
}
/* c8 ignore stop */
