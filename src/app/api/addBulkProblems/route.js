import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
const problems = [
  // ========== EASY PROBLEMS (10) ==========
  {
    problemId: "p1",
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    difficulty: "easy",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
      { input: "[3,2,4]\n6", expectedOutput: "[1,2]" },
      { input: "[3,3]\n6", expectedOutput: "[0,1]" },
    ],
    constraints:
      "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here
    
}

int main() {
    int n, target;
    cin >> n;
    vector<int> nums(n);
    for(int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    cin >> target;
    
    vector<int> result = twoSum(nums, target);
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}`,
      python: `def two_sum(nums, target):
    # Write your code here
    pass

if __name__ == "__main__":
    nums = list(map(int, input().strip('[]').split(',')))
    target = int(input())
    result = two_sum(nums, target)
    print(f"[{result[0]},{result[1]}]")`,
      javascript: `function twoSum(nums, target) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
}).on('close', () => {
    const nums = JSON.parse(lines[0]);
    const target = parseInt(lines[1]);
    const result = twoSum(nums, target);
    console.log(\`[\${result[0]},\${result[1]}]\`);
});`,
      java: `import java.util.*;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        input = input.substring(1, input.length()-1);
        String[] parts = input.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        int target = sc.nextInt();
        
        int[] result = twoSum(nums, target);
        System.out.println("[" + result[0] + "," + result[1] + "]");
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p2",
    title: "Palindrome Number",
    description:
      "Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same backward as forward.",
    difficulty: "easy",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "121", expectedOutput: "true" },
      { input: "-121", expectedOutput: "false" },
      { input: "10", expectedOutput: "false" },
    ],
    constraints: "-2^31 <= x <= 2^31 - 1",
    baseCode: {
      cpp: `#include <iostream>
using namespace std;

bool isPalindrome(int x) {
    // Write your code here
    
}

int main() {
    int x;
    cin >> x;
    cout << (isPalindrome(x) ? "true" : "false") << endl;
    return 0;
}`,
      python: `def is_palindrome(x):
    # Write your code here
    pass

if __name__ == "__main__":
    x = int(input())
    print("true" if is_palindrome(x) else "false")`,
      javascript: `function isPalindrome(x) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const x = parseInt(line);
    console.log(isPalindrome(x) ? 'true' : 'false');
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static boolean isPalindrome(int x) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        System.out.println(isPalindrome(x) ? "true" : "false");
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p3",
    title: "Reverse String",
    description:
      "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
    difficulty: "easy",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      {
        input: '["h","e","l","l","o"]',
        expectedOutput: '["o","l","l","e","h"]',
      },
      {
        input: '["H","a","n","n","a","h"]',
        expectedOutput: '["h","a","n","n","a","H"]',
      },
    ],
    constraints: "1 <= s.length <= 10^5\ns[i] is a printable ascii character",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void reverseString(vector<char>& s) {
    // Write your code here
    
}

int main() {
    string input;
    getline(cin, input);
    vector<char> s;
    for(int i = 2; i < input.length(); i += 4) {
        s.push_back(input[i]);
    }
    
    reverseString(s);
    
    cout << "[";
    for(int i = 0; i < s.size(); i++) {
        cout << "\\"" << s[i] << "\\"";
        if(i < s.size()-1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      python: `def reverse_string(s):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    s = json.loads(input())
    reverse_string(s)
    print(json.dumps(s))`,
      javascript: `function reverseString(s) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const s = JSON.parse(line);
    reverseString(s);
    console.log(JSON.stringify(s));
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static void reverseString(char[] s) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        input = input.substring(1, input.length()-1);
        String[] parts = input.split(",");
        char[] s = new char[parts.length];
        for(int i = 0; i < parts.length; i++) {
            s[i] = parts[i].charAt(1);
        }
        
        reverseString(s);
        
        System.out.print("[");
        for(int i = 0; i < s.length; i++) {
            System.out.print("\\"" + s[i] + "\\"");
            if(i < s.length-1) System.out.print(",");
        }
        System.out.println("]");
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p4",
    title: "Valid Parentheses",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets and open brackets must be closed in the correct order.",
    difficulty: "easy",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "()", expectedOutput: "true" },
      { input: "()[]{}", expectedOutput: "true" },
      { input: "(]", expectedOutput: "false" },
    ],
    constraints:
      "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'",
    baseCode: {
      cpp: `#include <iostream>
#include <string>
using namespace std;

bool isValid(string s) {
    // Write your code here
    
}

int main() {
    string s;
    cin >> s;
    cout << (isValid(s) ? "true" : "false") << endl;
    return 0;
}`,
      python: `def is_valid(s):
    # Write your code here
    pass

if __name__ == "__main__":
    s = input()
    print("true" if is_valid(s) else "false")`,
      javascript: `function isValid(s) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    console.log(isValid(line) ? 'true' : 'false');
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static boolean isValid(String s) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(isValid(s) ? "true" : "false");
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p5",
    title: "Maximum Subarray Sum",
    description:
      "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. (Kadane's Algorithm)",
    difficulty: "easy",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
      { input: "[1]", expectedOutput: "1" },
      { input: "[5,4,-1,7,8]", expectedOutput: "23" },
    ],
    constraints: "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string input;
    getline(cin, input);
    vector<int> nums;
    input = input.substr(1, input.length()-2);
    size_t pos = 0;
    while((pos = input.find(',')) != string::npos) {
        nums.push_back(stoi(input.substr(0, pos)));
        input.erase(0, pos + 1);
    }
    if(!input.empty()) nums.push_back(stoi(input));
    
    cout << maxSubArray(nums) << endl;
    return 0;
}`,
      python: `def max_sub_array(nums):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    nums = json.loads(input())
    print(max_sub_array(nums))`,
      javascript: `function maxSubArray(nums) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const nums = JSON.parse(line);
    console.log(maxSubArray(nums));
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static int maxSubArray(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        input = input.substring(1, input.length()-1);
        String[] parts = input.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        
        System.out.println(maxSubArray(nums));
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p6",
    title: "Merge Two Sorted Lists",
    description:
      "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
    difficulty: "easy",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "[1,2,4]\n[1,3,4]", expectedOutput: "[1,1,2,3,4,4]" },
      { input: "[]\n[]", expectedOutput: "[]" },
      { input: "[]\n[0]", expectedOutput: "[0]" },
    ],
    constraints:
      "The number of nodes in both lists is in the range [0, 50]\n-100 <= Node.val <= 100",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    // Write your code here
    
}

ListNode* createList(vector<int>& arr) {
    if(arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* curr = head;
    for(int i = 1; i < arr.size(); i++) {
        curr->next = new ListNode(arr[i]);
        curr = curr->next;
    }
    return head;
}

void printList(ListNode* head) {
    cout << "[";
    while(head) {
        cout << head->val;
        if(head->next) cout << ",";
        head = head->next;
    }
    cout << "]" << endl;
}

int main() {
    // Read and parse input for two lists
    string line1, line2;
    getline(cin, line1);
    getline(cin, line2);
    
    vector<int> arr1, arr2;
    // Parsing logic omitted for brevity
    
    ListNode* l1 = createList(arr1);
    ListNode* l2 = createList(arr2);
    ListNode* result = mergeTwoLists(l1, l2);
    printList(result);
    return 0;
}`,
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(list1, list2):
    # Write your code here
    pass

def create_list(arr):
    if not arr:
        return None
    head = ListNode(arr[0])
    curr = head
    for i in range(1, len(arr)):
        curr.next = ListNode(arr[i])
        curr = curr.next
    return head

def print_list(head):
    result = []
    while head:
        result.append(str(head.val))
        head = head.next
    print("[" + ",".join(result) + "]")

if __name__ == "__main__":
    import json
    arr1 = json.loads(input())
    arr2 = json.loads(input())
    l1 = create_list(arr1)
    l2 = create_list(arr2)
    result = merge_two_lists(l1, l2)
    print_list(result)`,
      javascript: `class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function mergeTwoLists(list1, list2) {
    // Write your code here
    
}

function createList(arr) {
    if(arr.length === 0) return null;
    let head = new ListNode(arr[0]);
    let curr = head;
    for(let i = 1; i < arr.length; i++) {
        curr.next = new ListNode(arr[i]);
        curr = curr.next;
    }
    return head;
}

function printList(head) {
    let result = [];
    while(head) {
        result.push(head.val);
        head = head.next;
    }
    console.log(JSON.stringify(result));
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
    if(lines.length === 2) {
        const arr1 = JSON.parse(lines[0]);
        const arr2 = JSON.parse(lines[1]);
        const l1 = createList(arr1);
        const l2 = createList(arr2);
        const result = mergeTwoLists(l1, l2);
        printList(result);
        rl.close();
    }
});`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public class Solution {
    public static ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Write your code here
        
    }
    
    public static ListNode createList(int[] arr) {
        if(arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode curr = head;
        for(int i = 1; i < arr.length; i++) {
            curr.next = new ListNode(arr[i]);
            curr = curr.next;
        }
        return head;
    }
    
    public static void printList(ListNode head) {
        System.out.print("[");
        while(head != null) {
            System.out.print(head.val);
            if(head.next != null) System.out.print(",");
            head = head.next;
        }
        System.out.println("]");
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Input parsing logic omitted for brevity
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p7",
    title: "Best Time to Buy and Sell Stock",
    description:
      "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    difficulty: "easy",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "[7,1,5,3,6,4]", expectedOutput: "5" },
      { input: "[7,6,4,3,1]", expectedOutput: "0" },
    ],
    constraints: "1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int maxProfit(vector<int>& prices) {
    // Write your code here
    
}

int main() {
    string input;
    getline(cin, input);
    vector<int> prices;
    input = input.substr(1, input.length()-2);
    size_t pos = 0;
    while((pos = input.find(',')) != string::npos) {
        prices.push_back(stoi(input.substr(0, pos)));
        input.erase(0, pos + 1);
    }
    if(!input.empty()) prices.push_back(stoi(input));
    
    cout << maxProfit(prices) << endl;
    return 0;
}`,
      python: `def max_profit(prices):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    prices = json.loads(input())
    print(max_profit(prices))`,
      javascript: `function maxProfit(prices) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const prices = JSON.parse(line);
    console.log(maxProfit(prices));
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static int maxProfit(int[] prices) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        input = input.substring(1, input.length()-1);
        String[] parts = input.split(",");
        int[] prices = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            prices[i] = Integer.parseInt(parts[i]);
        }
        
        System.out.println(maxProfit(prices));
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p8",
    title: "Contains Duplicate",
    description:
      "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    difficulty: "easy",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "[1,2,3,1]", expectedOutput: "true" },
      { input: "[1,2,3,4]", expectedOutput: "false" },
      { input: "[1,1,1,3,3,4,3,2,4,2]", expectedOutput: "true" },
    ],
    constraints: "1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

bool containsDuplicate(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string input;
    getline(cin, input);
    vector<int> nums;
    input = input.substr(1, input.length()-2);
    size_t pos = 0;
    while((pos = input.find(',')) != string::npos) {
        nums.push_back(stoi(input.substr(0, pos)));
        input.erase(0, pos + 1);
    }
    if(!input.empty()) nums.push_back(stoi(input));
    
    cout << (containsDuplicate(nums) ? "true" : "false") << endl;
    return 0;
}`,
      python: `def contains_duplicate(nums):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    nums = json.loads(input())
    print("true" if contains_duplicate(nums) else "false")`,
      javascript: `function containsDuplicate(nums) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const nums = JSON.parse(line);
    console.log(containsDuplicate(nums) ? 'true' : 'false');
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static boolean containsDuplicate(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        input = input.substring(1, input.length()-1);
        String[] parts = input.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        
        System.out.println(containsDuplicate(nums) ? "true" : "false");
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p9",
    title: "Missing Number",
    description:
      "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
    difficulty: "easy",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "[3,0,1]", expectedOutput: "2" },
      { input: "[0,1]", expectedOutput: "2" },
      { input: "[9,6,4,2,3,5,7,0,1]", expectedOutput: "8" },
    ],
    constraints: "n == nums.length\n1 <= n <= 10^4\n0 <= nums[i] <= n",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int missingNumber(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string input;
    getline(cin, input);
    vector<int> nums;
    input = input.substr(1, input.length()-2);
    size_t pos = 0;
    while((pos = input.find(',')) != string::npos) {
        nums.push_back(stoi(input.substr(0, pos)));
        input.erase(0, pos + 1);
    }
    if(!input.empty()) nums.push_back(stoi(input));
    
    cout << missingNumber(nums) << endl;
    return 0;
}`,
      python: `def missing_number(nums):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    nums = json.loads(input())
    print(missing_number(nums))`,
      javascript: `function missingNumber(nums) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const nums = JSON.parse(line);
    console.log(missingNumber(nums));
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static int missingNumber(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        input = input.substring(1, input.length()-1);
        String[] parts = input.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        
        System.out.println(missingNumber(nums));
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p10",
    title: "Single Number",
    description:
      "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
    difficulty: "easy",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "[2,2,1]", expectedOutput: "1" },
      { input: "[4,1,2,1,2]", expectedOutput: "4" },
      { input: "[1]", expectedOutput: "1" },
    ],
    constraints:
      "1 <= nums.length <= 3 * 10^4\n-3 * 10^4 <= nums[i] <= 3 * 10^4",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int singleNumber(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string input;
    getline(cin, input);
    vector<int> nums;
    input = input.substr(1, input.length()-2);
    size_t pos = 0;
    while((pos = input.find(',')) != string::npos) {
        nums.push_back(stoi(input.substr(0, pos)));
        input.erase(0, pos + 1);
    }
    if(!input.empty()) nums.push_back(stoi(input));
    
    cout << singleNumber(nums) << endl;
    return 0;
}`,
      python: `def single_number(nums):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    nums = json.loads(input())
    print(single_number(nums))`,
      javascript: `function singleNumber(nums) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const nums = JSON.parse(line);
    console.log(singleNumber(nums));
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static int singleNumber(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        input = input.substring(1, input.length()-1);
        String[] parts = input.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        
        System.out.println(singleNumber(nums));
    }
}`,
    },
    createdAt: Date.now(),
  },

  // ========== MEDIUM PROBLEMS (10) ==========
  {
    problemId: "p11",
    title: "3Sum",
    description:
      "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.",
    difficulty: "medium",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "[-1,0,1,2,-1,-4]", expectedOutput: "[[-1,-1,2],[-1,0,1]]" },
      { input: "[0,1,1]", expectedOutput: "[]" },
      { input: "[0,0,0]", expectedOutput: "[[0,0,0]]" },
    ],
    constraints: "3 <= nums.length <= 3000\n-10^5 <= nums[i] <= 10^5",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> threeSum(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string input;
    getline(cin, input);
    vector<int> nums;
    input = input.substr(1, input.length()-2);
    size_t pos = 0;
    while((pos = input.find(',')) != string::npos) {
        nums.push_back(stoi(input.substr(0, pos)));
        input.erase(0, pos + 1);
    }
    if(!input.empty()) nums.push_back(stoi(input));
    
    vector<vector<int>> result = threeSum(nums);
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        cout << "[";
        for(int j = 0; j < result[i].size(); j++) {
            cout << result[i][j];
            if(j < result[i].size()-1) cout << ",";
        }
        cout << "]";
        if(i < result.size()-1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      python: `def three_sum(nums):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    nums = json.loads(input())
    result = three_sum(nums)
    print(json.dumps(result))`,
      javascript: `function threeSum(nums) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const nums = JSON.parse(line);
    console.log(JSON.stringify(threeSum(nums)));
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static List<List<Integer>> threeSum(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        input = input.substring(1, input.length()-1);
        String[] parts = input.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        
        List<List<Integer>> result = threeSum(nums);
        System.out.print("[");
        for(int i = 0; i < result.size(); i++) {
            System.out.print("[");
            for(int j = 0; j < result.get(i).size(); j++) {
                System.out.print(result.get(i).get(j));
                if(j < result.get(i).size()-1) System.out.print(",");
            }
            System.out.print("]");
            if(i < result.size()-1) System.out.print(",");
        }
        System.out.println("]");
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p12",
    title: "Longest Substring Without Repeating Characters",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    difficulty: "medium",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "abcabcbb", expectedOutput: "3" },
      { input: "bbbbb", expectedOutput: "1" },
      { input: "pwwkew", expectedOutput: "3" },
    ],
    constraints:
      "0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces",
    baseCode: {
      cpp: `#include <iostream>
#include <string>
using namespace std;

int lengthOfLongestSubstring(string s) {
    // Write your code here
    
}

int main() {
    string s;
    getline(cin, s);
    cout << lengthOfLongestSubstring(s) << endl;
    return 0;
}`,
      python: `def length_of_longest_substring(s):
    # Write your code here
    pass

if __name__ == "__main__":
    s = input()
    print(length_of_longest_substring(s))`,
      javascript: `function lengthOfLongestSubstring(s) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    console.log(lengthOfLongestSubstring(line));
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static int lengthOfLongestSubstring(String s) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(lengthOfLongestSubstring(s));
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p13",
    title: "Container With Most Water",
    description:
      "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    difficulty: "medium",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "[1,8,6,2,5,4,8,3,7]", expectedOutput: "49" },
      { input: "[1,1]", expectedOutput: "1" },
    ],
    constraints: "n == height.length\n2 <= n <= 10^5\n0 <= height[i] <= 10^4",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int maxArea(vector<int>& height) {
    // Write your code here
    
}

int main() {
    string input;
    getline(cin, input);
    vector<int> height;
    input = input.substr(1, input.length()-2);
    size_t pos = 0;
    while((pos = input.find(',')) != string::npos) {
        height.push_back(stoi(input.substr(0, pos)));
        input.erase(0, pos + 1);
    }
    if(!input.empty()) height.push_back(stoi(input));
    
    cout << maxArea(height) << endl;
    return 0;
}`,
      python: `def max_area(height):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    height = json.loads(input())
    print(max_area(height))`,
      javascript: `function maxArea(height) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const height = JSON.parse(line);
    console.log(maxArea(height));
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static int maxArea(int[] height) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        input = input.substring(1, input.length()-1);
        String[] parts = input.split(",");
        int[] height = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            height[i] = Integer.parseInt(parts[i]);
        }
        
        System.out.println(maxArea(height));
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p14",
    title: "Group Anagrams",
    description:
      "Given an array of strings strs, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    difficulty: "medium",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      {
        input: '["eat","tea","tan","ate","nat","bat"]',
        expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      },
      { input: '[""]', expectedOutput: '[[""]]' },
      { input: '["a"]', expectedOutput: '[["a"]]' },
    ],
    constraints:
      "1 <= strs.length <= 10^4\n0 <= strs[i].length <= 100\nstrs[i] consists of lowercase English letters",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<vector<string>> groupAnagrams(vector<string>& strs) {
    // Write your code here
    
}

int main() {
    string input;
    getline(cin, input);
    vector<string> strs;
    // Parsing logic for string array
    
    vector<vector<string>> result = groupAnagrams(strs);
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        cout << "[";
        for(int j = 0; j < result[i].size(); j++) {
            cout << "\\"" << result[i][j] << "\\"";
            if(j < result[i].size()-1) cout << ",";
        }
        cout << "]";
        if(i < result.size()-1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      python: `def group_anagrams(strs):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    strs = json.loads(input())
    result = group_anagrams(strs)
    print(json.dumps(result))`,
      javascript: `function groupAnagrams(strs) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const strs = JSON.parse(line);
    console.log(JSON.stringify(groupAnagrams(strs)));
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static List<List<String>> groupAnagrams(String[] strs) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        // Parsing logic for string array
        
        List<List<String>> result = groupAnagrams(strs);
        // Print logic
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p15",
    title: "Longest Palindromic Substring",
    description:
      "Given a string s, return the longest palindromic substring in s.",
    difficulty: "medium",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "babad", expectedOutput: "bab" },
      { input: "cbbd", expectedOutput: "bb" },
    ],
    constraints:
      "1 <= s.length <= 1000\ns consist of only digits and English letters",
    baseCode: {
      cpp: `#include <iostream>
#include <string>
using namespace std;

string longestPalindrome(string s) {
    // Write your code here
    
}

int main() {
    string s;
    getline(cin, s);
    cout << longestPalindrome(s) << endl;
    return 0;
}`,
      python: `def longest_palindrome(s):
    # Write your code here
    pass

if __name__ == "__main__":
    s = input()
    print(longest_palindrome(s))`,
      javascript: `function longestPalindrome(s) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    console.log(longestPalindrome(line));
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static String longestPalindrome(String s) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(longestPalindrome(s));
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p16",
    title: "Product of Array Except Self",
    description:
      "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.",
    difficulty: "medium",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "[1,2,3,4]", expectedOutput: "[24,12,8,6]" },
      { input: "[-1,1,0,-3,3]", expectedOutput: "[0,0,9,0,0]" },
    ],
    constraints: "2 <= nums.length <= 10^5\n-30 <= nums[i] <= 30",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> productExceptSelf(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string input;
    getline(cin, input);
    vector<int> nums;
    input = input.substr(1, input.length()-2);
    size_t pos = 0;
    while((pos = input.find(',')) != string::npos) {
        nums.push_back(stoi(input.substr(0, pos)));
        input.erase(0, pos + 1);
    }
    if(!input.empty()) nums.push_back(stoi(input));
    
    vector<int> result = productExceptSelf(nums);
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        cout << result[i];
        if(i < result.size()-1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      python: `def product_except_self(nums):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    nums = json.loads(input())
    result = product_except_self(nums)
    print(json.dumps(result))`,
      javascript: `function productExceptSelf(nums) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const nums = JSON.parse(line);
    console.log(JSON.stringify(productExceptSelf(nums)));
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static int[] productExceptSelf(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        input = input.substring(1, input.length()-1);
        String[] parts = input.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        
        int[] result = productExceptSelf(nums);
        System.out.print("[");
        for(int i = 0; i < result.length; i++) {
            System.out.print(result[i]);
            if(i < result.length-1) System.out.print(",");
        }
        System.out.println("]");
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p17",
    title: "Rotate Image",
    description:
      "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.",
    difficulty: "medium",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      {
        input: "[[1,2,3],[4,5,6],[7,8,9]]",
        expectedOutput: "[[7,4,1],[8,5,2],[9,6,3]]",
      },
      {
        input: "[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]",
        expectedOutput: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]",
      },
    ],
    constraints:
      "n == matrix.length == matrix[i].length\n1 <= n <= 20\n-1000 <= matrix[i][j] <= 1000",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void rotate(vector<vector<int>>& matrix) {
    // Write your code here
    
}

int main() {
    // Matrix input parsing logic
    int n;
    cin >> n;
    vector<vector<int>> matrix(n, vector<int>(n));
    for(int i = 0; i < n; i++) {
        for(int j = 0; j < n; j++) {
            cin >> matrix[i][j];
        }
    }
    
    rotate(matrix);
    
    cout << "[";
    for(int i = 0; i < n; i++) {
        cout << "[";
        for(int j = 0; j < n; j++) {
            cout << matrix[i][j];
            if(j < n-1) cout << ",";
        }
        cout << "]";
        if(i < n-1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      python: `def rotate(matrix):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    matrix = json.loads(input())
    rotate(matrix)
    print(json.dumps(matrix))`,
      javascript: `function rotate(matrix) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const matrix = JSON.parse(line);
    rotate(matrix);
    console.log(JSON.stringify(matrix));
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static void rotate(int[][] matrix) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Matrix input parsing logic
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p18",
    title: "Search in Rotated Sorted Array",
    description:
      "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k. Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums. You must write an algorithm with O(log n) runtime complexity.",
    difficulty: "medium",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "[4,5,6,7,0,1,2]\n0", expectedOutput: "4" },
      { input: "[4,5,6,7,0,1,2]\n3", expectedOutput: "-1" },
      { input: "[1]\n0", expectedOutput: "-1" },
    ],
    constraints:
      "1 <= nums.length <= 5000\n-10^4 <= nums[i] <= 10^4\nAll values of nums are unique",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int search(vector<int>& nums, int target) {
    // Write your code here
    
}

int main() {
    string input;
    getline(cin, input);
    vector<int> nums;
    input = input.substr(1, input.length()-2);
    size_t pos = 0;
    while((pos = input.find(',')) != string::npos) {
        nums.push_back(stoi(input.substr(0, pos)));
        input.erase(0, pos + 1);
    }
    if(!input.empty()) nums.push_back(stoi(input));
    
    int target;
    cin >> target;
    
    cout << search(nums, target) << endl;
    return 0;
}`,
      python: `def search(nums, target):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    nums = json.loads(input())
    target = int(input())
    print(search(nums, target))`,
      javascript: `function search(nums, target) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
    if(lines.length === 2) {
        const nums = JSON.parse(lines[0]);
        const target = parseInt(lines[1]);
        console.log(search(nums, target));
        rl.close();
    }
});`,
      java: `import java.util.*;

public class Solution {
    public static int search(int[] nums, int target) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        input = input.substring(1, input.length()-1);
        String[] parts = input.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        int target = sc.nextInt();
        
        System.out.println(search(nums, target));
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p19",
    title: "Subarray Sum Equals K",
    description:
      "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k. A subarray is a contiguous non-empty sequence of elements within an array.",
    difficulty: "medium",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "[1,1,1]\n2", expectedOutput: "2" },
      { input: "[1,2,3]\n3", expectedOutput: "2" },
    ],
    constraints:
      "1 <= nums.length <= 2 * 10^4\n-1000 <= nums[i] <= 1000\n-10^7 <= k <= 10^7",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int subarraySum(vector<int>& nums, int k) {
    // Write your code here
    
}

int main() {
    string input;
    getline(cin, input);
    vector<int> nums;
    input = input.substr(1, input.length()-2);
    size_t pos = 0;
    while((pos = input.find(',')) != string::npos) {
        nums.push_back(stoi(input.substr(0, pos)));
        input.erase(0, pos + 1);
    }
    if(!input.empty()) nums.push_back(stoi(input));
    
    int k;
    cin >> k;
    
    cout << subarraySum(nums, k) << endl;
    return 0;
}`,
      python: `def subarray_sum(nums, k):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    nums = json.loads(input())
    k = int(input())
    print(subarray_sum(nums, k))`,
      javascript: `function subarraySum(nums, k) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
    if(lines.length === 2) {
        const nums = JSON.parse(lines[0]);
        const k = parseInt(lines[1]);
        console.log(subarraySum(nums, k));
        rl.close();
    }
});`,
      java: `import java.util.*;

public class Solution {
    public static int subarraySum(int[] nums, int k) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        input = input.substring(1, input.length()-1);
        String[] parts = input.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        int k = sc.nextInt();
        
        System.out.println(subarraySum(nums, k));
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p20",
    title: "Binary Tree Level Order Traversal",
    description:
      "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    difficulty: "medium",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      {
        input: "[3,9,20,null,null,15,7]",
        expectedOutput: "[[3],[9,20],[15,7]]",
      },
      { input: "[1]", expectedOutput: "[[1]]" },
      { input: "[]", expectedOutput: "[]" },
    ],
    constraints:
      "The number of nodes in the tree is in the range [0, 2000]\n-1000 <= Node.val <= 1000",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

vector<vector<int>> levelOrder(TreeNode* root) {
    // Write your code here
    
}

int main() {
    // Tree construction from input
    // Level order output printing
    return 0;
}`,
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order(root):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    # Tree construction from input
    # Level order output printing`,
      javascript: `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function levelOrder(root) {
    // Write your code here
    
}

// Tree construction and output logic`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

public class Solution {
    public static List<List<Integer>> levelOrder(TreeNode root) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        // Tree construction from input
        // Level order output printing
    }
}`,
    },
    createdAt: Date.now(),
  },

  // ========== HARD PROBLEMS (10) ==========
  {
    problemId: "p21",
    title: "Median of Two Sorted Arrays",
    description:
      "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    difficulty: "hard",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "[1,3]\n[2]", expectedOutput: "2.0" },
      { input: "[1,2]\n[3,4]", expectedOutput: "2.5" },
    ],
    constraints:
      "nums1.length == m\nnums2.length == n\n0 <= m <= 1000\n0 <= n <= 1000\n1 <= m + n <= 2000\n-10^6 <= nums1[i], nums2[i] <= 10^6",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    // Write your code here
    
}

int main() {
    string input1, input2;
    getline(cin, input1);
    getline(cin, input2);
    vector<int> nums1, nums2;
    // Parsing logic
    
    cout << findMedianSortedArrays(nums1, nums2) << endl;
    return 0;
}`,
      python: `def find_median_sorted_arrays(nums1, nums2):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    nums1 = json.loads(input())
    nums2 = json.loads(input())
    print(find_median_sorted_arrays(nums1, nums2))`,
      javascript: `function findMedianSortedArrays(nums1, nums2) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
    if(lines.length === 2) {
        const nums1 = JSON.parse(lines[0]);
        const nums2 = JSON.parse(lines[1]);
        console.log(findMedianSortedArrays(nums1, nums2));
        rl.close();
    }
});`,
      java: `import java.util.*;

public class Solution {
    public static double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Parsing logic for two arrays
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p22",
    title: "Trapping Rain Water",
    description:
      "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    difficulty: "hard",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expectedOutput: "6" },
      { input: "[4,2,0,3,2,5]", expectedOutput: "9" },
    ],
    constraints:
      "n == height.length\n1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int trap(vector<int>& height) {
    // Write your code here
    
}

int main() {
    string input;
    getline(cin, input);
    vector<int> height;
    input = input.substr(1, input.length()-2);
    size_t pos = 0;
    while((pos = input.find(',')) != string::npos) {
        height.push_back(stoi(input.substr(0, pos)));
        input.erase(0, pos + 1);
    }
    if(!input.empty()) height.push_back(stoi(input));
    
    cout << trap(height) << endl;
    return 0;
}`,
      python: `def trap(height):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    height = json.loads(input())
    print(trap(height))`,
      javascript: `function trap(height) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const height = JSON.parse(line);
    console.log(trap(height));
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static int trap(int[] height) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        input = input.substring(1, input.length()-1);
        String[] parts = input.split(",");
        int[] height = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            height[i] = Integer.parseInt(parts[i]);
        }
        
        System.out.println(trap(height));
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p23",
    title: "N-Queens",
    description:
      "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order. Each solution contains a distinct board configuration of the n-queens' placement, where 'Q' and '.' both indicate a queen and an empty space, respectively.",
    difficulty: "hard",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      {
        input: "4",
        expectedOutput:
          '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]',
      },
      { input: "1", expectedOutput: '[["Q"]]' },
    ],
    constraints: "1 <= n <= 9",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<vector<string>> solveNQueens(int n) {
    // Write your code here
    
}

int main() {
    int n;
    cin >> n;
    vector<vector<string>> result = solveNQueens(n);
    
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        cout << "[";
        for(int j = 0; j < result[i].size(); j++) {
            cout << "\\"" << result[i][j] << "\\"";
            if(j < result[i].size()-1) cout << ",";
        }
        cout << "]";
        if(i < result.size()-1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      python: `def solve_n_queens(n):
    # Write your code here
    pass

if __name__ == "__main__":
    n = int(input())
    result = solve_n_queens(n)
    import json
    print(json.dumps(result))`,
      javascript: `function solveNQueens(n) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const n = parseInt(line);
    console.log(JSON.stringify(solveNQueens(n)));
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static List<List<String>> solveNQueens(int n) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<List<String>> result = solveNQueens(n);
        // Print logic
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p24",
    title: "Word Ladder",
    description:
      "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that: Every adjacent pair of words differs by a single letter. Every si for 1 <= i <= k is in wordList. sk == endWord. Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.",
    difficulty: "hard",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      {
        input: 'hit\ncog\n["hot","dot","dog","lot","log","cog"]',
        expectedOutput: "5",
      },
      {
        input: 'hit\ncog\n["hot","dot","dog","lot","log"]',
        expectedOutput: "0",
      },
    ],
    constraints:
      "1 <= beginWord.length <= 10\nendWord.length == beginWord.length\n1 <= wordList.length <= 5000\nwordList[i].length == beginWord.length",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    // Write your code here
    
}

int main() {
    string beginWord, endWord;
    getline(cin, beginWord);
    getline(cin, endWord);
    string listInput;
    getline(cin, listInput);
    vector<string> wordList;
    // Parsing logic
    
    cout << ladderLength(beginWord, endWord, wordList) << endl;
    return 0;
}`,
      python: `def ladder_length(begin_word, end_word, word_list):
    # Write your code here
    pass

if __name__ == "__main__":
    begin_word = input()
    end_word = input()
    import json
    word_list = json.loads(input())
    print(ladder_length(begin_word, end_word, word_list))`,
      javascript: `function ladderLength(beginWord, endWord, wordList) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
    if(lines.length === 3) {
        const beginWord = lines[0];
        const endWord = lines[1];
        const wordList = JSON.parse(lines[2]);
        console.log(ladderLength(beginWord, endWord, wordList));
        rl.close();
    }
});`,
      java: `import java.util.*;

public class Solution {
    public static int ladderLength(String beginWord, String endWord, List<String> wordList) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String beginWord = sc.nextLine();
        String endWord = sc.nextLine();
        // Word list parsing logic
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p25",
    title: "Merge k Sorted Lists",
    description:
      "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    difficulty: "hard",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "[[1,4,5],[1,3,4],[2,6]]", expectedOutput: "[1,1,2,3,4,4,5,6]" },
      { input: "[]", expectedOutput: "[]" },
      { input: "[[]]", expectedOutput: "[]" },
    ],
    constraints:
      "k == lists.length\n0 <= k <= 10^4\n0 <= lists[i].length <= 500\n-10^4 <= lists[i][j] <= 10^4",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* mergeKLists(vector<ListNode*>& lists) {
    // Write your code here
    
}

int main() {
    // Multiple linked lists construction
    // Output merged list
    return 0;
}`,
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_k_lists(lists):
    # Write your code here
    pass

if __name__ == "__main__":
    # Multiple linked lists construction
    # Output merged list
    pass`,
      javascript: `class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function mergeKLists(lists) {
    // Write your code here
    
}

// Multiple linked lists construction and output logic`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public class Solution {
    public static ListNode mergeKLists(ListNode[] lists) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        // Multiple linked lists construction
        // Output merged list
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p26",
    title: "Regular Expression Matching",
    description:
      "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where: '.' Matches any single character. '*' Matches zero or more of the preceding element. The matching should cover the entire input string (not partial).",
    difficulty: "hard",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "aa\na", expectedOutput: "false" },
      { input: "aa\na*", expectedOutput: "true" },
      { input: "ab\n.*", expectedOutput: "true" },
    ],
    constraints:
      "1 <= s.length <= 20\n1 <= p.length <= 30\ns contains only lowercase English letters\np contains only lowercase English letters, '.', and '*'",
    baseCode: {
      cpp: `#include <iostream>
#include <string>
using namespace std;

bool isMatch(string s, string p) {
    // Write your code here
    
}

int main() {
    string s, p;
    getline(cin, s);
    getline(cin, p);
    cout << (isMatch(s, p) ? "true" : "false") << endl;
    return 0;
}`,
      python: `def is_match(s, p):
    # Write your code here
    pass

if __name__ == "__main__":
    s = input()
    p = input()
    print("true" if is_match(s, p) else "false")`,
      javascript: `function isMatch(s, p) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
    if(lines.length === 2) {
        console.log(isMatch(lines[0], lines[1]) ? 'true' : 'false');
        rl.close();
    }
});`,
      java: `import java.util.*;

public class Solution {
    public static boolean isMatch(String s, String p) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        String p = sc.nextLine();
        System.out.println(isMatch(s, p) ? "true" : "false");
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p27",
    title: "Largest Rectangle in Histogram",
    description:
      "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
    difficulty: "hard",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "[2,1,5,6,2,3]", expectedOutput: "10" },
      { input: "[2,4]", expectedOutput: "4" },
    ],
    constraints: "1 <= heights.length <= 10^5\n0 <= heights[i] <= 10^4",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int largestRectangleArea(vector<int>& heights) {
    // Write your code here
    
}

int main() {
    string input;
    getline(cin, input);
    vector<int> heights;
    input = input.substr(1, input.length()-2);
    size_t pos = 0;
    while((pos = input.find(',')) != string::npos) {
        heights.push_back(stoi(input.substr(0, pos)));
        input.erase(0, pos + 1);
    }
    if(!input.empty()) heights.push_back(stoi(input));
    
    cout << largestRectangleArea(heights) << endl;
    return 0;
}`,
      python: `def largest_rectangle_area(heights):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    heights = json.loads(input())
    print(largest_rectangle_area(heights))`,
      javascript: `function largestRectangleArea(heights) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const heights = JSON.parse(line);
    console.log(largestRectangleArea(heights));
    rl.close();
});`,
      java: `import java.util.*;

public class Solution {
    public static int largestRectangleArea(int[] heights) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        input = input.substring(1, input.length()-1);
        String[] parts = input.split(",");
        int[] heights = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            heights[i] = Integer.parseInt(parts[i]);
        }
        
        System.out.println(largestRectangleArea(heights));
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p28",
    title: "Minimum Window Substring",
    description:
      "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string ''. The testcases will be generated such that the answer is unique.",
    difficulty: "hard",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "ADOBECODEBANC\nABC", expectedOutput: "BANC" },
      { input: "a\na", expectedOutput: "a" },
      { input: "a\naa", expectedOutput: "" },
    ],
    constraints:
      "m == s.length\nn == t.length\n1 <= m, n <= 10^5\ns and t consist of uppercase and lowercase English letters",
    baseCode: {
      cpp: `#include <iostream>
#include <string>
using namespace std;

string minWindow(string s, string t) {
    // Write your code here
    
}

int main() {
    string s, t;
    getline(cin, s);
    getline(cin, t);
    cout << minWindow(s, t) << endl;
    return 0;
}`,
      python: `def min_window(s, t):
    # Write your code here
    pass

if __name__ == "__main__":
    s = input()
    t = input()
    print(min_window(s, t))`,
      javascript: `function minWindow(s, t) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
    if(lines.length === 2) {
        console.log(minWindow(lines[0], lines[1]));
        rl.close();
    }
});`,
      java: `import java.util.*;

public class Solution {
    public static String minWindow(String s, String t) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        String t = sc.nextLine();
        System.out.println(minWindow(s, t));
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p29",
    title: "Sliding Window Maximum",
    description:
      "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.",
    difficulty: "hard",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "[1,3,-1,-3,5,3,6,7]\n3", expectedOutput: "[3,3,5,5,6,7]" },
      { input: "[1]\n1", expectedOutput: "[1]" },
    ],
    constraints:
      "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4\n1 <= k <= nums.length",
    baseCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    // Write your code here
    
}

int main() {
    string input;
    getline(cin, input);
    vector<int> nums;
    input = input.substr(1, input.length()-2);
    size_t pos = 0;
    while((pos = input.find(',')) != string::npos) {
        nums.push_back(stoi(input.substr(0, pos)));
        input.erase(0, pos + 1);
    }
    if(!input.empty()) nums.push_back(stoi(input));
    
    int k;
    cin >> k;
    
    vector<int> result = maxSlidingWindow(nums, k);
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        cout << result[i];
        if(i < result.size()-1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      python: `def max_sliding_window(nums, k):
    # Write your code here
    pass

if __name__ == "__main__":
    import json
    nums = json.loads(input())
    k = int(input())
    result = max_sliding_window(nums, k)
    print(json.dumps(result))`,
      javascript: `function maxSlidingWindow(nums, k) {
    // Write your code here
    
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
    if(lines.length === 2) {
        const nums = JSON.parse(lines[0]);
        const k = parseInt(lines[1]);
        console.log(JSON.stringify(maxSlidingWindow(nums, k)));
        rl.close();
    }
});`,
      java: `import java.util.*;

public class Solution {
    public static int[] maxSlidingWindow(int[] nums, int k) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        input = input.substring(1, input.length()-1);
        String[] parts = input.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        int k = sc.nextInt();
        
        int[] result = maxSlidingWindow(nums, k);
        System.out.print("[");
        for(int i = 0; i < result.length; i++) {
            System.out.print(result[i]);
            if(i < result.length-1) System.out.print(",");
        }
        System.out.println("]");
    }
}`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p30",
    title: "Serialize and Deserialize Binary Tree",
    description:
      "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment. Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.",
    difficulty: "hard",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      {
        input: "[1,2,3,null,null,4,5]",
        expectedOutput: "[1,2,3,null,null,4,5]",
      },
      { input: "[]", expectedOutput: "[]" },
    ],
    constraints:
      "The number of nodes in the tree is in the range [0, 10^4]\n-1000 <= Node.val <= 1000",
    baseCode: {
      cpp: `#include <iostream>
#include <string>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Codec {
public:
    string serialize(TreeNode* root) {
        // Write your code here
        
    }

    TreeNode* deserialize(string data) {
        // Write your code here
        
    }
};

int main() {
    // Tree serialization and deserialization testing
    return 0;
}`,
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    def serialize(self, root):
        # Write your code here
        pass
    
    def deserialize(self, data):
        # Write your code here
        pass

if __name__ == "__main__":
    # Tree serialization and deserialization testing
    pass`,
      javascript: `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Codec {
    serialize(root) {
        // Write your code here
        
    }
    
    deserialize(data) {
        // Write your code here
        
    }
}

// Tree serialization and deserialization testing`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

public class Codec {
    public String serialize(TreeNode root) {
        // Write your code here
        
    }

    public TreeNode deserialize(String data) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        // Tree serialization and deserialization testing
    }
}`,
    },
    createdAt: Date.now(),
  },
];


export async function POST() {
  try {
    // const data = await request.json();
    // if (!Array.isArray(data)) {
    //   return Response.json(
    //     {
    //       error: `Please send data in Array Format`,
    //     },
    //     { status: 400 }
    //   );
    // }
    for (const problem of problems) {
      await client.mutation(api.problems.addProblem, {
        problemId: problem.problemId || "",
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty || "easy",
        constraints: problem.constraints || "",
        languageSupport: problem.languageSupport || [
          "cpp",
          "python",
          "javascript",
          "java",
        ],
        testCases: problem.testCases || [],
        baseCode: problem.baseCode || {
          cpp: "",
          python: "",
          javascript: "",
          java: "",
        },
        createdAt: Date.now(),
      });
    }

    return Response.json({
      success: true,
      message: "Problems added successfully",
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
