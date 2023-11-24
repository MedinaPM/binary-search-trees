/* eslint-disable max-classes-per-file */
class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(data) {
    this.root = this.buildTree(data);
  }

  buildTree(data) {
    // Sort and remove duplicates
    // The Set helps in removing duplicates, but it doesn't maintain the order
    // .sort() sorts an array in alphabetical order
    //    [80, 9, 100] => 100, 80, 9
    // .sort((a, b) => a - b) sorts an array in numerical order
    //    [80, 9, 100] => 9, 80, 100
    const uniqueSortedData = Array.from(new Set(data)).sort((a, b) => a - b);
    return this.buildBalancedBST(uniqueSortedData);
  }

  buildBalancedBST(data) {
    if (!data.length) return null;
    const mid = Math.floor(data.length / 2);
    const root = new Node(data[mid]);
    root.left = this.buildBalancedBST(data.slice(0, mid));
    root.right = this.buildBalancedBST(data.slice(mid + 1));
    return root;
  }

  insert(value) {
    this.root = this.insertNode(this.root, value);
  }

  insertNode(node, value) {
    const newNode = node;

    if (!newNode) {
      return new Node(value);
    }

    if (value < newNode.data) {
      newNode.left = this.insertNode(node.left, value);
    } else if (value > node.data) {
      newNode.right = this.insertNode(node.right, value);
    }

    return node;
  }

  delete(value) {
    this.root = this.deleteNode(this.root, value);
  }

  deleteNode(node, value) {
    const newNode = node;

    if (!newNode) {
      return null;
    }

    if (value < node.data) {
      newNode.left = this.deleteNode(node.left, value);
    } else if (value > node.data) {
      newNode.right = this.deleteNode(node.right, value);
    } else {
      if (!node.left) {
        return node.right;
      }

      if (!node.right) {
        return node.left;
      }

      const temp = this.findMinNode(node.right);
      newNode.data = temp.data;
      newNode.right = this.deleteNode(node.right, temp.data);
    }

    return node;
  }

  static findMinNode(node) {
    let newNode = node;

    while (node.left) {
      newNode = node.left;
    }
    return newNode;
  }

  find(value) {
    return this.findNode(this.root, value);
  }

  findNode(node, value) {
    if (!node) {
      return null;
    }

    if (value === node.data) {
      return node;
    }

    if (value < node.data) {
      return this.findNode(node.left, value);
    }

    return this.findNode(node.right, value);
  }

  levelOrder(callback) {
    const result = [];
    if (!this.root) return result;

    const queue = [this.root];
    while (queue.length > 0) {
      const currentNode = queue.shift();
      result.push(currentNode.data);
      if (currentNode.left) queue.push(currentNode.left);
      if (currentNode.right) queue.push(currentNode.right);
      if (callback) callback(currentNode.data);
    }
    return result;
  }

  preOrder(callback) {
    this.preOrderTraverse(this.root, callback);
  }

  preOrderTraverse(node, callback) {
    if (node) {
      callback(node.data);
      this.preOrderTraverse(node.left, callback);
      this.preOrderTraverse(node.right, callback);
    }
  }

  postOrder(callback) {
    this.postOrderTraverse(this.root, callback);
  }

  postOrderTraverse(node, callback) {
    if (node) {
      this.postOrderTraverse(node.left, callback);
      this.postOrderTraverse(node.right, callback);
      callback(node.data);
    }
  }

  inOrder(callback) {
    this.inOrderTraverse(this.root, callback);
  }

  inOrderTraverse(node, callback) {
    if (node) {
      this.inOrderTraverse(node.left, callback);
      callback(node.data);
      this.inOrderTraverse(node.right, callback);
    }
  }

  height(node) {
    if (!node) return -1;
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(node) {
    let depthCount = 0;
    let newNode = node;

    while (newNode !== this.root) {
      newNode = this.findParent(this.root, node);
      depthCount += 1;
    }
    return depthCount;
  }

  findParent(root, node) {
    if (!root || !node) return null;
    if (root.left === node || root.right === node) return root;
    if (node.data < root.data) return this.findParent(root.left, node);
    if (node.data > root.data) return this.findParent(root.right, node);

    return null;
  }

  isBalanced(node = this.root) {
    if (!node) return true;
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);
    return (
      Math.abs(leftHeight - rightHeight) <= 1 &&
      this.isBalanced(node.left) &&
      this.isBalanced(node.right)
    );
  }

  rebalance() {
    const nodes = this.inOrderTraversal();
    this.root = this.buildBalancedBST(nodes);
  }

  inOrderTraversal() {
    const result = [];
    this.inOrderTraverse(this.root, (node) => result.push(node.data));
    return result;
  }
}

// Driver code
function generateRandomNumbers(count) {
  const randomNumbers = [];
  for (let i = 0; i < count; i += 1) {
    randomNumbers.push(Math.floor(Math.random() * 100));
  }
  return randomNumbers;
}

const randomNumbersArray = generateRandomNumbers(15);
const tree = new Tree(randomNumbersArray);

console.log("Is the tree balanced initially?", tree.isBalanced());
console.log("Level Order:");
tree.levelOrder(console.log);
// Perform operations to unbalance the tree (add numbers > 100)
console.log("Is the tree unbalanced after modifications?", tree.isBalanced());
tree.rebalance();
console.log("Is the tree balanced after rebalancing?", tree.isBalanced());
console.log("Level Order after rebalancing:");
tree.levelOrder(console.log);