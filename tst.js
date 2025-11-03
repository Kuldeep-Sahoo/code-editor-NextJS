const problems = [
  // Easy problems
  {
    problemId: "p1",
    title: "Sum of Two Numbers",
    description: `Given two numbers, return their sum.`,
    difficulty: "easy",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "1 2", expectedOutput: "3" },
      { input: "10 20", expectedOutput: "30" },
    ],
    constraints: "1 <= A, B <= 10^9",
    baseCode: {
      javascript: `
function sumOfTwoNumbers(A, B) {
  // Code here
}
`,
      cpp: `
#include <iostream>
using namespace std;
int sumOfTwoNumbers(int A, int B) {
    // Code here
}
int main() {
    int A, B;
    cin >> A >> B;
    cout << sumOfTwoNumbers(A, B);
    return 0;
}
`,
      python: `
def sumOfTwoNumbers(A, B):
    # Code here
`,
      java: `
public class Solution {
    public static int sumOfTwoNumbers(int A, int B) {
        // Code here
    }
    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        int A = sc.nextInt();
        int B = sc.nextInt();
        System.out.println(sumOfTwoNumbers(A, B));
    }
}
`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p2",
    title: "Find Maximum of Three Numbers",
    description: `Given three numbers, return the maximum.`,
    difficulty: "easy",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "1 2 3", expectedOutput: "3" },
      { input: "10 5 7", expectedOutput: "10" },
    ],
    constraints: "1 <= A, B, C <= 10^9",
    baseCode: {
      javascript: `
function maxOfThree(A, B, C) {
  // Code here
}
`,
      cpp: `
#include <iostream>
using namespace std;
int maxOfThree(int A, int B, int C) {
    // Code here
}
int main() {
    int A, B, C;
    cin >> A >> B >> C;
    cout << maxOfThree(A, B, C);
    return 0;
}
`,
      python: `
def maxOfThree(A, B, C):
    # Code here
`,
      java: `
public class Solution {
    public static int maxOfThree(int A, int B, int C) {
        // Code here
    }
    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        int A = sc.nextInt();
        int B = sc.nextInt();
        int C = sc.nextInt();
        System.out.println(maxOfThree(A, B, C));
    }
}
`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p3",
    title: "Check Even or Odd",
    description: `Given a number, check if it is even or odd.`,
    difficulty: "easy",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "4", expectedOutput: "Even" },
      { input: "7", expectedOutput: "Odd" },
    ],
    constraints: "1 <= N <= 10^9",
    baseCode: {
      javascript: `
function isEvenOrOdd(N) {
  // Code here
}
`,
      cpp: `
#include <iostream>
using namespace std;
string isEvenOrOdd(int N) {
    // Code here
}
int main() {
    int N;
    cin >> N;
    cout << isEvenOrOdd(N);
    return 0;
}
`,
      python: `
def isEvenOrOdd(N):
    # Code here
`,
      java: `
public class Solution {
    public static String isEvenOrOdd(int N) {
        // Code here
    }
    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        int N = sc.nextInt();
        System.out.println(isEvenOrOdd(N));
    }
}
`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p4",
    title: "Reverse a String",
    description: `Given a string, return its reverse.`,
    difficulty: "easy",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "test", expectedOutput: "tset" },
    ],
    constraints: "1 <= length of string <= 10^5",
    baseCode: {
      javascript: `
function reverseString(s) {
  // Code here
}
`,
      cpp: `
#include <iostream>
#include <string>
using namespace std;
string reverseString(string s) {
    // Code here
}
int main() {
    string s;
    cin >> s;
    cout << reverseString(s);
    return 0;
}
`,
      python: `
def reverseString(s):
    # Code here
`,
      java: `
public class Solution {
    public static String reverseString(String s) {
        // Code here
    }
    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        String s = sc.next();
        System.out.println(reverseString(s));
    }
}
`,
    },
    createdAt: Date.now(),
  },
  {
    problemId: "p5",
    title: "Check Palindrome Number",
    description: `Given a number, check if it is a palindrome.`,
    difficulty: "easy",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "121", expectedOutput: "True" },
      { input: "123", expectedOutput: "False" },
    ],
    constraints: "1 <= N <= 10^9",
    baseCode: {
      javascript: `
function isPalindromeNumber(N) {
  // Code here
}
`,
      cpp: `
#include <iostream>
using namespace std;
bool isPalindromeNumber(int N) {
    // Code here
}
int main() {
    int N;
    cin >> N;
    cout << (isPalindromeNumber(N) ? "True" : "False");
    return 0;
}
`,
      python: `
def isPalindromeNumber(N):
    # Code here
`,
      java: `
public class Solution {
    public static boolean isPalindromeNumber(int N) {
        // Code here
    }
    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        int N = sc.nextInt();
        System.out.println(isPalindromeNumber(N));
    }
}
`,
    },
    createdAt: Date.now(),
  },
  // 5 more easy problems with similar structure... (omitted for brevity in example)

  // Medium problems
  {
    problemId: "p11",
    title: "Find the Majority Element",
    description: `Given an array of size n, find the majority element. The majority element is the element that appears more than n/2 times.`,
    difficulty: "medium",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "3\n3 3 4", expectedOutput: "3" },
      { input: "4\n2 2 1 1", expectedOutput: "-1" },
    ],
    constraints: "1 <= n <= 10^5, -10^9 <= arr[i] <= 10^9",
    baseCode: {
      javascript: `
function findMajorityElement(arr) {
  // Code here
}
`,
      cpp: `
#include <iostream>
#include <vector>
using namespace std;
int findMajorityElement(vector<int>& arr) {
    // Code here
}
int main() {
    int n; cin >> n;
    vector<int> arr(n);
    for(int i=0; i<n; i++) cin >> arr[i];
    cout << findMajorityElement(arr);
    return 0;
}
`,
      python: `
def findMajorityElement(arr):
    # Code here
`,
      java: `
import java.util.*;
public class Solution {
    public static int findMajorityElement(int[] arr) {
        // Code here
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for(int i=0; i<n; i++) arr[i] = sc.nextInt();
        System.out.println(findMajorityElement(arr));
    }
}
`,
    },
    createdAt: Date.now(),
  },
  // 9 more medium problems with similar schema (omitted for brevity)...

  // Hard problems
  {
    problemId: "p21",
    title: "Longest Increasing Subsequence",
    description: `Find the length of the longest increasing subsequence in an array.`,
    difficulty: "hard",
    languageSupport: ["cpp", "python", "javascript", "java"],
    testCases: [
      { input: "5\n10 9 2 5 3", expectedOutput: "2" },
      { input: "6\n1 2 1 3 2 4", expectedOutput: "4" },
    ],
    constraints: "1 <= n <= 10^5, 1 <= arr[i] <= 10^9",
    baseCode: {
      javascript: `
function longestIncreasingSubsequence(arr) {
  // Code here
}
`,
      cpp: `
#include <iostream>
#include <vector>
using namespace std;
int longestIncreasingSubsequence(vector<int>& arr) {
    // Code here
}
int main() {
    int n; cin >> n;
    vector<int> arr(n);
    for(int i=0; i<n; i++) cin >> arr[i];
    cout << longestIncreasingSubsequence(arr);
    return 0;
}
`,
      python: `
def longestIncreasingSubsequence(arr):
    # Code here
`,
      java: `
import java.util.*;
public class Solution {
    public static int longestIncreasingSubsequence(int[] arr) {
        // Code here
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for(int i=0; i<n; i++) arr[i] = sc.nextInt();
        System.out.println(longestIncreasingSubsequence(arr));
    }
}
`,
    },
    createdAt: Date.now(),
  },
  // 9 more hard problems with similar schema (omitted for brevity)...
];
