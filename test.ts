type Item = {
    id: number | string;
    parent: number | string;
    [key: string]: any;
  };
  
  type Node = {
    item: Item;
    children: Node[];
    parent: Node | null;
  };
  
class TreeStore {
    private nodes: Record<string, Node> = {};
    private root: Node | null = null;

    constructor(items: Item[]) {
        // Создаем объекты-узлы для каждого элемента дерева
        items.forEach((item) => {
            const node = { item, children: [], parent: null };
            this.nodes[item.id] = node;
        });

        // Связываем узлы в дерево
        Object.values(this.nodes).forEach((node) => {
            const parent = this.nodes[node.item.parent];
            if (parent) {
                node.parent = parent;
                parent.children.push(node);
            } else {
                this.root = node;
            }
        });
    }

    getAll(): Item[] {
        return Object.values(this.nodes).map((node) => node.item);
    }

    getItem(id: number | string): Item | undefined {
        const node = this.nodes[id];
        return node ? node.item : undefined;
    }

    getChildren(id: number | string): Item[] {
        const node = this.nodes[id];
        return node ? node.children.map((child) => child.item) : [];
    }

    getAllChildren(id: number | string): Item[] {
        const node = this.nodes[id];
        if (!node) return [];

        const queue = [...node.children];
        const result = [];

        while (queue.length > 0) {
            const node = queue.shift()!;
            result.push(node.item);
            queue.push(...node.children);
        }

        return result;
    }

    getAllParents(id: number | string): Item[] {
        const node = this.nodes[id];
        if (!node) return [];

        const result = [];
        let current = node.parent;

        while (current) {
            result.unshift(current.item);
            current = current.parent;
        }

        return result;
    }
}

const items: Item[] = [
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },

    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },

    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
]

const ts = new TreeStore(items);

console.log(ts.getAll()) // [{"id":1,"parent":"root"},{"id":2,"parent":1,"type":"test"},{"id":3,"parent":1,"type":"test"},{"id":4,"parent":2,"type":"test"},{"id":5,"parent":2,"type":"test"},{"id":6,"parent":2,"type":"test"},{"id":7,"parent":4,"type":null},{"id":8,"parent":4,"type":null}]

console.log(ts.getItem(7)) // {"id":7,"parent":4,"type":null}

console.log(ts.getChildren(4)) // [{"id":7,"parent":4,"type":null},{"id":8,"parent":4,"type":null}]
console.log(ts.getChildren(5)) // []
console.log(ts.getChildren(2)) // [{"id":4,"parent":2,"type":"test"},{"id":5,"parent":2,"type":"test"},{"id":6,"parent":2,"type":"test"}]
console.log(ts.getAllChildren(2)) // [{"id":4,"parent":2,"type":"test"},{"id":5,"parent":2,"type":"test"},{"id":6,"parent":2,"type":"test"},{"id":7,"parent":4,"type":null},{"id":8,"parent":4,"type":null}]

console.log(ts.getAllParents(7)) // [{"id":4,"parent":2,"type":"test"},{"id":2,"parent":1,"type":"test"},{"id":1,"parent":"root"}]